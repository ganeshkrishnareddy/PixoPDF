/**
 * PixoPDF Editor Export Utility
 * Serializes local workspace objects to final pdf-lib output bytes.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { MemoryManager } from '../core/memory-manager.js';

export const ExportManager = {
  /**
   * Embeds all edited elements into the source document.
   * @param {File|Blob} pdfFile Original file
   * @param {Object} state EditorState instance reference
   * @param {Object} options Configuration parameters
   * @param {boolean} options.rasterizeRedactions Whether to rebuild pages containing redactions as flattened graphic canvases
   * @param {Function} onProgress progress callback(msg, percent)
   * @returns {Promise<Blob>} Final PDF Blob
   */
  async export(pdfFile, state, options, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }

    onProgress('Loading source document structure...', 20);
    const fileBuffer = await FileReaderUtil.readAsArrayBuffer(pdfFile);
    const doc = await window.PDFLib.PDFDocument.load(fileBuffer);
    const pages = doc.getPages();

    // Map fonts
    const standardFonts = {
      'Helvetica': window.PDFLib.StandardFonts.Helvetica,
      'Helvetica-Bold': window.PDFLib.StandardFonts.HelveticaBold,
      'Times Roman': window.PDFLib.StandardFonts.TimesRoman,
      'Courier': window.PDFLib.StandardFonts.Courier
    };

    const embeddedFonts = {};
    for (const [name, key] of Object.entries(standardFonts)) {
      embeddedFonts[name] = await doc.embedFont(key);
    }

    const objects = state.objects;
    const totalObjects = objects.length;

    onProgress('Embedding editing layers...', 50);
    for (let i = 0; i < totalObjects; i++) {
      const obj = objects[i];
      const page = pages[obj.pageIndex];
      if (!page) continue;

      const { height: pdfHeight } = page.getSize();
      
      // Calculate coordinates relative to PDF bounds
      // Recall that editor-state stores unzoomed points (divided by zoom at input time)
      const pdfX = obj.x;
      const pdfY = pdfHeight - obj.y - obj.height; // Translate top-left browser to bottom-left PDF

      if (obj.type === 'text') {
        const fontName = obj.properties.font || 'Helvetica';
        const fontSize = obj.properties.fontSize || 12;
        const font = embeddedFonts[fontName] || embeddedFonts['Helvetica'];
        const colorHex = obj.properties.color || '#000000';
        
        // Parse hex color to rgb decimal
        const r = parseInt(colorHex.substr(1, 2), 16) / 255;
        const g = parseInt(colorHex.substr(3, 2), 16) / 255;
        const b = parseInt(colorHex.substr(5, 2), 16) / 255;

        page.drawText(obj.properties.text || '', {
          x: pdfX,
          y: pdfY + 4, // Minor offset adjustment
          size: fontSize,
          font: font,
          color: window.PDFLib.rgb(r, g, b)
        });
      }
      
      else if (obj.type === 'signature' || obj.type === 'image') {
        const rawData = obj.properties.dataUrl;
        if (rawData) {
          // Parse base64 string
          const binaryStr = atob(rawData.split(',')[1]);
          const bytes = new Uint8Array(binaryStr.length);
          for (let k = 0; k < binaryStr.length; k++) {
            bytes[k] = binaryStr.charCodeAt(k);
          }

          let img;
          if (rawData.includes('image/png')) {
            img = await doc.embedPng(bytes);
          } else {
            img = await doc.embedJpg(bytes);
          }

          page.drawImage(img, {
            x: pdfX,
            y: pdfY,
            width: obj.width,
            height: obj.height
          });
        }
      }
      
      else if (obj.type === 'checkmark') {
        // Draw vector character for checkmarks
        page.drawText('✓', {
          x: pdfX + 2,
          y: pdfY + 2,
          size: obj.height * 0.8,
          font: embeddedFonts['Helvetica-Bold'],
          color: window.PDFLib.rgb(0.3, 0.3, 0.9)
        });
      }
      
      else if (obj.type === 'rectangle') {
        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: obj.width,
          height: obj.height,
          borderColor: window.PDFLib.rgb(0.3, 0.3, 0.9),
          borderWidth: 2
        });
      }
      
      else if (obj.type === 'highlight') {
        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: obj.width,
          height: obj.height,
          color: window.PDFLib.rgb(1.0, 1.0, 0.0),
          opacity: 0.4
        });
      }
      
      else if (obj.type === 'underline') {
        page.drawLine({
          start: { x: pdfX, y: pdfY },
          end: { x: pdfX + obj.width, y: pdfY },
          thickness: 2,
          color: window.PDFLib.rgb(0.3, 0.3, 0.9)
        });
      }
      
      else if (obj.type === 'strikeout') {
        page.drawLine({
          start: { x: pdfX, y: pdfY + obj.height / 2 },
          end: { x: pdfX + obj.width, y: pdfY + obj.height / 2 },
          thickness: 2,
          color: window.PDFLib.rgb(0.9, 0.2, 0.2)
        });
      }
    }

    onProgress('Saving final output bytes...', 85);
    const outputBytes = await doc.save();
    const outputBlob = new Blob([outputBytes], { type: 'application/pdf' });

    MemoryManager.wipeArrayBufferRefs(fileBuffer);
    MemoryManager.wipeArrayBufferRefs(outputBytes);

    onProgress('Done!', 100);
    return outputBlob;
  }
};

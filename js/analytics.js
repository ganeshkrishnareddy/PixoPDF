/**
 * ZeroPDF Analytics Abstraction (Disabled for Privacy)
 * Prevents transmitting document content, names, or signature data.
 */

export const Analytics = {
  /**
   * Dispatches analytics log securely without third-party leakages.
   * @param {string} eventName 
   * @param {Object} properties 
   */
  trackEvent(eventName, properties = {}) {
    // Zero telemetry leaks. Merely print to debug console during development.
    const secureProps = { ...properties };
    delete secureProps.filename;
    delete secureProps.fileContent;
    delete secureProps.text;
    delete secureProps.imageData;

    console.debug(`[ZeroPDF Telemetry] Event: ${eventName}`, secureProps);
  }
};

# Privacy Architecture Rule (ZeroPDF)

ZeroPDF is built on the core promise of **Zero Cost. Zero Signup. Zero File Storage.**
To uphold this absolute privacy standard, this document outlines the mandatory rules governing all client-side operations.

## Core Privacy Directives

1. **No Processing Network Requests**:
   All operations (Merge, Split, Compress, JPG to PDF, PDF to JPG) must execute 100% in the user's browser. Files, documents, images, and text content must never be transmitted via `fetch()`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, HTML `<form>` submissions, or any third-party APIs.

2. **In-Memory Storage Bounds**:
   Files uploaded via user interaction exist only in-memory as JavaScript objects:
   - `File` / `Blob` arrays
   - `ArrayBuffer` allocations
   - `Object URL` representations
   - Canvas context rendering stores

3. **No Persistent Client-Side Storage**:
   Document data, file buffers, thumbnails, and preview structures must **never** be saved in:
   - `localStorage`
   - `sessionStorage`
   - `IndexedDB`
   - `Cache Storage`
   - Cookies

   *Note: Only interface states (e.g. system light/dark theme preference) are permitted in `localStorage`.*

4. **Resource Cleanup & Deallocation**:
   - Immediately revoke browser Object URLs when they are no longer needed:
     ```javascript
     URL.revokeObjectURL(objectUrl);
     ```
   - Clear canvas memories immediately after converting or creating pages:
     ```javascript
     canvas.width = 0;
     canvas.height = 0;
     ```
   - Nullify variables holding large `ArrayBuffer` payloads when processing ends to flag them for garbage collection.

5. **Analytics Privacy**:
   No filenames, page counts, metadata, text extracts, or actual document bytes may be included in analytics payloads. Only generic lifecycle events are logged (e.g. `tool_page_view`, `processing_started`, `processing_completed`, `processing_failed`).

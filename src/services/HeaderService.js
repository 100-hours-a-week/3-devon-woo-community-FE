let headerInstance = null;
const pendingCallbacks = new Set();

function notifyReady(instance) {
  pendingCallbacks.forEach((callback) => {
    try {
      callback(instance);
    } catch (error) {
      console.error('HeaderService callback error:', error);
    }
  });
  pendingCallbacks.clear();
}

export function registerHeader(instance) {
  headerInstance = instance;
  notifyReady(instance);
}

export function getHeader() {
  return headerInstance;
}

export function onHeaderReady(callback) {
  if (headerInstance) {
    callback(headerInstance);
    return () => {};
  }
  pendingCallbacks.add(callback);
  return () => pendingCallbacks.delete(callback);
}

export function withHeader(handler) {
  if (headerInstance) {
    handler(headerInstance);
  } else {
    onHeaderReady(handler);
  }
}

export function hideHeader() {
  withHeader((header) => header.hide());
}

export function showHeader() {
  withHeader((header) => header.show());
}

export function setHeaderVariant(variant) {
  withHeader((header) => header.setVariant(variant));
}

export function syncHeaderWithRoute(path) {
  withHeader((header) => {
    header.setCurrentPage(path);
  });
}

export function refreshHeaderProfileImage() {
  withHeader((header) => {
    if (header.refreshProfileImage) {
      header.refreshProfileImage();
    }
  });
}

export function refreshAuthState() {
  withHeader((header) => {
    if (header.updateAuthState) {
      header.updateAuthState();
    }
  });
}

const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const i18nextBackend = require("i18next-electron-fs-backend");
const Store = require("secure-electron-store").default;
const ContextMenu = require("secure-electron-context-menu").default;
// Create the electron store to be made available in the renderer process
const store = new Store();
const keytar = require("keytar");

// expose keytar methods
class SecureKeytar {
  preloadBindings(ipcRenderer) {
    console.log(ipcRenderer);
    return {
      getPassword(service, account) {
        return keytar.getPassword(service, account);
      },

      deletePassword(service, account) {
        return keytar.deletePassword(service, account);
      },

      findCredentials(service) {
        return keytar.findCredentials(service);
      },

      findPassword(service) {
        return keytar.findPassword(service);
      },
      setPassword(service, account, password) {
        return keytar.setPassword(service, account, password);
      }
    };
  }
}

const secureKeytar = new SecureKeytar();

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  i18nextElectronBackend: i18nextBackend.preloadBindings(ipcRenderer),
  store: store.preloadBindings(ipcRenderer, fs),
  contextMenu: ContextMenu.preloadBindings(ipcRenderer),
  keytar: secureKeytar.preloadBindings(ipcRenderer)
});

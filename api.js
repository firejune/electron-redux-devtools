const electron = require('electron')
const { compose } = require('redux');

// devtools-extension install
exports.install = (autoReload) => {
  if (!electron.remote) {
    throw new Error('Redux DevTools can only be installed from an renderer process.')
  }

  const extensions = electron.remote.BrowserWindow.getDevToolsExtensions()
  if (extensions && extensions['Redux DevTools']) return

  const path = electron.remote.BrowserWindow.addDevToolsExtension(`${__dirname}/build`)
  console.log(`Installing Redux DevTools from ${__dirname}/build`)

  if (autoReload === true) electron.remote.getCurrentWindow().reload();

  return path
}

// devtools-extension uninstall
exports.uninstall = () => {
  if (!electron.remote) {
    throw new Error('Redux DevTools can only be uninstalled from an renderer process.')
  }
  return electron.remote.BrowserWindow.removeDevToolsExtension('Redux Developer Tools')
}

exports.composeWithDevTools = (
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
      if (arguments.length === 0) return undefined
      if (typeof arguments[0] === 'object') return compose
      return compose.apply(null, arguments)
    }
)

exports.devToolsEnhancer = (
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ ?
    window.__REDUX_DEVTOOLS_EXTENSION__ : function() { return function(noop) { return noop } }
)

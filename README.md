# Redux DevTools Extension for Electron

Simple installing and using Redux DevTools Extension on Electron

## Installing

```sh
npm install --save-dev electron-redux-devtools
or
npm install --save-dev firejune/electron-redux-devtools
```

Then execute the following from the Console tab of your running Electron app's
developer tools:

```js
require('electron-react-devtools').install()
```

And than refresh or restart the renderer process, you can see a `Redux` tab added.

## Connecting Redux Store

### 1.1 Basic store
  
For a basic [Redux store](http://redux.js.org/docs/api/createStore.html) simply add:
```diff
 const store = createStore(
   reducer, /* preloadedState, */
+  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 );
```

Note that [`preloadedState`](http://redux.js.org/docs/api/createStore.html) argument is optional in Redux' [`createStore`](http://redux.js.org/docs/api/createStore.html).

> For universal ("isomorphic") apps, prefix it with `typeof window !== 'undefined' &&`.

In case ESLint is configured to not allow using the underscore dangle, wrap it like so:
```diff
+ /* eslint-disable no-underscore-dangle */
  const store = createStore(
   reducer, /* preloadedState, */
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
+ /* eslint-enable */
```

> You don't need to npm install [`redux-devtools`](https://github.com/gaearon/redux-devtools) when using the extension (that's a different lib).

### 1.2 Advanced store setup
If you setup your store with [middleware and enhancers](http://redux.js.org/docs/api/applyMiddleware.html), change:
```diff
  import { createStore, applyMiddleware, compose } from 'redux';

+ const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
+ const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
- const store = createStore(reducer, /* preloadedState, */ compose(
    applyMiddleware(...middleware)
  ));
```
> Note that when the extension is not installed, we’re using Redux compose here.
  
To specify [extension’s options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md), use it like so:
```js
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middleware),
  // other store enhancers if any
);
const store = createStore(reducer, enhancer);
```

> [See the post for more details](https://medium.com/@zalmoxis/improve-your-development-workflow-with-redux-devtools-extension-f0379227ff83).

### 1.3 Use `redux-devtools-extension` package from npm

To use like so:
```js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'electron-redux-devtools';

const store = createStore(reducer, composeWithDevTools(
  applyMiddleware(...middleware),
  // other store enhancers if any
));
```

To specify extension’s options:
```js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'electron-redux-devtools';

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});
const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(...middleware),
  // other store enhancers if any
));
```  

In case you don't include other enhancers and middlewares, just use `devToolsEnhancer`:
```js
import { createStore } from 'redux';
import { devToolsEnhancer } from 'electron-redux-devtools';

const store = createStore(reducer, /* preloadedState, */ devToolsEnhancer(
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
));
```    

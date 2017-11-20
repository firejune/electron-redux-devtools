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

> **Note**: Passing enhancer as last argument requires **redux@>=3.1.0**. For older versions apply it like [here](https://github.com/zalmoxisus/redux-devtools-extension/blob/v0.4.2/examples/todomvc/store/configureStore.js) or [here](https://github.com/zalmoxisus/redux-devtools-extension/blob/v0.4.2/examples/counter/store/configureStore.js#L7-L12). Don't mix the old Redux API with the new one.

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

To make things easier, there's an npm package to install:
```
npm install --save-dev redux-devtools-extension
```
and to use like so:
```js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(reducer, composeWithDevTools(
  applyMiddleware(...middleware),
  // other store enhancers if any
));
```
To specify [extension’s options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#windowdevtoolsextensionconfig):
```js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});
const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(...middleware),
  // other store enhancers if any
));
```  
> There’re just [few lines of code](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/npm-package/index.js) added to your bundle.

In case you don't include other enhancers and middlewares, just use `devToolsEnhancer`:
```js
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

const store = createStore(reducer, /* preloadedState, */ devToolsEnhancer(
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
));
```    

### 1.4 Using in production
It's useful to include the extension in production as well. Usually you [can use it for development](https://medium.com/@zalmoxis/using-redux-devtools-in-production-4c5b56c5600f). 

If you want to restrict it there, use `redux-devtools-extension/logOnlyInProduction`:
```js
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction';

const store = createStore(reducer, /* preloadedState, */ devToolsEnhancer(
  // options like actionSanitizer, stateSanitizer
));
```
or with middlewares and enhancers:
 ```js
 import { createStore, applyMiddleware } from 'redux';
 import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

 const composeEnhancers = composeWithDevTools({
   // options like actionSanitizer, stateSanitizer
 });
 const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
   applyMiddleware(...middleware),
   // other store enhancers if any
 ));
 ```
>  You'll have to add `'process.env.NODE_ENV': JSON.stringify('production')` in your Webpack config for the production bundle ([to envify](https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md#exclude-devtools-from-production-builds)). If you use `create-react-app`, [it already does it for you.](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/webpack.config.prod.js#L253-L257)

 If you're already checking `process.env.NODE_ENV` when creating the store, include `redux-devtools-extension/logOnly` for production enviroment.

 If you don’t want to allow the extension in production, just use `redux-devtools-extension/developmentOnly`.

> See [the article](https://medium.com/@zalmoxis/using-redux-devtools-in-production-4c5b56c5600f) for more details. 

### 1.5 For React Native, hybrid, desktop and server side Redux apps
For React Native we can use [`react-native-debugger`](https://github.com/jhen0409/react-native-debugger), which already included [the same API](https://github.com/jhen0409/react-native-debugger/blob/master/docs/redux-devtools-integration.md) with Redux DevTools Extension.

For most platforms, include [`Remote Redux DevTools`](https://github.com/zalmoxisus/remote-redux-devtools)'s store enhancer, and from the extension's context menu choose 'Open Remote DevTools' for remote monitoring.

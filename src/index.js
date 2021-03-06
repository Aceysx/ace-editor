import React from 'react'
import ReactDOM from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import App from './ui/app'
import reducer from './redux/reducers'
import updateStoreToLocalStorageMiddleware from './ui/middleware/update-store-to-local-storage-middleware';

import './resources/css/overwrite-antd-style.css'

const initStore = () => {
  let store = window.localStorage.getItem('store')
  return store ? JSON.parse(store) : {}
}
const isNeedResetEnv = () => {
  const currentVersion = process.env.REACT_APP_VERSION
  let workspace = window.localStorage.getItem('workspace');
  let version = window.localStorage.getItem('version');
  if (workspace && currentVersion.toString() !== version) {
    window.localStorage.setItem('version', currentVersion)
    return true
  }
  return false
}
if (isNeedResetEnv()) {
  window.localStorage.removeItem("workspace")
  window.localStorage.removeItem("store")
}
window.getNoteWorkspacePath = () => window.localStorage.getItem('workspace');
window.getNoteTagsPath = () => window.localStorage.getItem('workspace') + '/__tags'
window.getCardsPath = () => window.localStorage.getItem('workspace') + '/__cards/__cardsReview'
window.getTimecardPath = () => window.localStorage.getItem('workspace') + '/__timecard/'

const store = createStore(reducer, initStore(), applyMiddleware(thunkMiddleware, updateStoreToLocalStorageMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'),
)

import 'babel-polyfill'
import 'whatwg-fetch'
import React from 'react'
import {render} from 'react-dom'
import Application from './containers/application'
import configureStore from './redux/configure-store'

const store = configureStore(window.__INITIAL_STATE__)

render(
  <Application store={store} />,
  document.getElementById('application')
)

import React from 'react'
import {render} from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import {browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import Root from './components/Root'
import store from './state/store'
const history = syncHistoryWithStore(browserHistory, store)

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('application')
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const NextApp = require('./components/Root').default
    render(
      <AppContainer>
        <NextApp store={store} history={history} />
      </AppContainer>,
      document.getElementById('application')
    )
  })
}

console.error = (() => {
  const error = console.error
  return function (exception) {
    (exception && typeof exception === 'string' && exception.match(/change <Router /))
    ? undefined
    : error.apply(console, arguments)
  }
})()

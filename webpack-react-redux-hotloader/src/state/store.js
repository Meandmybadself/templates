import {combineReducers, createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {browserHistory} from 'react-router'
import {routerReducer, routerMiddleware} from 'react-router-redux'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const rootReducer = combineReducers({
  routing: routerReducer
})

const store = createStore(rootReducer,
  composeEnhancers(
    applyMiddleware(thunk, routerMiddleware(browserHistory))
  )
)

export default store

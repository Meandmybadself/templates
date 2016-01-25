import {createStore, applyMiddleware, compose} from 'redux'
import createHistory from 'history/lib/createBrowserHistory'
import routes from '../routes/routes'
import {reduxReactRouter} from 'redux-router';
import thunk from 'redux-thunk'
import rootReducer from './reducers/root-reducer'
import createLogger from 'redux-logger';

const logger = createLogger()
const composedCreateStore = compose(
  applyMiddleware(thunk, logger),
  reduxReactRouter({routes, createHistory})
)(createStore)

export default function configureStore(initialState) {
  return composedCreateStore(rootReducer, initialState)
}

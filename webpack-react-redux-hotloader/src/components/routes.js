import React, {Component} from 'react'
import {Router, Route, IndexRoute} from 'react-router'

import Home from './home/HomeScreen'
import Unknown from './unknown/UnknownScreen'

export default class Routes extends Component {
  render () {
    return (
      <Router history={this.props.history}>
        <Route path='/'>
          <IndexRoute component={Home} />
          <Route path='*' component={Unknown} />
        </Route>
      </Router>
    )
  }
}

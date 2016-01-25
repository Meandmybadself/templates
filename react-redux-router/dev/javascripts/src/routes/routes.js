import React, {Component} from 'react'
import {Router, Route, IndexRoute, Link} from 'react-router'
import {connect} from 'react-redux'
import SiteWrapper from '../containers/site-wrapper'

export default (
  <Router>
    <Route path="/" component={SiteWrapper}></Route>
  </Router>
)

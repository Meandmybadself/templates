import React, {Component} from 'react'

export default class HomeScreenConnected extends Component {
  constructor (props) {
    super(props)
  }
  render (props) {
    return (
      <HomeScreen {...props} />
    )
  }
}

class HomeScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render (props) {
    return (
      <div className='page page--home'>
        <h1>Home</h1>
      </div>
    )
  }
}

import React, {Component} from 'react'

export default class UnknownConnected extends Component {
  constructor (props) {
    super(props)
  }
  render (props) {
    return (
      <UnknownScreen {...props} />
    )
  }
}

class UnknownScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render (props) {
    return (
      <div className='page page--unknown'>
        <h1>UnknownScreen</h1>
      </div>
    )
  }
}

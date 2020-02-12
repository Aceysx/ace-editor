import React from 'react'

import '../../resources/css/search_bar.css'

export default class SearchBar extends React.Component {
  state = {
    content: ''
  }

  onKeyUp = e => {
    if (e.keyCode === 13) {
      this.props.searchFiles(this.state.content)
    }
  }

  render() {
    return <div className="container cursor_pointer">
      <input type="text"
             onKeyUp={this.onKeyUp}
             onChange={e => this.setState({content: e.target.value})}
             placeholder="Search by tag | file "/>
      <div className="search cursor_pointer"></div>
    </div>
  }
}

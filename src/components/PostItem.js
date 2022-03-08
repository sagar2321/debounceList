import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import UseImg from "./useImg"

class PostItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = { post: props.post }
  }

  handlePostClick (postId) {
    this.props.history.push({ pathname: `/post/${postId}` })
  }

  render () {
    return (
      <ListItem style={{  border: '1px solid rgba(0, 0, 0, 1.05)', marginBottom: "10px"}}button onClick={() => this.handlePostClick(this.state.post.id)}>
        <ListItemText primary={this.state.post.title} />
        <div className='imgCont'>
        <UseImg />
        </div>

      </ListItem>
    )
  }
}

export default PostItem

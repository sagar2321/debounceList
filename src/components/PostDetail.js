import React from 'react'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import UseImg from "./useImg"

class PostDetail extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isDataLoading: true,
      postId: props.match.params.postId,
      userId: null,
      post: null
    }

    this.source = axios.CancelToken.source()
    this.postLoadPromise = Promise.resolve()
  }

  componentDidMount () {
    this.postLoadPromise = this.loadPost()
      .then(() => this.loadUser())
      .then(() => {
        this.setState({ isDataLoading: false })
      })
  }

  componentWillUnmount () {
    this.source.cancel()
  }

  loadPost () {
    const url = `http://jsonplaceholder.typicode.com/posts/${this.state.postId}`
    return axios.get(url, { cancelToken: this.source.token })
      .then((response) => {
        return this.setState({ post: response.data })
      })
      .catch((error) => {
        if (axios.isCancel(error)) { return }
        throw error
      })
  }

  loadUser () {
    const url = `http://jsonplaceholder.typicode.com/users/${this.state.post.userId}`
    return axios.get(url, { cancelToken: this.source.token })
      .then((response) => {
        return this.setState({ user: response.data })
      })
      .catch((error) => {
        if (axios.isCancel(error)) { return }
        throw error
      })
  }

  render () {
    const post = () => {
      if (this.state.isDataLoading) {
        return <Grid item><CircularProgress /></Grid>
      } else {
        return (
          <Grid item style={{ maxWidth: 360, background:"grey" }}>
            <Typography variant='title' component='h1'><u>Title</u>: {this.state.post.title}</Typography>
            <br />
            <Typography>{this.state.post.body}</Typography>
            <br />
           <UseImg />
            <br />
            <Typography variant='title' component='h2'><u>Author</u>: {this.state.user.username}</Typography>
          </Grid>
        )
      }
    }

    return (
      <Grid container spacing={24} direction='column' alignItems='center' justify='center'>
        {post()}
      </Grid>
    )
  }
}

export default PostDetail

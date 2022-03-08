import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import List from '@material-ui/core/List'
import PostItem from './PostItem'
import { withRouter } from 'react-router-dom'
import debounce from 'lodash.debounce';

class MainPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDataLoading: true,
      posts: [],
      searchTerm: '',
      searchVal: ''
    }

    this.source = axios.CancelToken.source()
    this.postsLoadPromise = Promise.resolve()
  }

  debouncedText = debounce(text => this.setState({ searchVal: text }))

  componentDidMount() {
    this.postsLoadPromise = this.loadPosts()
  }

  componentWillUnmount() {
    this.source.cancel()
  }

  handleChange = (e) => {
    console.log("e >>", e.target.value)
    this.setState({ searchTerm: e.target.value });
    this.debouncedText(e.target.value)
  }

  loadPosts() {
    return axios.get('http://jsonplaceholder.typicode.com/posts', { cancelToken: this.source.token })
      .then((response) => {
        return this.setState({
          isDataLoading: false,
          posts: response.data
        })
      })
      .catch((error) => {
        if (axios.isCancel(error)) { return }
        throw error
      })
  }

  render() {
    const posts = () => {
      if (this.state.isDataLoading) {
        return (
          <Grid item>
            <CircularProgress />
          </Grid>
        )
      } else {

        console.log("this.state.post>>", this.state.posts)
        let listToDisplay = [];
        if (this.state.searchTerm !== "") {

          listToDisplay = this.state.posts.filter((post) => {
            return post.title.includes(this.state.searchVal);
          });

          console.log("found>>", listToDisplay)

          return (
            <List style={{ width: '100%', maxWidth: 360 }}>

{listToDisplay && listToDisplay.map(post =>{
            return(
                <PostItem
                key={`post_${post.id}`}
                post={post}
                history={this.props.history}
              />
            )
          })
        }
            </List>
          )
        } else {

          return (
            <List style={{ width: '100%', maxWidth: 360 }}>
              {this.state.posts.map(post =>
                <PostItem
                  key={`post_${post.id}`}
                  post={post}
                  history={this.props.history}
                />
              )}
            </List>
          )
        }

      }
    }

    return (
      <Grid container spacing={24} direction="column"
        justifyContent="space-around"
        alignItems="center">
        <Grid item>
          <Typography variant='title' component='h1'>Posts list</Typography>
          <input type="text" value={this.state.searchTerm} onChange={(e) => { this.handleChange(e) }} />
        </Grid>
        {posts()}
      </Grid>
    )
  }
}

export default withRouter(MainPage)

import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import MainPage from './MainPage'
import PostDetail from './PostDetail'

const ReactRouter = () => {
  return (
    <Router>
      <div>
        <Route exact path='/' component={MainPage} />
        <Route path='/post/:postId' component={PostDetail} />
      </div>
    </Router>
  )
}

export default ReactRouter

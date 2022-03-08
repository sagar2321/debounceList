import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { MemoryRouter } from 'react-router-dom'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import MainPage from './MainPage'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import PostItem from './PostItem'
import ListItem from '@material-ui/core/ListItem'

describe('Given I\'m on debouncelist main page', () => {
  let wrapper
  let mainPage

  const typoPosition = {
    title: 0
  }

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    )
    mainPage = wrapper.find(MainPage.WrappedComponent).instance()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('When the data are loading', () => {
    beforeAll(() => {
      Enzyme.configure({ adapter: new Adapter(), delayResponse: 2000 })
      const mock = new MockAdapter(axios)
      mock.onGet('http://jsonplaceholder.typicode.com/posts').reply(200, [])
    })

    test('Then I see the title Posts list', () => {
      const title = wrapper.find(Typography).at(typoPosition.title)
      expect(title.text()).toEqual('Posts list')
    })

    test('Then I see an indicator shows data are loading', () => {
      const indicator = wrapper.find(CircularProgress)
      expect(indicator).toHaveLength(1)
    })
  })

  describe('When the data is loaded', () => {
    beforeAll(() => {
      Enzyme.configure({ adapter: new Adapter() })
      const mock = new MockAdapter(axios)
      let data = [
        {
          'userId': 1,
          'id': 1,
          'title': 'First Fake Post',
          'body': 'First Post body'
        },
        {
          'userId': 1,
          'id': 2,
          'title': 'Second Fake Post',
          'body': 'Second Post body'
        }
      ]
      mock.onGet('http://jsonplaceholder.typicode.com/posts').reply(200, data)
    })

    test('Then the loading indicator is hidden', () => {
      expect.assertions(1)
      return mainPage.postsLoadPromise.then(() => {
        wrapper.update()
        const indicator = wrapper.find(CircularProgress)
        expect(indicator).toHaveLength(0)
      })
    })

    test('Then the posts are shown', () => {
      expect.assertions(1)
      return mainPage.postsLoadPromise.then(() => {
        wrapper.update()
        const posts = wrapper.find(PostItem)
        expect(posts).toHaveLength(2)
      })
    })

    test('Then posts show their title', () => {
      expect.assertions(2)
      return mainPage.postsLoadPromise.then(() => {
        wrapper.update()
        const firstPost = wrapper.find(PostItem).first()
        expect(firstPost.find(Typography).text()).toBe('First Fake Post')
        const secondPost = wrapper.find(PostItem).at(1)
        expect(secondPost.find(Typography).text()).toBe('Second Fake Post')
      })
    })

    test('Then if I click on a post, that open the detail page', () => {
      expect.assertions(4)
      return mainPage.postsLoadPromise.then(() => {
        wrapper.update()
        const post = wrapper.find(PostItem).first()
        const history = post.props().history
        expect(history).toHaveLength(1)
        post.find(ListItem).props().onClick()
        expect(history).toHaveLength(2)
        expect(history.action).toBe('PUSH')
        expect(history.location.pathname).toBe('/post/1')
      })
    })
  })
})

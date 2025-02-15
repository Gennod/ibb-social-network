import React from 'react'
import AuthButton from './components/AuthButton'
import PostForm from './components/PostForm'
import PostList from './components/PostList'
import { auth } from './firebase'
import { store } from './store/store'
import { setUser } from './store/features/authSlice'

import "./App.scss"


export default function App() {
  auth.onAuthStateChanged((user) => {
    store.dispatch(setUser(user ? user : null))
  })

  return (
    <div className='app'>
      <AuthButton />
      <PostForm />
      <PostList />
    </div>
  )
}

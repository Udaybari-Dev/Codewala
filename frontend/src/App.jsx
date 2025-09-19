import React from 'react'
import {Routes , Route , Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/LoginPage'
import LoginPage from './pages/LoginPage'



const App = () => {

  return (
    <div className= "flex items-center justify-center h-screen">
    <Routes>

      <Route  
      path='/'
      element = {<HomePage/>}
      />

      <Route  
      path='/login'
      element = {<LoginPage/>}
      />

      <Route  
      path='/signup'
      element = {<SignUpPage/>}
      />
    </Routes>

    </div>
  )
}

export default App
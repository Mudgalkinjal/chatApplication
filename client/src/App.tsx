import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import SignUpPage from './pages/SignUpPage'
import Signinpage from './pages/Signinpage'
import Apppage from './pages/Apppage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<Signinpage />} />
        <Route path="/app" element={<Apppage />} />
      </Routes>
    </Router>
    // <div className="App">
    //   {' '}
    //   <Homepage />
    // </div>
  )
}

export default App

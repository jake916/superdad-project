import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/landingpage'
import LetterView from './Pages/LetterView'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/letterview/:slug" element={<LetterView />} />
      </Routes>
    </Router>
  )
}

export default App

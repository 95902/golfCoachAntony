import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { BookingIndoor } from './pages/BookingIndoor'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking/indoor" element={<BookingIndoor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

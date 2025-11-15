import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { BookingIndoor } from './pages/BookingIndoor'
import BookingAccompanied from './pages/BookingAccompanied'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking/indoor" element={<BookingIndoor />} />
        <Route path="/booking/accompanied" element={<BookingAccompanied />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

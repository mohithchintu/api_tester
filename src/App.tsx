import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ApiTester from './ApiTester'

function Home() {
  return (
    <div>
      <h1>Vite + React</h1>
      <Link to="/api-tester">Go to API Tester</Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/api-tester" element={<ApiTester />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
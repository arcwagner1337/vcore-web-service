import { useState } from 'react'
import MainPage from './components/containers/mainPage/mainPage'

import './index.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <MainPage/>
  )
}

export default App

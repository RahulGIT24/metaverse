import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GameEngine from './GameEngine'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GameEngine/>
    </>
  )
}

export default App

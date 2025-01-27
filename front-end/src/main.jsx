import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Terminal from './home/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Terminal/>
  </StrictMode>,
)

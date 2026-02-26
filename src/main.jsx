import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Scope1Mockup from './Scope1Mockup'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Scope1Mockup/>
  </StrictMode>,
)

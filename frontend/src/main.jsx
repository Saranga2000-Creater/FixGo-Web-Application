import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route , Routes } from "react-router";
import './index.css'
import App from './App.jsx'
import Shops from '../Routes/Shops.jsx'
import Services from "../Routes/Services.jsx"
import Support from "../Routes/Support.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/services" element={<Services />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </BrowserRouter>,
    
  </StrictMode>,
)

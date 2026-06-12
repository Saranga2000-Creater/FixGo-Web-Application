import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Shops from '../Routes/Shops.jsx'
import Services from "../Routes/Services.jsx"
import Support from "../Routes/Support.jsx"
import Form from "../Routes/RegistrationForm.jsx"
import CustomerForm from "../components/Registration/CustomerForm.jsx"
import ShopForm from "../components/Registration/ShopOwnerForm.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/services" element={<Services />} />
        <Route path="/support" element={<Support />} />
        <Route path="/form" element={<Form />}>
          <Route path="customer" element={<CustomerForm />} />
          <Route path="shop-owner" element={<ShopForm />} />
        </Route>
      </Routes>
    </BrowserRouter>,

  </StrictMode>,
)

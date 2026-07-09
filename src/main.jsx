import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Pricing from './Pricing.jsx'
import Overview from './Overview.jsx'

function Router() {
  const path = window.location.pathname
  if (path === '/pricing') return <Pricing />
  if (path === '/overview') return <Overview />
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><Router /></React.StrictMode>,
)

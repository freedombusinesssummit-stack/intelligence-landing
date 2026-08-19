import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Pricing from './Pricing.jsx'
import Overview from './Overview.jsx'
import ThankYou from './ThankYou.jsx'
import Intro from './Intro.jsx'
import Questions from './Questions.jsx'
import Scoring from './Scoring.jsx'
import Privacy from './Privacy.jsx'
import Terms from './Terms.jsx'

function Router() {
  const path = window.location.pathname
  if (path === '/pricing') return <Pricing />
  if (path === '/overview') return <Overview />
  if (path === '/thank-you') return <ThankYou />
  if (path === '/intro') return <Intro />
  if (path === '/questions') return <Questions />
  if (path === '/scoring') return <Scoring />
  if (path === '/privacy') return <Privacy />
  if (path === '/terms') return <Terms />
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><Router /></React.StrictMode>,
)

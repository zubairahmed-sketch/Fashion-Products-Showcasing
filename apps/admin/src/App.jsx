import { useState } from 'react'
import { useAuth } from './utils/authContext'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import './App.css'

function App() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  
  if (!user) {
    return <Login />
  }
  
  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'products':
        return <Products />
      case 'categories':
        return <Categories />
      default:
        return <Dashboard />
    }
  }
  
  return (
    <div className="app">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App

import { useState } from 'react'
import { Menu, LogOut } from 'lucide-react'
import { useAuth } from '../utils/authContext'
import './Sidebar.css'

function Sidebar({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuth()
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Products' },
    { id: 'categories', label: 'Categories' }
  ]
  
  const handleLogout = () => {
    logout()
  }
  
  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
        <Menu size={24} />
      </button>
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">Admin</h1>
          <button className="sidebar-close" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id)
                setIsOpen(false)
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  )
}

export default Sidebar

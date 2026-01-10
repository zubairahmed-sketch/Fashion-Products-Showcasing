import { storageService } from '../utils/storage'
import './Dashboard.css'

function Dashboard() {
  const products = storageService.getProducts()
  const categories = storageService.getCategories()
  
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{products.length}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{categories.length}</div>
          <div className="stat-label">Total Categories</div>
        </div>
      </div>
      
      <div className="welcome-section">
        <h2>Welcome to Admin Dashboard</h2>
        <p>Manage your fashion products and categories efficiently.</p>
        <div className="quick-actions">
          <div className="action-item">
            <h3>📦 Products</h3>
            <p>Add, edit, or delete products from your inventory.</p>
          </div>
          <div className="action-item">
            <h3>📂 Categories</h3>
            <p>Organize your products by creating and managing categories.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

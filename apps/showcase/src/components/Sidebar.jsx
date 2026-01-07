import { useState } from 'react'
import { Filter } from 'lucide-react'
import './Sidebar.css'

function Sidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  categoryCounts = {},
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <Filter size={24} />
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Categories</h2>
          <button
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Categories */}
        <div className="categories-section">
          <div className="categories-list">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-item ${
                  selectedCategory === category.id ? 'active' : ''
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="category-name">{category.label}</span>
                <span className="category-count">{categoryCounts[category.id] || 0}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  )
}

export default Sidebar

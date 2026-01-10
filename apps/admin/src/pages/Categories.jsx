import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { storageService } from '../utils/storage'
import './Categories.css'

function Categories() {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [error, setError] = useState('')
  
  useEffect(() => {
    setCategories(storageService.getCategories())
  }, [])
  
  const handleAddCategory = (e) => {
    e.preventDefault()
    
    if (!newCategory.trim()) {
      setError('Category name cannot be empty')
      return
    }
    
    if (categories.includes(newCategory)) {
      setError('This category already exists')
      return
    }
    
    storageService.addCategory(newCategory)
    setCategories(storageService.getCategories())
    setNewCategory('')
    setError('')
  }
  
  const handleDeleteCategory = (category) => {
    if (confirm(`Are you sure you want to delete "${category}"?`)) {
      storageService.deleteCategory(category)
      setCategories(storageService.getCategories())
    }
  }
  
  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Categories Management</h1>
      </div>
      
      <div className="categories-container">
        <div className="add-category-card">
          <h2>Add New Category</h2>
          <form onSubmit={handleAddCategory}>
            <div className="form-group">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value)
                  setError('')
                }}
                placeholder="Enter category name"
                className="category-input"
              />
              {error && <span className="error-message">{error}</span>}
            </div>
            <button type="submit" className="btn-add-category">
              <Plus size={20} />
              Add Category
            </button>
          </form>
        </div>
        
        <div className="categories-list">
          <h2>All Categories ({categories.length})</h2>
          {categories.length === 0 ? (
            <div className="empty-state">
              <p>No categories yet. Add your first category!</p>
            </div>
          ) : (
            <div className="category-grid">
              {categories.map(category => (
                <div key={category} className="category-card">
                  <span className="category-name">{category}</span>
                  <button
                    className="btn-delete-category"
                    onClick={() => handleDeleteCategory(category)}
                    title="Delete category"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Categories

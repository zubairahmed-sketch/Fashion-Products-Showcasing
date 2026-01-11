import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { categoryService } from '../services/supabase'
import './Categories.css'

function Categories() {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadCategories()
  }, [])
  
  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddCategory = async (e) => {
    e.preventDefault()
    
    if (!newCategory.trim()) {
      setError('Category name cannot be empty')
      return
    }
    
    if (categories.some(cat => cat.name === newCategory)) {
      setError('This category already exists')
      return
    }
    
    try {
      await categoryService.create(newCategory)
      await loadCategories()
      setNewCategory('')
      setError('')
    } catch (error) {
      console.error('Error adding category:', error)
      setError('Failed to add category')
    }
  }
  
  const handleDeleteCategory = async (categoryId) => {
    const categoryName = categories.find(c => c.id === categoryId)?.name
    if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      try {
        await categoryService.delete(categoryId)
        await loadCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Failed to delete category')
      }
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
          {loading ? (
            <div className="empty-state">
              <p>Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <p>No categories yet. Add your first category!</p>
            </div>
          ) : (
            <div className="category-grid">
              {categories.map(category => (
                <div key={category.id} className="category-card">
                  <span className="category-name">{category.name}</span>
                  <button
                    className="btn-delete-category"
                    onClick={() => handleDeleteCategory(category.id)}
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

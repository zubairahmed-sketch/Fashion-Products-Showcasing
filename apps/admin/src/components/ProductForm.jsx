import { useState } from 'react'
import './ProductForm.css'

function ProductForm({ categories, onSubmit, initialData = null, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      category: categories[0] || '',
      imageUrl: '',
      sourceUrl: ''
    }
  )
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '')
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Mock - in production, upload to Supabase
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target.result)
        setFormData(prev => ({ ...prev, imageUrl: event.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.category || !formData.imageUrl || !formData.sourceUrl) {
      alert('Please fill all fields')
      return
    }
    onSubmit(formData)
  }
  
  return (
    <div className="product-form-container">
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>{initialData ? 'Edit Product' : 'Add New Product'}</h2>
        
        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Product Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!initialData}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label>Source URL *</label>
          <input
            type="url"
            name="sourceUrl"
            value={formData.sourceUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/product"
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {initialData ? 'Update' : 'Add'} Product
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm

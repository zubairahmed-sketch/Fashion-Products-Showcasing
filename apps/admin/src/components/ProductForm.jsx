import { useState } from 'react'
import { storageService } from '../services/supabase'
import './ProductForm.css'

function ProductForm({ categories, onSubmit, initialData = null, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      productId: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      imageurl: '',
      sourceurl: ''
    }
  )
  const [imagePreview, setImagePreview] = useState(initialData?.imageurl || '')
  const [uploading, setUploading] = useState(false)
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        setUploading(true)
        
        // Create a preview
        const reader = new FileReader()
        reader.onload = (event) => {
          setImagePreview(event.target.result)
        }
        reader.readAsDataURL(file)
        
        // Upload to Supabase storage
        const fileName = `${Date.now()}-${file.name}`
        console.log('Uploading file:', fileName)
        const publicUrl = await storageService.uploadImage(file, fileName)
        console.log('Upload successful, public URL:', publicUrl)
        
        setFormData(prev => ({ ...prev, imageurl: publicUrl }))
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Failed to upload image: ' + error.message)
      } finally {
        setUploading(false)
      }
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.productId || !formData.category_id || !formData.imageurl || !formData.sourceurl) {
      alert('Please fill all fields')
      return
    }
    
    if (uploading) {
      alert('Please wait for image upload to complete')
      return
    }
    
    onSubmit(formData)
  }
  
  return (
    <div className="product-form-container">
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>{initialData ? 'Edit Product' : 'Add New Product'}</h2>
        
        <div className="form-group">
          <label>Product ID *</label>
          <input
            type="number"
            name="productId"
            value={formData.productId}
            onChange={handleInputChange}
            placeholder="e.g., 1, 2, 3"
            required
            disabled={initialData !== null}
          />
        </div>
        
        <div className="form-group">
          <label>Category *</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Product Image * {uploading && <span className="uploading">(Uploading...)</span>}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!initialData}
            disabled={uploading}
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
            name="sourceurl"
            value={formData.sourceurl}
            onChange={handleInputChange}
            placeholder="https://example.com/product"
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={uploading}>
            {initialData ? 'Update' : 'Add'} Product
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={uploading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm

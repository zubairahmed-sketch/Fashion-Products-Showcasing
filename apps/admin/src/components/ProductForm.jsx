import { useEffect, useState } from 'react'
import { storageService } from '../services/supabase'
import './ProductForm.css'

function ProductForm({ categories, onSubmit, initialData = null, onCancel }) {
  const buildInitialForm = (data) => ({
    category_id: data?.category_id ?? (categories[0]?.id ?? ''),
    imageurl: data?.imageurl ?? '',
    sourceurl: data?.sourceurl ?? ''
  })

  const [formData, setFormData] = useState(() => buildInitialForm(initialData))
  const [imagePreview, setImagePreview] = useState(initialData?.imageurl || '')
  const [uploading, setUploading] = useState(false)
  const [oldImageUrl, setOldImageUrl] = useState(initialData?.imageurl || '')

  useEffect(() => {
    setFormData(buildInitialForm(initialData))
    setImagePreview(initialData?.imageurl || '')
    setOldImageUrl(initialData?.imageurl || '')
  }, [initialData, categories])
  
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
        
        // If updating and old image exists, mark it for deletion
        if (initialData?.imageurl) {
          setOldImageUrl(initialData.imageurl)
        }
        
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
    
    if (!formData.category_id || !formData.imageurl || !formData.sourceurl) {
      alert('Please fill all fields')
      return
    }
    
    if (uploading) {
      alert('Please wait for image upload to complete')
      return
    }
    
    // Pass only allowed fields to avoid sending relationships to Supabase
    const payload = {
      category_id: formData.category_id,
      imageurl: formData.imageurl,
      sourceurl: formData.sourceurl
    }

    onSubmit(payload, oldImageUrl)
  }
  
  return (
    <div className="product-form-container">
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>{initialData ? 'Edit Product' : 'Add New Product'}</h2>
        
        {initialData?.productid && (
          <div className="form-group">
            <label>Product ID (auto-assigned)</label>
            <input
              type="number"
              value={initialData.productid}
              disabled
            />
          </div>
        )}
        
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
          {initialData && imagePreview && (
            <div className="image-current-status">
              ✓ Image already uploaded - Select a new image to replace it
            </div>
          )}
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

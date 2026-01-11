import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import ProductForm from '../components/ProductForm'
import { productService, categoryService, storageService } from '../services/supabase'
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddProduct = async (formData) => {
    try {
      console.log('Adding product with data:', formData)
      await productService.create(formData)
      await loadData()
      setShowForm(false)
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product: ' + error.message)
    }
  }
  
  const handleUpdateProduct = async (formData, oldImageUrl) => {
    try {
      console.log('Updating product with data:', formData)
      
      // Update product in database
      const updatedProduct = await productService.update(editingProduct.id, formData)
      console.log('Product updated successfully:', updatedProduct)
      
      // Delete old image if a new one was uploaded
      if (oldImageUrl && oldImageUrl !== formData.imageurl) {
        try {
          const fileName = oldImageUrl.split('/').pop().split('?')[0]
          await storageService.deleteImage(fileName)
          console.log('Old image deleted:', fileName)
        } catch (err) {
          console.warn('Could not delete old image:', err)
        }
      }
      
      // Reload all data
      await loadData()
      setEditingProduct(null)
      setShowForm(false)
      alert('Product updated successfully!')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product: ' + error.message)
    }
  }
  
  const handleDeleteProduct = async (productId, id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id)
        await loadData()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }
  
  const handleEditClick = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }
  
  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products Management</h1>
        <button 
          className="btn-add-product"
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>
      
      <div className="products-table-wrapper">
        {loading ? (
          <div className="empty-state">
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products yet. Add your first product!</p>
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Category</th>
                <th>Image</th>
                <th>Source URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className="id-cell">{product.productid}</td>
                  <td>{product.categories?.name || 'Unknown'}</td>
                  <td className="image-cell">
                    <img src={product.imageurl} alt={`Product ${product.productid}`} />
                  </td>
                  <td className="url-cell">
                    <a href={product.sourceurl} target="_blank" rel="noopener noreferrer">
                      {product.sourceurl.substring(0, 40)}...
                    </a>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEditClick(product)}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDeleteProduct(product.productid, product.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {showForm && (
        <ProductForm
          categories={categories}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          initialData={editingProduct}
          onCancel={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

export default Products

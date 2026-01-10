import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import ProductForm from '../components/ProductForm'
import { storageService } from '../utils/storage'
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  useEffect(() => {
    setProducts(storageService.getProducts())
    setCategories(storageService.getCategories())
  }, [])
  
  const handleAddProduct = (formData) => {
    storageService.addProduct(formData)
    setProducts(storageService.getProducts())
    setShowForm(false)
  }
  
  const handleUpdateProduct = (formData) => {
    storageService.updateProduct(editingProduct.productId, formData)
    setProducts(storageService.getProducts())
    setEditingProduct(null)
    setShowForm(false)
  }
  
  const handleDeleteProduct = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      storageService.deleteProduct(productId)
      setProducts(storageService.getProducts())
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
        {products.length === 0 ? (
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
                <tr key={product.productId}>
                  <td className="id-cell">{product.productId}</td>
                  <td>{product.category}</td>
                  <td className="image-cell">
                    <img src={product.imageUrl} alt={`Product ${product.productId}`} />
                  </td>
                  <td className="url-cell">
                    <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {product.sourceUrl.substring(0, 40)}...
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
                      onClick={() => handleDeleteProduct(product.productId)}
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

import ProductCard from './ProductCard'
import './ProductGrid.css'

function ProductGrid({ products, isLoading, error, totalProducts }) {
  if (error) {
    return (
      <div className="product-grid-container error-container">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="product-grid-container loading-container">
        <div className="loading-spinner">
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  if (totalProducts === 0) {
    return (
      <div className="product-grid-container empty-container">
        <div className="empty-message">
          <p>No products available yet.</p>
          <p className="empty-sub">Check back soon!</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="product-grid-container empty-container">
        <div className="empty-message">
          <p>No products match your filters.</p>
          <p className="empty-sub">Try adjusting your search or filters.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id || product.productid} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductGrid

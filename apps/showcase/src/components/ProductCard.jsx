import './ProductCard.css'

function ProductCard({ product }) {
  const {
    productId,
    imageUrl,
    sourceUrl,
  } = product

  const handleClick = () => {
    if (sourceUrl) {
      window.open(sourceUrl, '_blank')
    }
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Product ${productId}`}
            className="product-image"
            onClick={handleClick}
          />
        ) : (
          <div className="product-image-placeholder">
            <span>No Image</span>
          </div>
        )}
        <div className="product-id-overlay">{productId}</div>
      </div>
    </div>
  )
}

export default ProductCard

import './ProductCard.css'

function ProductCard({ product }) {
  const {
    productId,
    imageurl,
    sourceurl,
  } = product

  const handleClick = () => {
    if (sourceurl) {
      window.open(sourceurl, '_blank')
    }
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        {imageurl ? (
          <img
            src={imageurl}
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

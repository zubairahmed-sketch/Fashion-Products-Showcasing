import { useState, useEffect } from 'react'
import { Shuffle, Search, Filter } from 'lucide-react'
import ProductGrid from './ProductGrid'
import Sidebar from './Sidebar'
import { mockProducts } from '../data/mockProducts'
import './ProductShowcase.css'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'pants_shorts', label: 'Pants/Shorts' },
  { id: 'rings', label: 'Rings' },
  { id: 'belts', label: 'Belts' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'bags', label: 'Bags' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'halloween', label: 'Halloween' },
]

function ProductShowcase() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRandom, setIsRandom] = useState(false)
  const [isButtonActive, setIsButtonActive] = useState(false)

  // Calculate category counts
  const getCategoryCounts = () => {
    const counts = {}
    CATEGORIES.forEach(cat => {
      if (cat.id === 'all') {
        counts[cat.id] = products.length
      } else {
        counts[cat.id] = products.filter(
          p => p.category?.toLowerCase() === cat.id.toLowerCase()
        ).length
      }
    })
    return counts
  }

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with actual API endpoint
        // const response = await fetch('http://localhost:5000/api/products')
        // const data = await response.json()
        // setProducts(data)
        
        // Using mock data for now - sort by productId ascending by default
        const sorted = [...mockProducts].sort((a, b) => a.productId - b.productId)
        setProducts(sorted)
        setFilteredProducts(sorted)
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters and search
  useEffect(() => {
    let result = [...products]

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        (product) => product.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Search by product ID
    if (searchQuery.trim()) {
      const query = searchQuery.trim()
      result = result.filter((product) =>
        product.productId.toString().includes(query)
      )
    }

    setFilteredProducts(result)
  }, [products, selectedCategory, searchQuery])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setSearchQuery('')
  }

  const handleRandom = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setIsButtonActive(true)
    
    // Toggle between random and ordered
    const newIsRandom = !isRandom
    setIsRandom(newIsRandom)
    
    if (newIsRandom) {
      // Shuffle products
      const shuffled = [...products].sort(() => Math.random() - 0.5)
      setFilteredProducts(shuffled)
    } else {
      // Sort by productId ascending
      const sorted = [...products].sort((a, b) => a.productId - b.productId)
      setFilteredProducts(sorted)
    }
    
    // Revert button active state after 1.5 seconds
    setTimeout(() => {
      setIsButtonActive(false)
    }, 1500)
  }

  const handleSearchChange = (query) => {
    setSearchQuery(query)
    setSelectedCategory('all')
  }

  return (
    <div className="product-showcase">
      <div className="showcase-container">
        {/* Sidebar on the left */}
        <Sidebar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categoryCounts={getCategoryCounts()}
        />

        {/* Right side: Header and Grid */}
        <div className="right-section">
          {/* Top Header with Search and Random */}
          <div className="showcase-header">
            <div className="search-random-container">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  placeholder="Search by Product ID"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  inputMode="numeric"
                  className="header-search-input"
                />
                {searchQuery && (
                  <button
                    className="search-clear-btn"
                    onClick={() => handleSearchChange('')}
                  >
                    ✕
                  </button>
                )}
              </div>
              <button 
                className={`header-random-btn ${!isRandom ? 'random-mode' : 'ordered-mode'} ${isButtonActive ? 'active' : ''}`}
                onClick={handleRandom}
              >
                <Shuffle size={20} style={{ marginRight: '8px' }} />
                {!isRandom ? 'Random' : 'Ordered'}
              </button>
            </div>
            {searchQuery && (
              <div className="search-result-info">
                {filteredProducts.length} product(s) found for ID "{searchQuery}"
              </div>
            )}
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            error={error}
            totalProducts={products.length}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductShowcase

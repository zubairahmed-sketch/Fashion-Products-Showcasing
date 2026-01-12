import { useState, useEffect } from 'react'
import { Shuffle, Search, Filter } from 'lucide-react'
import ProductGrid from './ProductGrid'
import Sidebar from './Sidebar'
import { productService, categoryService } from '../services/supabase'
import './ProductShowcase.css'

function ProductShowcase() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRandom, setIsRandom] = useState(false)
  const [isButtonActive, setIsButtonActive] = useState(false)

  // Calculate category counts
  const getCategoryCounts = () => {
    const counts = { all: products.length }
    categories.forEach(cat => {
      counts[cat.id] = products.filter(p => p.category_id === cat.id).length
    })
    return counts
  }

  // Fetch products and categories from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll()
        ])
        
        // Sort by productid ascending by default
        const sorted = productsData
          .slice()
          .sort((a, b) => Number(a.productid || 0) - Number(b.productid || 0))
        setProducts(sorted)
        setFilteredProducts(sorted)
        setCategories(categoriesData)
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply filters and search
  useEffect(() => {
    let result = [...products]

    // Category filter
    if (selectedCategory !== 'all') {
      const selectedCat = categories.find(c => c.id === parseInt(selectedCategory))
      if (selectedCat) {
        result = result.filter(p => p.category_id === selectedCat.id)
      }
    }

    // Search by product ID
    if (searchQuery.trim()) {
      const query = searchQuery.trim()
      result = result.filter((product) =>
        product.productid?.toString().includes(query)
      )
    }

    if (isRandom) {
      const shuffled = [...result].sort(() => Math.random() - 0.5)
      setFilteredProducts(shuffled)
    } else {
      const sorted = [...result].sort(
        (a, b) => Number(a.productid || 0) - Number(b.productid || 0)
      )
      setFilteredProducts(sorted)
    }
  }, [products, categories, selectedCategory, searchQuery, isRandom])

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
    
    // Revert button active state after 1.5 seconds
    setTimeout(() => {
      setIsButtonActive(false)
    }, 1500)
  }

  const handleSearchChange = (query) => {
    setSearchQuery(query)
    setSelectedCategory('all')
  }

  // Build category list for sidebar
  const buildCategories = () => {
    const all = { id: 'all', label: 'All' }
    const cats = categories.map(cat => ({
      id: cat.id,
      label: cat.name
    }))
    return [all, ...cats]
  }

  return (
    <div className="product-showcase">
      <div className="showcase-container">
        {/* Sidebar on the left */}
        <Sidebar
          categories={buildCategories()}
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

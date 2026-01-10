// Mock data storage in localStorage
const STORAGE_KEYS = {
  PRODUCTS: 'admin_products',
  CATEGORIES: 'admin_categories',
  ADMIN_USER: 'admin_user'
}

const DEFAULT_CATEGORIES = [
  'Pants/Shorts',
  'Rings',
  'Belts',
  'Accessories',
  'Bags',
  'Footwear',
  'Halloween'
]

const DEFAULT_PRODUCTS = [
  {
    productId: 1,
    category: 'Pants/Shorts',
    imageUrl: 'https://via.placeholder.com/400x500?text=Product+101',
    sourceUrl: 'https://example.com/product/101'
  },
  {
    productId: 2,
    category: 'Rings',
    imageUrl: 'https://via.placeholder.com/400x500?text=Product+102',
    sourceUrl: 'https://example.com/product/102'
  }
]

export const storageService = {
  // Products
  getProducts: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    return stored ? JSON.parse(stored) : DEFAULT_PRODUCTS
  },
  
  saveProducts: (products) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
  },
  
  addProduct: (product) => {
    const products = storageService.getProducts()
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.productId)) + 1 : 1
    const newProduct = { ...product, productId: nextId }
    products.push(newProduct)
    storageService.saveProducts(products)
    return newProduct
  },
  
  updateProduct: (productId, updatedData) => {
    const products = storageService.getProducts()
    const index = products.findIndex(p => p.productId === productId)
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedData }
      storageService.saveProducts(products)
    }
    return products[index]
  },
  
  deleteProduct: (productId) => {
    const products = storageService.getProducts()
    const filtered = products.filter(p => p.productId !== productId)
    storageService.saveProducts(filtered)
  },
  
  // Categories
  getCategories: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES
  },
  
  saveCategories: (categories) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  },
  
  addCategory: (category) => {
    const categories = storageService.getCategories()
    if (!categories.includes(category)) {
      categories.push(category)
      storageService.saveCategories(categories)
    }
    return category
  },
  
  deleteCategory: (category) => {
    const categories = storageService.getCategories()
    const filtered = categories.filter(c => c !== category)
    storageService.saveCategories(filtered)
  },
  
  // Auth
  setAdmin: (user) => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(user))
  },
  
  getAdmin: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_USER)
    return stored ? JSON.parse(stored) : null
  },
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USER)
  }
}

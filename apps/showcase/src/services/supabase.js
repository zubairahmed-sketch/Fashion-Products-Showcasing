import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bhaudjxjxscvbytjnibd.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoYXVkanhqeHNjdmJ5dGpuaWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwODQ5MjgsImV4cCI6MjA4MjY2MDkyOH0.vvt9lmmEbz0w9vF5AAm4j95LL03dEAhiGeq9DwD2kOg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Products API - for showcase
export const productService = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name)')
      .order('productid', { ascending: true })
    if (error) throw error
    return data
  },

  async getByCategory(categoryId) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name)')
      .eq('category_id', categoryId)
      .order('productid', { ascending: true })
    if (error) throw error
    return data
  }
}

// Categories API
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  }
}

import { createClient } from '@supabase/supabase-js'

// Pull credentials from Vite env; keep secrets out of source
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Fail fast in dev to avoid silent insecure fallback
  throw new Error('Supabase env vars missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Categories API
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  },

  async create(name) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }])
      .select()
    if (error) throw error
    return data[0]
  },

  async delete(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}

// Products API
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
  },

  async create(product) {
    // Determine next productid (1..n sequence)
    const { data: maxRows, error: maxErr } = await supabase
      .from('products')
      .select('productid')
      .order('productid', { ascending: false })
      .limit(1)
    if (maxErr) throw maxErr

    const nextProductId = (maxRows?.[0]?.productid || 0) + 1
    const payload = { ...product, productid: nextProductId }

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select('*, categories(id, name)')
      .single()
    if (error) throw error
    return data
  },

  async update(id, product) {
    // Update product and return only scalar columns (no relationships)
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select('id, productid, category_id, imageurl, sourceurl')
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async resequenceProductIds() {
    // Re-pack productid to contiguous 1..n based on creation order
    const { data: rows, error } = await supabase
      .from('products')
      .select('id')
      .order('created_at', { ascending: true })
    if (error) throw error

    if (!rows || rows.length === 0) return

    const updates = rows.map((row, index) =>
      supabase
        .from('products')
        .update({ productid: index + 1 })
        .eq('id', row.id)
    )

    const results = await Promise.all(updates)
    const failed = results.find(r => r.error)
    if (failed?.error) throw failed.error
  }
}

// Storage API for images
export const storageService = {
  async uploadImage(file, fileName) {
    const { data, error } = await supabase.storage
      .from('products')
      .upload(`images/${fileName}`, file)
    if (error) throw error
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(`images/${fileName}`)
    
    return publicUrl
  },

  async deleteImage(fileName) {
    const { error } = await supabase.storage
      .from('products')
      .remove([`images/${fileName}`])
    if (error) throw error
  }
}

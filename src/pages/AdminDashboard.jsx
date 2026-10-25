
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  MessageCircle,
  ChartColumn,
  Settings,
  LogOut,
  Flower2,
  Plus,
  Boxes,
  TrendingUp,
  Clock,
  ArrowRight,
  Search,
  X,
  ImagePlus
} from 'lucide-react'

import './AdminDashboard.css'

const API_URL = 'http://localhost/assys-craft-and-blooms/backend/api'

function AdminDashboard() {
  const [activePage, setActivePage] = useState('Overview')
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [productError, setProductError] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Products')

  // ADD PRODUCT STATES
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [savingProduct, setSavingProduct] = useState(false)
  const [addProductMessage, setAddProductMessage] = useState('')

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Tulips',
    price: '',
    stock: '',
    image: null
  })

  const [imagePreview, setImagePreview] = useState('')

  // EDIT PRODUCT STATES
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editProductMessage, setEditProductMessage] = useState('')
  const [updatingProduct, setUpdatingProduct] = useState(false)

 const [editProductForm, setEditProductForm] = useState({
  name: '',
  description: '',
  category: 'Tulips',
  price: '',
  stock: '',
  status: 'active',
  image: null
})

  const [editImagePreview, setEditImagePreview] = useState('')

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Orders', icon: ShoppingBag },
    { name: 'Products', icon: Package },
    { name: 'Customers', icon: Users },
    { name: 'Contact Messages', icon: MessageCircle },
    { name: 'Reports', icon: ChartColumn },
    { name: 'Settings', icon: Settings }
  ]

  const statistics = [
    {
      title: 'Total Products',
      value: products.length,
      description: 'Products in your shop',
      icon: Boxes
    },
    {
      title: 'Total Orders',
      value: '—',
      description: 'Customer orders',
      icon: ShoppingBag
    },
    {
      title: 'Total Customers',
      value: '—',
      description: 'Registered customers',
      icon: Users
    },
    {
      title: 'Contact Messages',
      value: '—',
      description: 'Customer inquiries',
      icon: MessageCircle
    }
  ]

  // LOAD PRODUCTS
  const fetchProducts = async () => {
    setLoadingProducts(true)
    setProductError('')

    try {
      const response = await fetch(`${API_URL}/get-products.php`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load products.')
      }

      setProducts(data.products || [])
    } catch (error) {
      console.error('Product loading error:', error)
      setProductError(error.message || 'Unable to load products.')
    } finally {
      setLoadingProducts(false)
    }
  }

  useEffect(() => {
    if (activePage === 'Products' || activePage === 'Overview') {
      fetchProducts()
    }
  }, [activePage])

  const categories = [
    'All Products',
    ...new Set(products.map(product => product.category))
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchProduct.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All Products' ||
      product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // HANDLE ADD PRODUCT INPUTS
  const handleProductInput = (event) => {
    const { name, value, files } = event.target

    if (name === 'image') {
      const file = files[0]

      if (file) {
        setNewProduct(current => ({
          ...current,
          image: file
        }))

        setImagePreview(URL.createObjectURL(file))
      }

      return
    }

    setNewProduct(current => ({
      ...current,
      [name]: value
    }))
  }

  // OPEN EDIT PRODUCT POPUP
  
  // OPEN EDIT PRODUCT POPUP
  const handleOpenEditProduct = (product) => {
    setEditingProduct(product)

    setEditProductForm({
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'Tulips',
      price: product.price || '',
      stock: product.stock || '',
      status: product.status || 'active',
      image: null
    })

    setEditImagePreview(
      product.image
        ? `/image/products/${encodeURIComponent(product.image)}`
        : ''
    )

    setEditProductMessage('')
    setShowEditProduct(true)
  }

  // HANDLE EDIT PRODUCT INPUTS
  const handleEditProductInput = (event) => {
    const { name, value, files } = event.target

    if (name === 'image') {
      const file = files[0]

      if (file) {
        setEditProductForm(current => ({
          ...current,
          image: file
        }))

        setEditImagePreview(URL.createObjectURL(file))
      }

      return
    }

    setEditProductForm(current => ({
      ...current,
      [name]: value
    }))
  }

  // CLOSE EDIT PRODUCT POPUP
  const closeEditProduct = () => {
    if (updatingProduct) return

    setShowEditProduct(false)
    setEditingProduct(null)
    setEditProductMessage('')
    setEditImagePreview('')

    setEditProductForm({
      name: '',
      description: '',
      category: 'Tulips',
      price: '',
      stock: '',
      status: 'active',
      image: null
    })
  }

  // SAVE EDITED PRODUCT
  const handleUpdateProduct = async (event) => {
    event.preventDefault()

    if (!editingProduct) return

    setUpdatingProduct(true)
    setEditProductMessage('')

    try {
      const formData = new FormData()

      formData.append('id', editingProduct.id)
      formData.append('name', editProductForm.name.trim())
      formData.append('description', editProductForm.description.trim())
      formData.append('category', editProductForm.category)
      formData.append('price', editProductForm.price)
      formData.append('stock', editProductForm.stock)
      formData.append('status', editProductForm.status)

      if (editProductForm.image) {
        formData.append('image', editProductForm.image)
      }

      const response = await fetch(`${API_URL}/update-product.php`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to update product.')
      }

      await fetchProducts()
      closeEditProduct()

      alert('Product updated successfully!')

    } catch (error) {
      console.error('Update product error:', error)
      setEditProductMessage(error.message || 'Something went wrong.')
    } finally {
      setUpdatingProduct(false)
    }
  }
const handleDeleteProduct = async (product) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${product.name}"?`
  )

  if (!confirmDelete) return

  try {
    const formData = new FormData()
    formData.append('id', product.id)

    const response = await fetch(`${API_URL}/delete-product.php`, {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to delete product.')
    }

    alert('Product deleted successfully!')
    await fetchProducts()
  } catch (error) {
    console.error('Delete product error:', error)
    alert(error.message || 'Something went wrong while deleting the product.')
  }
}

  // RESET ADD PRODUCT FORM
  const resetProductForm = () => {
    setNewProduct({
      name: '',
      description: '',
      category: 'Tulips',
      price: '',
      stock: '',
      image: null
    })

    setImagePreview('')
    setAddProductMessage('')
  }

  // CLOSE ADD PRODUCT POPUP
  const closeAddProduct = () => {
    if (savingProduct) return

    setShowAddProduct(false)
    resetProductForm()
  }

  // SAVE NEW PRODUCT
  const handleAddProduct = async (event) => {
    event.preventDefault()

    setSavingProduct(true)
    setAddProductMessage('')

    try {
      const formData = new FormData()

      formData.append('name', newProduct.name.trim())
      formData.append('description', newProduct.description.trim())
      formData.append('category', newProduct.category)
      formData.append('price', newProduct.price)
      formData.append('stock', newProduct.stock)
      formData.append('image', newProduct.image)

      const response = await fetch(`${API_URL}/add-product.php`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to add product.')
      }

      await fetchProducts()

      setShowAddProduct(false)
      resetProductForm()
      setSelectedCategory('All Products')
      setSearchProduct('')

      alert('Product added successfully!')

    } catch (error) {
      console.error('Add product error:', error)
      setAddProductMessage(error.message || 'Something went wrong.')
    } finally {
      setSavingProduct(false)
    }
  }

  // LOG OUT
  const logout = () => {
    sessionStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <header className="admin-header">
        <div className="admin-brand">
          <Flower2 size={23} />
          <span>ASSY'S CRAFT AND BLOOMS</span>
        </div>
      </header>

      <div className="admin-layout">

        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <nav>
            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.name}
                  className={`admin-menu-item ${
                    activePage === item.name ? 'active' : ''
                  }`}
                  onClick={() => setActivePage(item.name)}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </button>
              )
            })}

            <button className="admin-menu-item" onClick={logout}>
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="admin-main">

          <h2>{activePage}</h2>

          {/* OVERVIEW */}
          {activePage === 'Overview' && (
            <div className="admin-overview">

              <div className="admin-welcome-card">
                <div>
                  <p className="admin-welcome-label">
                    ADMINISTRATOR DASHBOARD
                  </p>

                  <h3>Welcome to Assy's Craft and Blooms!</h3>

                  <p>
                    Manage your handmade products, customer orders,
                    and shop activities in one place.
                  </p>
                </div>

                <Flower2 size={75} className="admin-welcome-flower" />
              </div>

              <div className="admin-overview-heading">
                <h3>Shop Overview</h3>
                <p>Your shop statistics will appear here.</p>
              </div>

              <div className="admin-statistics">
                {statistics.map((stat) => {
                  const Icon = stat.icon

                  return (
                    <div className="admin-stat-card" key={stat.title}>
                      <div className="admin-stat-top">
                        <div className="admin-stat-icon">
                          <Icon size={23} />
                        </div>

                        <TrendingUp
                          size={18}
                          className="admin-stat-trend"
                        />
                      </div>

                      <h3>{stat.value}</h3>
                      <p className="admin-stat-title">{stat.title}</p>
                      <span>{stat.description}</span>
                    </div>
                  )
                })}
              </div>

              <div className="admin-overview-bottom">

                <div className="admin-overview-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <h3>Recent Orders</h3>
                      <p>Latest customer purchases</p>
                    </div>

                    <button onClick={() => setActivePage('Orders')}>
                      View All <ArrowRight size={15} />
                    </button>
                  </div>

                  <div className="admin-empty-state">
                    <ShoppingBag size={35} />
                    <h4>No orders to display</h4>
                    <p>
                      Customer orders will appear here once
                      the ordering system is connected.
                    </p>
                  </div>
                </div>

                <div className="admin-overview-panel admin-quick-panel">
                  <h3>Quick Actions</h3>
                  <p>Quickly access your shop management tools.</p>

                  {[
                    { name: 'Manage Products', page: 'Products', icon: Package },
                    { name: 'Manage Orders', page: 'Orders', icon: ShoppingBag },
                    { name: 'View Customers', page: 'Customers', icon: Users },
                    { name: 'View Messages', page: 'Contact Messages', icon: MessageCircle }
                  ].map(action => {
                    const Icon = action.icon

                    return (
                      <button
                        key={action.name}
                        className="admin-quick-action"
                        onClick={() => setActivePage(action.page)}
                      >
                        <Icon size={19} />
                        <span>{action.name}</span>
                        <ArrowRight size={16} />
                      </button>
                    )
                  })}
                </div>

              </div>

              <div className="admin-overview-note">
                <Clock size={17} />
                <span>
                  Product statistics are connected to your database.
                  Other statistics will be connected later.
                </span>
              </div>

            </div>
          )}

          {/* PRODUCTS */}
          {activePage === 'Products' && (
            <div className="admin-products-section">

              <div className="admin-statistics">

                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <Boxes size={23} />
                  </div>

                  <h3>{products.length}</h3>
                  <p>Total Products</p>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <Package size={23} />
                  </div>

                  <h3>
                    {products.filter(product => Number(product.stock) <= 5).length}
                  </h3>

                  <p>Low Stock Products</p>
                </div>

              </div>

              {/* PRODUCT TOOLBAR */}
              <div className="admin-products-toolbar">

                <div className="admin-product-search">
                  <Search size={18} />

                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchProduct}
                    onChange={event => setSearchProduct(event.target.value)}
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={event => setSelectedCategory(event.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <button
                  className="admin-add-product"
                  onClick={() => {
                    resetProductForm()
                    setShowAddProduct(true)
                  }}
                >
                  <Plus size={17} />
                  Add Product
                </button>

              </div>

              {loadingProducts && (
                <p className="admin-products-message">
                  Loading products...
                </p>
              )}

              {!loadingProducts && productError && (
                <div className="admin-products-error">
                  {productError}
                  <button onClick={fetchProducts}>Try Again</button>
                </div>
              )}

              {!loadingProducts && !productError && (
                <>
                  <div className="admin-products-heading">
                    <h3>Product Collection</h3>
                    <span>{filteredProducts.length} products found</span>
                  </div>

                  {filteredProducts.length > 0 ? (
                    <div className="admin-product-grid">
                        <div className="admin-product-table-header">
  <div>Product</div>
  <div>Type</div>
  <div>Name</div>
  <div>Price</div>
  <div>Stock</div>
  <div>Actions</div>
</div>

{filteredProducts.map(product => (
  <div className="admin-product-row" key={product.id}>

    <div className="admin-product-image">
      <img
        src={`/image/products/${encodeURIComponent(product.image)}`}
        alt={product.name}
        onError={event => {
          event.currentTarget.style.display = 'none'
        }}
      />

      <span className={`admin-product-status ${product.status}`}>
        {product.status}
      </span>
    </div>

    <div className="admin-product-type">
      {product.category}
    </div>

    <div className="admin-product-name">
      {product.name}
    </div>

    <div className="admin-product-price">
      ₱{Number(product.price).toFixed(2)}
    </div>

    <div className="admin-product-stock">
      {product.stock}
    </div>

    <div className="admin-product-actions">
      <button
        type="button"
        className="admin-edit-product-button"
        onClick={() => handleOpenEditProduct(product)}
      >
        Edit
      </button>

      <button
        type="button"
        className="admin-delete-product-button"
        onClick={() => handleDeleteProduct(product)}
      >
        Delete
      </button>
    </div>

  </div>
))}
                    </div>
                  ) : (
                    <div className="admin-products-message">
                      No products found.
                    </div>
                  )}
                </>
              )}

            </div>
          )}

          {/* OTHER SECTIONS */}
          {[
            'Orders',
            'Customers',
            'Contact Messages',
            'Reports',
            'Settings'
          ].includes(activePage) && (
            <div className="admin-coming-soon">
              <div className="admin-coming-icon">
                {activePage === 'Orders' && <ShoppingBag size={35} />}
                {activePage === 'Customers' && <Users size={35} />}
                {activePage === 'Contact Messages' && <MessageCircle size={35} />}
                {activePage === 'Reports' && <ChartColumn size={35} />}
                {activePage === 'Settings' && <Settings size={35} />}
              </div>

              <h3>{activePage}</h3>

              <p>
                The {activePage.toLowerCase()} section will be developed
                next.
              </p>
            </div>
          )}

        </main>
      </div>

      {/* ADD PRODUCT POPUP */}
      {showAddProduct && (
        <div
          className="admin-product-modal-overlay"
          onClick={closeAddProduct}
        >
          <div
            className="admin-product-modal"
            onClick={event => event.stopPropagation()}
          >
            <div className="admin-product-modal-header">
              <div>
                <h3>Add New Product</h3>
                <p>Enter the details of your handmade product.</p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeAddProduct}
                disabled={savingProduct}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleAddProduct}>

              <div className="admin-form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleProductInput}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleProductInput}
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>

              <div className="admin-form-row">

                <div className="admin-form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleProductInput}
                    required
                  >
                    <option value="Tulips">Tulips</option>
                    <option value="Roses">Roses</option>
                    <option value="Bouquets">Bouquets</option>
                    <option value="Keychains">Keychains</option>
                    <option value="Flower Pots">Flower Pots</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Price (₱) *</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleProductInput}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

              </div>

              <div className="admin-form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleProductInput}
                  placeholder="Enter available quantity"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Product Image *</label>

                <label className="admin-image-upload">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Product preview" />
                  ) : (
                    <>
                      <ImagePlus size={30} />
                      <span>Click to upload product image</span>
                      <small>JPG, PNG, or WEBP (Maximum 5 MB)</small>
                    </>
                  )}

                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProductInput}
                    required
                    hidden
                  />
                </label>
              </div>

              {addProductMessage && (
                <p className="admin-form-error">
                  {addProductMessage}
                </p>
              )}

              <div className="admin-product-modal-actions">
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={closeAddProduct}
                  disabled={savingProduct}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-save-product-button"
                  disabled={savingProduct}
                >
                  {savingProduct ? 'Saving...' : 'Save Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      {/* EDIT PRODUCT POPUP */}
      {showEditProduct && (
        <div
          className="admin-product-modal-overlay"
          onClick={closeEditProduct}
        >
          <div
            className="admin-product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-product-modal-header">
              <h2>Edit Product</h2>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeEditProduct}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct}>
              <div className="admin-form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={editProductForm.name}
                  onChange={handleEditProductInput}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editProductForm.description}
                  onChange={handleEditProductInput}
                  rows="3"
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={editProductForm.category}
                    onChange={handleEditProductInput}
                    required
                  >
                    <option value="Tulips">Tulips</option>
                    <option value="Roses">Roses</option>
                    <option value="Bouquets">Bouquets</option>
                    <option value="Keychains">Keychains</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Price (₱)</label>
                  <input
                    type="number"
                    name="price"
                    value={editProductForm.price}
                    onChange={handleEditProductInput}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={editProductForm.stock}
                    onChange={handleEditProductInput}
                    min="0"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={editProductForm.status}
                    onChange={handleEditProductInput}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Product Image</label>

                {editImagePreview && (
                  <div className="admin-image-upload">
                    <img
                      src={editImagePreview}
                      alt="Product Preview"
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                )}

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleEditProductInput}
                />

                <small>
                  Leave this empty if you don't want to change the image.
                </small>
              </div>

              {editProductMessage && (
                <div className="admin-form-error">
                  {editProductMessage}
                </div>
              )}

              <div className="admin-product-modal-actions">
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={closeEditProduct}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-save-product-button"
                  disabled={updatingProduct}
                >
                  {updatingProduct ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


export default AdminDashboard

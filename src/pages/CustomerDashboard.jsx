import { useMemo, useState } from 'react'
import './CustomerDashboard.css'

const products = [
  { id: 1, name: 'Baby Pink Tulip', image: '1pc-babypink-tulip.png', price: 99, category: 'Tulips', description: 'A beautiful handmade baby pink tulip, perfect for gifts and special occasions.' },
  { id: 2, name: 'Beige Tulip', image: '1pc-beige-tulip.png', price: 99, category: 'Tulips', description: 'A lovely handmade beige tulip that adds a soft and elegant touch to any gift.' },
  { id: 3, name: 'Blue Tulip', image: '1pc-blue-tulip.png', price: 99, category: 'Tulips', description: 'A charming handmade blue tulip for someone special.' },
  { id: 4, name: 'Orange Tulip', image: '1pc-orange-tulip.png', price: 99, category: 'Tulips', description: 'A bright handmade orange tulip that brings a cheerful touch.' },
  { id: 5, name: 'Red Tulip', image: '1pc-redtulip.png', price: 99, category: 'Tulips', description: 'A lovely handmade red tulip, a thoughtful gift for someone you love.' },
  { id: 6, name: 'White Tulip', image: '1pc-white-tulip.png', price: 99, category: 'Tulips', description: 'A simple and elegant handmade white tulip.' },

  { id: 7, name: 'Blue Rose', image: '3pcs-blue-rose.png', price: 199, category: 'Roses', description: 'A set of three handmade blue roses, perfect for a thoughtful gift.' },
  { id: 8, name: 'Brown Rose', image: '3pcs-brown-rose.png', price: 199, category: 'Roses', description: 'A set of three handmade brown roses with a unique color combination.' },
  { id: 9, name: 'Light Brown Rose', image: '3pcs-lightbrown-rose.png', price: 199, category: 'Roses', description: 'Three handmade light brown roses for a warm and elegant gift.' },
  { id: 10, name: 'Matcha Rose', image: '3pcs-matcha-rose.png', price: 199, category: 'Roses', description: 'A set of three handmade matcha-colored roses.' },
  { id: 11, name: 'Purple Rose', image: '3pcs-purple-rose.png', price: 199, category: 'Roses', description: 'Three handmade purple roses for a unique and lovely gift.' },
  { id: 12, name: 'Red Rose', image: '3pcs-red-rose.png', price: 199, category: 'Roses', description: 'A classic set of three handmade red roses.' },

  { id: 13, name: 'Rose Flower Bouquet', image: '3pcs-rose-flowerbouquet.png', price: 299, category: 'Bouquets', description: 'A handmade rose bouquet carefully arranged for special moments.' },
  { id: 14, name: 'Sunflower Bouquet', image: '3pcs-sunflower-bouquet.png', price: 299, category: 'Bouquets', description: 'A cheerful handmade sunflower bouquet that makes a wonderful gift.' },
  { id: 15, name: 'Tulip Flower Bouquet', image: '3pcs-tulip-flowerbouquet.png', price: 299, category: 'Bouquets', description: 'A beautiful handmade tulip bouquet for birthdays and celebrations.' },
  { id: 16, name: 'Combination Rose Bouquet', image: '5pcs-combi-rose-flowerbouquets.png', price: 399, category: 'Bouquets', description: 'A combination of handmade roses arranged into one beautiful bouquet.' },
  { id: 17, name: 'Combo Flower Bouquet', image: 'combo-flowerbouquet.png', price: 399, category: 'Bouquets', description: 'A lovely combination bouquet made for special occasions.' },
  { id: 18, name: 'Customized Big Bouquet', image: 'customize-big-bouquets.png', price: 499, category: 'Bouquets', description: 'A large customized handmade bouquet. Contact us for your preferred design.' },
  { id: 19, name: 'Customized Flower Bouquet', image: 'customize-flowerbouquets.png', price: 399, category: 'Bouquets', description: 'A handmade flower bouquet that can be customized according to your preference.' },
  { id: 20, name: 'Money Bouquet', image: 'customize-money-bouquet.png', price: 499, category: 'Bouquets', description: 'A special customized money bouquet for celebrations and memorable occasions.' },
  { id: 21, name: 'Chocolate Bouquet', image: 'customized-chocolates%20bouquets.png', price: 399, category: 'Bouquets', description: 'A handmade bouquet featuring chocolates, perfect for sweet surprises.' },
  { id: 22, name: 'Blue Chocolate Bouquet', image: 'blue%20customized-chocolates%20bouquets.png', price: 399, category: 'Bouquets', description: 'A blue-themed customized chocolate bouquet for someone special.' },
  { id: 23, name: 'Graduation Flower Bouquet', image: 'graduation-flowerbouquet.png', price: 399, category: 'Bouquets', description: 'A handmade graduation bouquet to celebrate a special achievement.' },
  { id: 24, name: 'Mushroom Graduation Bouquet', image: 'mushroom-graduation-bouquet.png', price: 399, category: 'Bouquets', description: 'A unique mushroom-themed handmade graduation bouquet.' },
  { id: 25, name: 'Pink Mushroom Bouquet', image: 'pinkymushrooms-flowerbouqet.png', price: 399, category: 'Bouquets', description: 'A cute pink mushroom-themed handmade bouquet.' },
  { id: 26, name: 'Red Rose Bloom Bouquet', image: 'red-rose-bloom-flowerbouquets.png', price: 399, category: 'Bouquets', description: 'A beautiful handmade bouquet featuring red rose blooms.' },

  { id: 27, name: 'All Tulip Keychains', image: 'alltulipkeychains.png', price: 79, category: 'Keychains', description: 'A collection of cute handmade tulip keychains.' },
  { id: 28, name: 'Mushroom Keychain', image: 'mushroom-keychain.png', price: 79, category: 'Keychains', description: 'A cute handmade mushroom keychain for everyday use.' },
  { id: 29, name: 'Ribbon Keychain', image: 'ribbon-keychain.png', price: 79, category: 'Keychains', description: 'A lovely handmade ribbon keychain that makes a thoughtful little gift.' },
  { id: 30, name: 'Tulip Keychain', image: 'tulip-keychain.png', price: 79, category: 'Keychains', description: 'A charming handmade tulip keychain.' },

  { id: 31, name: 'Blooms Pot', image: 'blooms-pot.png', price: 249, category: 'Flower Pots', description: 'A decorative handmade flower pot that adds a lovely touch to your space.' },
  { id: 32, name: 'Sunflower Pot', image: 'sunflower-pot.png', price: 249, category: 'Flower Pots', description: 'A handmade sunflower arrangement in a decorative pot.' },
  { id: 33, name: 'Tulip Pot', image: 'tulip-pot.png', price: 249, category: 'Flower Pots', description: 'A lovely handmade tulip arrangement displayed in a decorative pot.' },

  { id: 34, name: 'Hair Clip', image: 'hairclip-png.jpg', price: 49, category: 'Accessories', description: 'A cute accessory that adds a lovely detail to your hairstyle.' },
  { id: 35, name: 'Tulip Clip', image: 'tulip-clip.png', price: 49, category: 'Accessories', description: 'A cute handmade tulip-inspired hair accessory.' }
]

const categories = [
  'All Products',
  'Tulips',
  'Roses',
  'Bouquets',
  'Keychains',
  'Flower Pots',
  'Accessories'
]

function CustomerDashboard() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Products')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [notice, setNotice] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [detailQuantity, setDetailQuantity] = useState(1)

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory =
        selectedCategory === 'All Products' ||
        product.category === selectedCategory

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [search, selectedCategory])

  const addToCart = (product, quantity = 1) => {
    setCart(currentCart => {
      const existing = currentCart.find(item => item.id === product.id)

      if (existing) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...currentCart, { ...product, quantity }]
    })

    setNotice(`${product.name} added to cart!`)
    setTimeout(() => setNotice(''), 2500)
  }

  const openProductDetails = (product) => {
    setSelectedProduct(product)
    setDetailQuantity(1)
  }

  const closeProductDetails = () => {
    setSelectedProduct(null)
    setDetailQuantity(1)
  }

  const updateQuantity = (id, amount) => {
    setCart(currentCart =>
      currentCart
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const removeFromCart = (id) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id))
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const logout = () => {
    sessionStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="shop-page">

      {/* SHOP HEADER */}
      <header className="shop-header">
        <div className="shop-brand">
          <h1>Assy's Craft and Blooms</h1>
          <p>Handmade with Love, Made Just for You</p>
        </div>

        <div className="shop-header-actions">
          <button
            className="shop-nav-button"
            onClick={() => window.location.href = '/about'}
          >
            About Us
          </button>

          <button
            className="shop-nav-button"
            onClick={() => window.location.href = '/contact'}
          >
            Contact Us
          </button>

          <button
            className="shop-cart-button"
            onClick={() => setShowCart(true)}
          >
            🛒 Cart ({cartCount})
          </button>

          <button className="shop-logout-button" onClick={logout}>
            Log Out
          </button>
        </div>
      </header>

      {/* WELCOME SECTION */}
      <section className="shop-welcome">
        <h2>Welcome to Our Handmade Shop!</h2>
        <p>
          Find beautiful handmade flowers, bouquets, keychains,
          and other special creations made with love.
        </p>
      </section>

      {/* SEARCH */}
      <section className="shop-search-section">
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
      </section>

      {/* CATEGORIES */}
      <section className="shop-categories">
        <h2>Shop by Category</h2>

        <div className="category-list">
          {categories.map(category => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? 'category-button active'
                  : 'category-button'
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="shop-products-section">
        <div className="shop-products-heading">
          <h2>
            {selectedCategory === 'All Products'
              ? 'Our Handmade Collection'
              : selectedCategory}
          </h2>
          <span>{filteredProducts.length} products</span>
        </div>

        <div className="shop-product-grid">
          {filteredProducts.map(product => (
            <div
              className="shop-product-card"
              key={product.id}
              onClick={() => openProductDetails(product)}
              role="button"
              tabIndex={0}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openProductDetails(product)
                }
              }}
            >
              <div className="shop-product-image">
                <img
                  src={`/image/products/${product.image}`}
                  alt={product.name}
                  onError={event => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              </div>

              <div className="shop-product-info">
                <h3>{product.name}</h3>
                <p className="shop-product-category">
                  {product.category}
                </p>

                <div className="shop-product-bottom">
                  <strong>₱{product.price.toFixed(2)}</strong>

                  <button
                    onClick={event => {
                      event.stopPropagation()
                      addToCart(product)
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="shop-no-products">
            No products found. Try another search.
          </p>
        )}
      </section>

      {/* PRODUCT DETAILS POPUP */}
      {selectedProduct && (
        <div
          className="shop-details-overlay"
          onClick={closeProductDetails}
        >
          <div
            className="shop-details-modal"
            onClick={event => event.stopPropagation()}
          >
            <button
              className="shop-details-close"
              onClick={closeProductDetails}
              aria-label="Close product details"
            >
              ×
            </button>

            <div className="shop-details-image">
              <img
                src={`/image/products/${selectedProduct.image}`}
                alt={selectedProduct.name}
              />
            </div>

            <div className="shop-details-info">
              <p className="shop-details-category">
                {selectedProduct.category}
              </p>

              <h2>{selectedProduct.name}</h2>

              <h3>₱{selectedProduct.price.toFixed(2)}</h3>

              <div className="shop-details-divider"></div>

              <h4>Product Description</h4>
              <p className="shop-details-description">
                {selectedProduct.description}
              </p>

              <div className="shop-details-quantity">
                <span>Quantity:</span>

                <div className="shop-detail-quantity-controls">
                  <button
                    onClick={() =>
                      setDetailQuantity(current =>
                        Math.max(1, current - 1)
                      )
                    }
                  >
                    −
                  </button>

                  <span>{detailQuantity}</span>

                  <button
                    onClick={() =>
                      setDetailQuantity(current => current + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="shop-details-subtotal">
                Subtotal: ₱
                {(selectedProduct.price * detailQuantity).toFixed(2)}
              </p>

              <button
                className="shop-details-add-button"
                onClick={() => {
                  addToCart(selectedProduct, detailQuantity)
                  closeProductDetails()
                }}
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART POPUP */}
      {showCart && (
        <div
          className="shop-cart-overlay"
          onClick={() => setShowCart(false)}
        >
          <div
            className="shop-cart-modal"
            onClick={event => event.stopPropagation()}
          >
            <div className="shop-cart-heading">
              <h2>My Shopping Cart</h2>
              <button onClick={() => setShowCart(false)}>×</button>
            </div>

            {cart.length === 0 ? (
              <p className="shop-empty-cart">
                Your shopping cart is empty.
              </p>
            ) : (
              <>
                <div className="shop-cart-items">
                  {cart.map(item => (
                    <div className="shop-cart-item" key={item.id}>
                      <img
                        src={`/image/products/${item.image}`}
                        alt={item.name}
                      />

                      <div className="shop-cart-item-details">
                        <h4>{item.name}</h4>
                        <p>₱{item.price.toFixed(2)}</p>

                        <div className="shop-quantity-controls">
                          <button onClick={() => updateQuantity(item.id, -1)}>
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button onClick={() => updateQuantity(item.id, 1)}>
                            +
                          </button>

                          <button
                            className="shop-remove-button"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="shop-cart-total">
                  <strong>Subtotal:</strong>
                  <strong>₱{cartTotal.toFixed(2)}</strong>
                </div>
              </>
            )}

            <button
              className="shop-continue-button"
              onClick={() => setShowCart(false)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATION */}
      {notice && (
        <div className="shop-notice">
          {notice}
        </div>
      )}

      {/* FOOTER */}
      <footer className="shop-footer">
        <h3>Assy's Craft and Blooms</h3>
        <p>Handmade with Love, Made Just for You.</p>
        <p>
          © {new Date().getFullYear()} Assy's Craft and Blooms. All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default CustomerDashboard
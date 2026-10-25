
function LandingPage() {
  return (
    <>
      {/* Header */}
      <header className="main-header">
        <h1>Assy's Craft and Blooms</h1>
        <p>Handmade with Love, Made Just for You</p>
      </header>

      {/* Main Content */}
      <main className="container py-5">
        <section className="text-center mb-5">
          <h2>Welcome to Assy's Craft and Blooms!</h2>
          <p>
            Discover beautiful handmade flowers, creative crafts,
            and special gifts made with love.
          </p>
        </section>

        {/* Account Options */}
       <section className="account-section row justify-content-center g-4 mb-5">
          <div className="col-md-5">
            <div className="card h-100 text-center p-4">
              <h3>Already Have an Account?</h3>
              <p>Log in to explore our beautiful collections.</p>
             <a
  href="/login"
  onClick={(e) => {
    e.preventDefault()
    window.history.pushState({}, '', '/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }}
  className="btn btn-danger"
>
  Log In
</a>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card h-100 text-center p-4">
              <h3>New Here?</h3>
              <p>Create an account and discover our handmade products.</p>
              <a
  href="/signup"
  onClick={(e) => {
    e.preventDefault()
    window.history.pushState({}, '', '/signup')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }}
  className="btn btn-danger"
>
  Sign Up
</a>
            </div>
          </div>
        </section>

        {/* Collections */}
       
{/* Featured Products */}
<section className="text-center featured-products">
  <h2>Our Featured Products</h2>
  <p className="mb-4">
    Discover some of our handmade creations made with love.
  </p>

  <div className="row g-4 justify-content-center">

    {/* Product 1 */}
    <div className="col-md-4">
      <div className="card h-100 p-3 featured-product-card">
        <img
          src="/image/products/1pc-babypink-tulip.png"
          alt="Baby Pink Tulip"
          className="featured-product-image"
        />
        <h4>Baby Pink Tulip</h4>
        <p>A lovely handmade tulip for someone special.</p>
      </div>
    </div>

    {/* Product 2 */}
    <div className="col-md-4">
      <div className="card h-100 p-3 featured-product-card">
        <img
          src="/image/products/3pcs-red-rose.png"
          alt="Red Rose Collection"
          className="featured-product-image"
        />
        <h4>Red Rose Collection</h4>
        <p>Beautiful handmade roses for memorable occasions.</p>
      </div>
    </div>

    {/* Product 3 */}
    <div className="col-md-4">
      <div className="card h-100 p-3 featured-product-card">
        <img
          src="/image/products/3pcs-sunflower-bouquet.png"
          alt="Sunflower Bouquet"
          className="featured-product-image"
        />
        <h4>Sunflower Bouquet</h4>
        <p>A cheerful handmade bouquet filled with warmth.</p>
      </div>
    </div>

  </div>
</section>

      </main>

      {/* Footer */}
      <footer className="text-center py-4">
        <p>© 2026 Assy's Craft and Blooms. All Rights Reserved.</p>
      </footer>
    </>
  )
}

export default LandingPage

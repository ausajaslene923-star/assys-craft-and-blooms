
import './About.css'

function About() {
  return (
    <div className="about-page">

     <header className="about-header">
  <h1>Assy's Craft and Blooms</h1>
  <p>Handmade with Love, Made Just for You</p>
</header>

<div className="about-navigation">
  <button
    className="about-back-button"
    onClick={() => window.location.href = '/shop'}
  >
    ← Back to Shop
  </button>
</div>

      <main className="about-container">

        <section className="about-hero">
          <h2>About Us</h2>
          <p>
            Welcome to Assy's Craft and Blooms!
          </p>
          <p>
            We create handmade flowers, beautiful bouquets,
            cute keychains, flower pots, and other special crafts.
            Every creation is made with care to bring happiness
            to you and your loved ones.
          </p>
        </section>

        <section className="about-content">
          <div className="about-card">
            <h3>Our Story</h3>
            <p>
              Assy's Craft and Blooms is a handmade craft shop
              that offers creative and thoughtful products.
              We believe that handmade gifts make special
              moments more meaningful.
            </p>
          </div>

          <div className="about-card">
            <h3>Our Mission</h3>
            <p>
              Our mission is to provide beautiful and creative
              handmade products that customers can enjoy,
              share, and give as meaningful gifts.
            </p>
          </div>

          <div className="about-card">
            <h3>Our Products</h3>
            <p>
              We offer handmade flower arrangements, bouquets,
              keychains, flower pots, accessories, and
              customizable creations.
            </p>
          </div>
        </section>

        <section className="about-message">
          <h2>Made with Love, Just for You!</h2>
          <p>
            Thank you for supporting Assy's Craft and Blooms.
            We appreciate every customer who chooses our
            handmade creations.
          </p>
        </section>

      </main>

      <footer className="about-footer">
        <p>© {new Date().getFullYear()} Assy's Craft and Blooms. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default About

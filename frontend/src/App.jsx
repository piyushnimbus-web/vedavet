import React from "react";
import "./styles/global.css";

const services = [
  { icon: "🩺", title: "Veterinary Care", description: "Professional care to keep your pets healthy and happy." },
  { icon: "✂️", title: "Pet Grooming", description: "Gentle grooming to keep your furry friends looking their best." },
  { icon: "💉", title: "Vaccination", description: "Essential vaccinations for a healthier, safer life." },
  { icon: "🏠", title: "Pet Boarding", description: "A comfortable and caring home away from home." }
];

export default function App() {
  return (
    <div className="website">
      <div className="topbar">
        Welcome to VedaVet — Care, Comfort & Compassion for Every Pet
      </div>

      <header className="header">
        <a className="logo" href="#home">🐾 Veda<span>Vet</span></a>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <a href="#shop">Pet Shop</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-btn" href="#contact">Book Appointment</a>
      </header>

      <main>
        <section
          className="hero"
          id="home"
          style={{
            backgroundImage: 'linear-gradient(90deg, rgba(5,34,81,0.82) 0%, rgba(5,34,81,0.18) 100%), url("/beta/node/images/banner.jpeg")',
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#052251",
            minHeight: "650px"
          }}
        >
          <div className="hero-content" style={{ position: "relative", zIndex: 1 }}>
            <span className="eyebrow">YOUR PET'S HEALTH, OUR PRIORITY</span>
            <h1>Because Every Pet Deserves <span>Love &amp; Care.</span></h1>
            <p>
              Expert veterinary care, thoughtful grooming and everyday
              essentials to help your beloved companions live healthier,
              happier lives.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#contact">Book an Appointment ↗</a>
              <a className="secondary-btn" href="#services">Explore Services</a>
            </div>
            <div className="hero-note">♡ Compassionate care for your furry family</div>
          </div>
        </section>

        <section className="trust-row">
          <div><strong>♡</strong><span>Compassionate Care</span></div>
          <div><strong>✚</strong><span>Experienced Team</span></div>
          <div><strong>☆</strong><span>Pet-Friendly Approach</span></div>
          <div><strong>✓</strong><span>Care You Can Trust</span></div>
        </section>

        <section className="section about" id="about">
          <div className="about-visual">
            <div className="about-emoji">🐈</div>
            <div className="about-badge">A little more love<br /><strong>in every visit ♡</strong></div>
          </div>
          <div className="section-content">
            <span className="eyebrow">ABOUT VEDAVET</span>
            <h2>Care That Comes From the <span>Heart.</span></h2>
            <p>
              At VedaVet, we believe pets are family. Our goal is to make
              quality pet care accessible, comfortable and reassuring for
              both pets and the people who love them.
            </p>
            <a className="text-link" href="#services">Discover Our Care ↗</a>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="section-heading">
            <span className="eyebrow">WHAT WE OFFER</span>
            <h2>Everything Your Pet Needs</h2>
            <p>Thoughtful services for every stage of your pet's life.</p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href="#contact">Learn More ↗</a>
              </article>
            ))}
          </div>
        </section>

        <section className="shop-banner" id="shop">
          <div>
            <span className="eyebrow">THE VEDAVET PET SHOP</span>
            <h2>Little Things. <span>Big Tail Wags.</span></h2>
            <p>Discover everyday essentials for your favourite companions.</p>
          </div>
          <a className="primary-btn" href="#contact">Explore Pet Shop ↗</a>
        </section>

        <section className="section contact" id="contact">
          <span className="eyebrow">WE'RE HERE FOR YOU</span>
          <h2>Let's Make Your Pet's Day <span>Healthier.</span></h2>
          <p>Have a question or need an appointment? We'd love to hear from you.</p>
          <a className="primary-btn" href="mailto:hello@vedavet.com">Contact VedaVet ↗</a>
        </section>
      </main>

      <footer className="footer">
        <a className="logo" href="#home">🐾 Veda<span>Vet</span></a>
        <p>Care, comfort and compassion for every pet.</p>
        <div className="footer-links">
          <a href="#contact">Privacy Policy</a>
          <a href="#contact">Terms &amp; Conditions</a>
          <a href="#contact">Disclaimer</a>
        </div>
        <small>© {new Date().getFullYear()} VedaVet. All rights reserved.</small>
      </footer>
    </div>
  );
}

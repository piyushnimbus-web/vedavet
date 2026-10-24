import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const quickLinks = [
  { label: "About Us", path: "/about-us" },
  { label: "Services", path: "/services" },
  { label: "Our Team", path: "/our-team" },
  { label: "Blogs", path: "/blogs" },
  { label: "Contact Us", path: "/contact-us" },
  { label: "Appointment", path: "/appointment" },
];

const serviceLinks = [
  { label: "General Consultation", path: "/services/general-veterinary-consultation" },
  { label: "Vaccination", path: "/services/vaccination-preventive-healthcare" },
  { label: "Pet Surgery", path: "/services/pet-surgery-surgical-care" },
  { label: "Emergency Care", path: "/services/emergency-critical-care" },
  { label: "Diagnostic Services", path: "/services/diagnostic-laboratory-services" },
  { label: "Pet Shop", path: "/shop" },
];

const legalLinks = [
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms & Conditions", path: "/terms-and-conditions" },
  { label: "Disclaimer", path: "/disclaimer" },
  { label: "Refund Policy", path: "/refund-policy" },
  { label: "Shipping & Returns", path: "/shipping-returns" },
];

export default function Footer() {
  return (
    <footer className="vv-footer">
      <div className="vv-footer-top">
        <div className="vv-footer-brand">
          <div className="vv-footer-logo-box">
            <img src="/beta/node/images/footer-logo.png" alt="VedaVet Pet Hospital" />
          </div>

          <p className="vv-footer-text">
            Compassionate veterinary care for every pet. At VedaVet, we focus on
            comfort, wellness, trust and the best care experience for pets and pet parents.
          </p>

          <div className="vv-footer-contact">
            <span><strong>Phone:</strong> +91 98765 43210</span>
            <span><strong>Email:</strong> care@vedavet.com</span>
            <span><strong>Address:</strong> Your Branch Address Here</span>
          </div>
        </div>

        <div className="vv-footer-col">
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="vv-footer-col">
          <h4>Our Services</h4>
          <ul>
            {serviceLinks.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="vv-footer-col">
          <h4>Legal</h4>
          <ul>
            {legalLinks.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="vv-footer-bottom">
        <p>© {new Date().getFullYear()} VedaVet Pet Hospital. All rights reserved.</p>
      </div>
    </footer>
  );
}

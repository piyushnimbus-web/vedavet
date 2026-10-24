
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { services } from "../pages/serviceData";
import "./Header.css";

// Staff portal is served by the backend: port 4000 locally, /beta/node/staff/ on the VPS.
const STAFF_URL =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:4000/staff/"
    : "/beta/node/staff/";

const aboutLinks = [
  { name: "Our Team", url: "/our-team" },
  { name: "Case Studies", url: "/case-studies" },
];

function ChevronDown() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function StaffIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return open ? (
    <svg width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const headerRef = useRef(null);

  const closeMenus = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  useEffect(() => {
    closeMenus();
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenus();
    };

    const handleOutsideClick = (event) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        closeMenus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown((current) => (
      current === name ? null : name
    ));
  };

  const navClass = ({ isActive }) =>
    `vv-link${isActive ? " vv-active" : ""}`;

  return (
    <header className="vv-header" ref={headerRef}>
      <div className="vv-header-container">
        <Link
          to="/"
          className="vv-brand"
          onClick={closeMenus}
          aria-label="VedaVet Home"
        >
          <img
            src="/beta/node/images/logo.png"
            alt="VedaVet Pet Hospital"
          />
        </Link>

        <nav
          id="vv-main-navigation"
          className={`vv-navigation${menuOpen ? " vv-open" : ""}`}
          aria-label="Main navigation"
        >
          <NavLink to="/" end className={navClass}
            onClick={closeMenus}>
            Home
          </NavLink>

          {/* About dropdown */}
          <div
            className={`vv-nav-dropdown${
              openDropdown === "about"
                ? " vv-dropdown-open"
                : ""
            }`}
          >
            <div className="vv-dropdown-heading">
              <NavLink
                to="/about-us"
                className={navClass}
                onClick={closeMenus}
              >
                About
              </NavLink>
              <button
                type="button"
                className="vv-dropdown-arrow"
                aria-label="Toggle about menu"
                aria-expanded={openDropdown === "about"}
                aria-controls="vv-about-panel"
                onClick={() => toggleDropdown("about")}
              >
                <ChevronDown />
              </button>
            </div>

            <div
              id="vv-about-panel"
              className="vv-dropdown-panel"
            >
              {aboutLinks.map((item) => (
                <Link
                  key={item.url}
                  to={item.url}
                  onClick={closeMenus}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Services dropdown */}
          <div
            className={`vv-nav-dropdown${
              openDropdown === "services"
                ? " vv-dropdown-open"
                : ""
            }`}
          >
            <div className="vv-dropdown-heading">
              <NavLink
                to="/services"
                className={navClass}
                onClick={closeMenus}
              >
                Services
              </NavLink>
              <button
                type="button"
                className="vv-dropdown-arrow"
                aria-label="Toggle services menu"
                aria-expanded={openDropdown === "services"}
                aria-controls="vv-services-panel"
                onClick={() => toggleDropdown("services")}
              >
                <ChevronDown />
              </button>
            </div>

            <div
              id="vv-services-panel"
              className="vv-dropdown-panel"
            >
              <Link
                to="/services"
                className="vv-dropdown-featured"
                onClick={closeMenus}
              >
                Explore All Services →
              </Link>

              {services.map((item) => (
                <Link
                  key={item.slug}
                  to={`/services/${item.slug}`}
                  onClick={closeMenus}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <NavLink to="/blogs" className={navClass}
            onClick={closeMenus}>
            Blogs
          </NavLink>

          <NavLink to="/contact-us" className={navClass}
            onClick={closeMenus}>
            Contact Us
          </NavLink>

          <NavLink to="/shop" className={navClass}
            onClick={closeMenus}>
            Our Shop
          </NavLink>

          {/* Shown inside the menu on small screens, where the header button is hidden */}
          <a href={STAFF_URL} className="vv-link vv-staff-mobile-link">
            <StaffIcon />
            Staff Login
          </a>
        </nav>

        <div className="vv-header-actions">
          <a href={STAFF_URL} className="vv-staff-btn">
            <StaffIcon />
            Staff Login
          </a>

          <Link
            to="/appointment"
            className="vv-appointment-btn"
            onClick={closeMenus}
          >
            <span>Book Appointment</span>
            <span aria-hidden="true">↗</span>
          </Link>

          <button
            className="vv-hamburger"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-controls="vv-main-navigation"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((current) => !current);
              setOpenDropdown(null);
            }}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>
    </header>
  );
}

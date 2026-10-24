
import React, { useState } from 'react';
import { sendContact } from '../api/catalog';
import { Link } from 'react-router-dom';
import './ContactShop.css';

export default function ContactUs() {
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [notice, setNotice] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setNotice('');

    try {
      await sendContact(data);
      setNotice('Your enquiry has been submitted successfully.');
      setData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setNotice(
        err.message ||
        'Unable to send enquiry right now. Please try again later.'
      );
    } finally {
      setSending(false);
    }
  }

  function update(key, value) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  return (
    <main className="vv-modern-page vv-contact-page">

      {/* HERO SECTION */}
      <section className="vv-modern-hero">
        <div className="vv-modern-shell">
          <div className="vv-small-crumb">
            <Link to="/">Home</Link> / Contact Us
          </div>

          <span className="vv-hero-tag">WE ARE HERE TO HELP</span>

          <h1>Let's Talk About Your Pet's Care.</h1>

          <p>
            Have a question about veterinary care, appointments
            or pet essentials? Send us a message and our team
            will get back to you.
          </p>
        </div>
      </section>

      {/* CONTACT DETAILS & FORM */}
      <section className="vv-modern-shell vv-contact-area">

        <div className="vv-contact-intro">
          <span className="vv-overline">GET IN TOUCH</span>

          <h2>Care starts with a conversation.</h2>

          <p>
            Whether you're arranging a visit or exploring our
            services, we're happy to hear from you.
          </p>

          <div className="vv-contact-facts">

            {/* ADDRESS */}
            <div>
              <span className="vv-fact-icon">⌖</span>
              <div>
                <strong>Visit Our Hospital</strong>
                <p>
                  VedaVet Pet Hospital
                  <br />
                  Lower Ground Floor, Plot No. 201A,
                  <br />
                  Tech Zone IV, Opposite Cherry County Society,
                  <br />
                  Amrapali Dream Valley,
                  <br />
                  Greater Noida West (Noida Extension),
                  <br />
                  Uttar Pradesh - 201318
                </p>
              </div>
            </div>

            {/* MOBILE */}
            <div>
              <span className="vv-fact-icon">✆</span>
              <div>
                <strong>Call Us</strong>
                <p>
                  <a href="tel:+918800777742">
                    +91 8800777742
                  </a>
                </p>
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <span className="vv-fact-icon">✉</span>
              <div>
                <strong>Email Us</strong>
                <p>
                  <a href="mailto:Info@vedavet.in">
                    Info@vedavet.in
                  </a>
                </p>
                <p>
                  <a href="mailto:Jointaxis@gmail.com">
                    Jointaxis@gmail.com
                  </a>
                </p>
              </div>
            </div>

          </div>

          <Link className="vv-outline-cta" to="/appointment">
            Explore Appointments ↗
          </Link>
        </div>

        {/* CONTACT FORM */}
        <form className="vv-contact-form" onSubmit={submit}>
          <span className="vv-overline">SEND A MESSAGE</span>

          <h2>How can we help?</h2>

          <p>
            Fill in the details below and our team
            will respond when available.
          </p>

          <div className="vv-form-pair">
            <label>
              Full Name <em>*</em>
              <input
                required
                autoComplete="name"
                value={data.name}
                onChange={e => update('name', e.target.value)}
                placeholder="Your name"
              />
            </label>

            <label>
              Email Address
              <input
                type="email"
                autoComplete="email"
                value={data.email}
                onChange={e => update('email', e.target.value)}
                placeholder="you@example.com"
              />
            </label>
          </div>

          <div className="vv-form-pair">
            <label>
              Phone Number
              <input
                type="tel"
                autoComplete="tel"
                value={data.phone}
                onChange={e => update('phone', e.target.value)}
                placeholder="Your phone number"
              />
            </label>

            <label>
              Subject
              <input
                value={data.subject}
                onChange={e => update('subject', e.target.value)}
                placeholder="How can we help?"
              />
            </label>
          </div>

          <label>
            Your Message <em>*</em>
            <textarea
              required
              rows={5}
              value={data.message}
              onChange={e => update('message', e.target.value)}
              placeholder="Tell us a little about your pet or enquiry"
            />
          </label>

          <button disabled={sending} type="submit">
            {sending ? 'Sending…' : 'Send Enquiry ↗'}
          </button>

          <div
            className="vv-form-status"
            role="status"
            aria-live="polite"
          >
            {notice}
          </div>

          <small>
            For emergencies, contact an appropriate veterinary
            emergency service directly. This form is not monitored
            continuously.
          </small>
        </form>

      </section>

      {/* LOCATION MAP */}
      <section className="vv-modern-shell vv-location-area">
        <div className="vv-location-title">
          <div>
            <span className="vv-overline">FIND US</span>
            <h2>Visit VedaVet</h2>
            <p>
              VedaVet Pet Hospital, Lower Ground Floor,
              Plot No. 201A, Tech Zone IV,
              Greater Noida West - 201318.
            </p>
          </div>
        </div>

        <div className="vv-map-frame">
          <iframe
            title="VedaVet Pet Hospital Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.019803777128!2d77.446527!3d28.5991827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceffc232be7c9%3A0xca45174dd5021eb8!2sChelvies%20Coffee%20%7C%20Greater%20Noida%20West!5e0!3m2!1sen!2sin!4v1792689906263!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <p style={{ marginTop: '12px' }}>
          <strong>Location Note:</strong> VedaVet Pet Hospital
          is on the Lower Ground Floor. Chelvies Coffee is on
          the Ground Floor of the same building.
        </p>
      </section>

    </main>
  );
}

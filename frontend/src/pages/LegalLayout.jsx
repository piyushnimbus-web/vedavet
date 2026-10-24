import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LegalPages.css';

const policies = [
  ['Privacy Policy','/privacy-policy'],
  ['Terms & Conditions','/terms-and-conditions'],
  ['Disclaimer','/disclaimer'],
  ['Refund Policy','/refund-policy'],
  ['Shipping & Returns','/shipping-returns']
];

export default function LegalLayout({title, subtitle, sections}) {
  const {pathname}=useLocation();
  return <main className="vv-legal">
    <section className="vv-legal-hero">
      <div className="vv-legal-shell">
        <div className="vv-legal-breadcrumb"><Link to="/">Home</Link><span>/</span><span>Policies</span><span>/</span><strong>{title}</strong></div>
        <span className="vv-legal-eyebrow">VEDAVET • INFORMATION CENTER</span>
        <h1>{title}</h1><p>{subtitle}</p>
      </div>
    </section>
    <div className="vv-legal-shell vv-legal-content">
      <aside className="vv-legal-nav" aria-label="Policy navigation">
        <strong>Information & Policies</strong>
        {policies.map(([name,url])=><Link key={url} to={url} className={pathname===url?'selected':''}>{name}<span aria-hidden="true">↗</span></Link>)}
        <div className="vv-legal-help"><span>Need assistance?</span><p>Contact our team for questions about services or shop orders.</p><Link to="/contact-us">Contact Us →</Link></div>
      </aside>
      <article className="vv-legal-article">
        <div className="vv-legal-notice"><strong>Draft for review</strong><p>This page provides preliminary information. VedaVet must approve its final legal and operational terms before publication.</p></div>
        {sections.map((s,i)=><section key={i} className="vv-legal-section"><span className="vv-legal-number">{String(i+1).padStart(2,'0')}</span><div><h2>{s.heading}</h2>{s.paragraphs.map((p,j)=><p key={j}>{p}</p>)}</div></section>)}
        <div className="vv-legal-bottom"><strong>Questions about this policy?</strong><p>Please contact VedaVet for the latest approved information.</p><Link to="/contact-us">Send an Enquiry ↗</Link></div>
      </article>
    </div>
  </main>;
}

import React from "react";

export default function HomeHero(){
  return (
<section className="hero" id="home">

<picture className="hero-background" aria-hidden="true">
<source media="(max-width: 767px)" srcSet="/beta/node/images/m.png"/>
<img src="/beta/node/images/banner.jpeg" alt=""/>
</picture>

<div className="container hero-body hero-reference">
<span className="tag"><span aria-hidden="true" className="hero-paw">🐾</span> HEALTHY PETS, HAPPY HOMES.</span>
<h1>Expert veterinary<br/>service for every<br/>precious pet</h1>
<p>We provide comprehensive, compassionate, & advanced veterinary care design to keep your pet healthy at every stage of life. From preventive checkup & vaccinations to diagnostics, dental care, grooming, and emergency treatment.</p>
<a className="btn btn-coral hero-cta" href="/beta/node/appointment">
            Book An Appointment
            <svg aria-hidden="true" className="vet-svg-icon hero-cta-arrow" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 17 17 7M8 7h9v9"></path></svg>
</a>
<a aria-label="See our pet owner testimonials" className="hero-watch" href="#testimonials"><span aria-hidden="true" className="hero-play"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg></span><span>See Pet Stories</span></a>
</div>

<div className="container hero-feats">
<div className="row g-4">
<div className="col-md-4">
<svg aria-hidden="true" className="vet-pictogram vet-icon-heart" fill="none" focusable="false" stroke="#07376E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 56 11 36C-3 22 14 3 32 20 50 3 67 22 53 36Z"></path><path className="accent" d="M13 34h12l5-10 7 20 5-10h9"></path></svg>
<div>
<b>Expert Veterinary Specialists</b>
<small>Compassionate consultations and individualized medical attention for pets.</small>
</div>
</div>
<div className="col-md-4">
<svg aria-hidden="true" className="vet-pictogram vet-icon-clipboard" fill="none" focusable="false" stroke="#07376E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect height="47" rx="4" width="40" x="12" y="11"></rect><rect height="12" rx="3" width="18" x="23" y="6"></rect><path className="accent" d="M19 37h9l4-9 5 19 5-10h5"></path></svg>
<div>
<b>Advanced Diagnostic Care</b>
<small>Modern diagnostic support for informed veterinary decisions.</small>
</div>
</div>
<div className="col-md-4">
<svg aria-hidden="true" className="vet-pictogram vet-icon-shield" fill="none" focusable="false" stroke="#07376E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 5 55 14v17q0 20-23 29Q9 51 9 31V14Z"></path><path className="accent" d="m21 33 8 8 15-17"></path></svg>
<div>
<b>Complete Preventive Health</b>
<small>Preventive checkups and guidance for long-term pet wellness.</small>
</div>
</div>
</div>
</div>
</section>
  );
}

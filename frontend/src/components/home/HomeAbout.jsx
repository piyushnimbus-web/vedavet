import React from "react";

export default function HomeAbout(){
  return (
<section className="py-section reference-about" id="about">
<div className="container">
<div className="row align-items-center g-4 g-xl-5">
<div className="col-lg-6 position-relative about-main-photo">
<div className="ph rounded-4" style={{"aspectRatio": "1 / 1.02"}}><img alt="Veterinarian holding a cat" src="/beta/node/images/about-us-image-prime.png"/></div>
<a href="/beta/node/contact-us" className="badge-round vv-contact-round" aria-label="Contact VedaVet">
  <svg viewBox="0 0 200 200" role="img" aria-label="Contact Us circular badge">
    <defs><path id="vv-home-contact-ring" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" /></defs>
    <circle cx="100" cy="100" r="96" className="vv-contact-outer" />
    <circle cx="100" cy="100" r="55" className="vv-contact-inner" />
    <g className="vv-contact-rotating"><text><textPath href="#vv-home-contact-ring">CONTACT US • CONTACT US • CONTACT US • </textPath></text></g>
    <g className="vv-contact-paw" fill="currentColor"><ellipse cx="100" cy="119" rx="23" ry="18"/><ellipse cx="75" cy="91" rx="9" ry="13" transform="rotate(-20 75 91)"/><ellipse cx="94" cy="80" rx="9" ry="13" transform="rotate(-8 94 80)"/><ellipse cx="114" cy="82" rx="9" ry="13" transform="rotate(12 114 82)"/><ellipse cx="131" cy="97" rx="9" ry="13" transform="rotate(25 131 97)"/></g>
  </svg>
</a>
</div>
<div className="col-lg-6 about-copy">
<span className="eyebrow"><svg aria-hidden="true" className="vet-svg-icon" fill="currentColor" focusable="false" stroke="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="2"></circle><circle cx="13" cy="5" r="2"></circle><circle cx="19" cy="7" r="2"></circle><circle cx="4" cy="12" r="2"></circle><path d="M8 13c2-3 6-3 8 0l3 4c2 4-1 6-5 4-2-1-4-1-6 0-4 2-7-1-5-4z"></path></svg> About Our Clinic</span>
<h2>Trusted veterinary care for every beloved pet</h2>
<p className="muted">We combine medical expertise with genuine love for animals to deliver the best possible care. You can trust us to treat your pets as if they were our own — with kindness, respect.</p>
<div className="row g-4 align-items-center">
<div className="col-sm-6">
<div className="stat"><svg aria-hidden="true" className="vet-pictogram vet-icon-certificate" fill="none" focusable="false" stroke="#07376E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect height="44" rx="5" width="48" x="8" y="12"></rect><path d="M8 24h48M20 6v12M44 6v12"></path><path className="accent" d="m23 39 7 7 13-15"></path></svg>
<div><b>15+</b><small>Years of Trusted Service</small></div>
</div>
<div className="stat"><svg aria-hidden="true" className="vet-pictogram vet-icon-mouse" fill="none" focusable="false" stroke="#07376E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="9"></circle><circle cx="47" cy="17" r="9"></circle><circle className="accent" cx="17" cy="17" r="5"></circle><circle className="accent" cx="47" cy="17" r="5"></circle><path d="M12 30q20-18 40 0q10 23-20 28Q2 53 12 30Z"></path><circle cx="25" cy="39" r="2"></circle><circle cx="39" cy="39" r="2"></circle><path className="accent" d="m29 46 3 3 3-3-3-2Z"></path><path d="M32 49v4m0 0-7-2m7 2 7-2M16 46 6 43m42 3 10-3"></path></svg>
<div><b>5k+</b><small>Happy Pets Treated</small></div>
</div>
<div className="stat"><svg aria-hidden="true" className="vet-pictogram vet-icon-hospital" fill="none" focusable="false" stroke="#07376E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M6 28 32 9l26 19v30H6Z"></path><path d="M11 29v25h42V29M23 58V43q9-9 18 0v15"></path><g className="accent"><circle cx="24" cy="31" r="2"></circle><circle cx="32" cy="26" r="2"></circle><circle cx="40" cy="31" r="2"></circle><path d="M25 38q7-10 14 0q1 5-7 3q-8 2-7-3Z"></path></g></svg>
<div><b>24/7</b><small>Emergency Care Available</small></div>
</div>
</div>
<div className="col-sm-6">
<div className="ph rounded-4" style={{"aspectRatio": "4/3"}}><img alt="Cat and dog" src="/beta/node/images/ab-2.png"/></div>
</div>
</div>
<div className="d-flex align-items-center gap-4 mt-4 flex-wrap">
<a className="btn btn-coral" href="/beta/node/about-us">More About Us <svg aria-hidden="true" className="vet-svg-icon" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 17 17 7M8 7h9v9"></path></svg></a>
<div className="d-flex align-items-center gap-2"><span className="ico-sq"><svg aria-hidden="true" className="vet-pictogram vet-icon-phone" fill="none" focusable="false" stroke="#07376E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M18 8 9 16q-3 22 16 39t30-1l-8-10-10 5q-15-7-19-19l5-10Z"></path><path className="accent" d="M38 12q14 3 16 17M39 21q7 2 8 9"></path></svg></span>
<div><small className="d-block">Call Us!</small><b>+91 8800777742</b></div>
</div>
</div>
</div>
</div>
</div>
</section>
  );
}

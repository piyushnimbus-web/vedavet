import React from "react";

export default function HomeServices(){
  return (
<section className="py-section bg-cream" id="services">
<div className="container text-center">
<span className="eyebrow"><svg aria-hidden="true" className="vet-svg-icon" fill="currentColor" focusable="false" stroke="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="2"></circle><circle cx="13" cy="5" r="2"></circle><circle cx="19" cy="7" r="2"></circle><circle cx="4" cy="12" r="2"></circle><path d="M8 13c2-3 6-3 8 0l3 4c2 4-1 6-5 4-2-1-4-1-6 0-4 2-7-1-5-4z"></path></svg> Veterinary Services</span>
<h2>Comprehensive care services for<br/>every beloved pet</h2>
<div className="row g-4 mt-2" id="services-grid">
<div className="col-6 col-lg-3">
<div className="card-s">
<div className="ph"><img alt="General Health Checkups" loading="lazy" src="/beta/node/images/service-image-1-prime.jpg"/></div>
<h6>General Health Checkups</h6>
</div>
</div>
<div className="col-6 col-lg-3">
<div className="card-s">
<div className="ph"><img alt="Dental Care & Cleaning" loading="lazy" src="/beta/node/images/service-image-2-prime.jpg"/></div>
<h6>Dental Care & Cleaning</h6>
</div>
</div>
<div className="col-6 col-lg-3">
<div className="card-s">
<div className="ph"><img alt="Nutritional Counseling" loading="lazy" src="/beta/node/images/service-image-3-prime.jpg"/></div>
<h6>Nutritional Counseling</h6>
</div>
</div>
<div className="col-6 col-lg-3">
<div className="card-s">
<div className="ph"><img alt="Pet Boarding & Daycare" loading="lazy" src="/beta/node/images/service-image-4-prime.jpg"/></div>
<h6>Pet Boarding & Daycare</h6>
</div>
</div>
</div>
<p className="small mt-5 mb-1">Join our team and help weave innovation, quality, and success together worldwide.</p>
<div className="rating"><b>4.9/5</b> <span className="stars"></span> <b>Our 4200 Review</b></div>
</div>
</section>
  );
}

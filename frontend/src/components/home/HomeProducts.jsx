import React from "react";

export default function HomeProducts(){
  return (
<section className="py-section bg-cream">
<div className="container text-center">
<span className="eyebrow"><svg aria-hidden="true" className="vet-svg-icon" fill="currentColor" focusable="false" stroke="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="2"></circle><circle cx="13" cy="5" r="2"></circle><circle cx="19" cy="7" r="2"></circle><circle cx="4" cy="12" r="2"></circle><path d="M8 13c2-3 6-3 8 0l3 4c2 4-1 6-5 4-2-1-4-1-6 0-4 2-7-1-5-4z"></path></svg> Popular Products</span>
<h2>Popular Products for Happy, Healthy Pets</h2>
<div className="row g-4 mt-2" id="products-grid">
<div className="col-6 col-lg-3">
<div className="card-s prod text-start">
<div className="ph"><img alt="HealthyPaws Grain-Free" loading="lazy" src="/beta/node/images/product-image-1.jpg"/></div>
<div className="px-2 pt-3 pb-2"><span className="stars"></span>
<h6 className="px-0 pt-2 pb-1">HealthyPaws Grain-Free</h6>
<div className="price"><b>$50.00</b><s>$75.00</s></div>
</div>
</div>
</div>
<div className="col-6 col-lg-3">
<div className="card-s prod text-start">
<div className="ph"><img alt="Nutribite Premium Kibble" loading="lazy" src="/beta/node/images/product-image-2.jpg"/></div>
<div className="px-2 pt-3 pb-2"><span className="stars"></span>
<h6 className="px-0 pt-2 pb-1">Nutribite Premium Kibble</h6>
<div className="price"><b>$80.00</b><s>$99.00</s></div>
</div>
</div>
</div>
<div className="col-6 col-lg-3">
<div className="card-s prod text-start">
<div className="ph"><img alt="Puppy Grow Starter" loading="lazy" src="/beta/node/images/product-image-3.jpg"/></div>
<div className="px-2 pt-3 pb-2"><span className="stars"></span>
<h6 className="px-0 pt-2 pb-1">Puppy Grow Starter</h6>
<div className="price"><b>$60.00</b><s>$80.00</s></div>
</div>
</div>
</div>
<div className="col-6 col-lg-3">
<div className="card-s prod text-start">
<div className="ph"><img alt="WhiskerFeast Gourmet" loading="lazy" src="/beta/node/images/product-image-4.jpg"/></div>
<div className="px-2 pt-3 pb-2"><span className="stars"></span>
<h6 className="px-0 pt-2 pb-1">WhiskerFeast Gourmet</h6>
<div className="price"><b>$20.00</b><s>$35.00</s></div>
</div>
</div>
</div>
</div>
<div className="small mt-5"><span className="pill">Free</span> Let's make something great work together. <a className="text-coral" href="/beta/node/contact-us">Get Free Quote</a></div>
</div>
</section>
  );
}

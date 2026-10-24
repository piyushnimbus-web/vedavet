import React from "react";

export default function HomeFooter(){
  return (
<footer className="bg-dark-maroon text-white" id="contact">
<div className="container py-5">
<div className="row g-4 align-items-start">
<div className="col-lg-4">
<a className="navbar-brand fw-bold text-white d-block mb-3" href="/beta/node/contact-us"><span className="logo"><svg aria-hidden="true" className="vet-svg-icon" fill="currentColor" focusable="false" stroke="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="2"></circle><circle cx="13" cy="5" r="2"></circle><circle cx="19" cy="7" r="2"></circle><circle cx="4" cy="12" r="2"></circle><path d="M8 13c2-3 6-3 8 0l3 4c2 4-1 6-5 4-2-1-4-1-6 0-4 2-7-1-5-4z"></path></svg></span> Petona</a>
<p className="small opacity-75">Paws & Care Veterinary Clinic is dedicated to providing compassionate, high-quality pet healthcare.</p>
<div className="f-box"><svg aria-hidden="true" className="vet-pictogram vet-icon-phone" fill="none" focusable="false" stroke="#07376E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M18 8 9 16q-3 22 16 39t30-1l-8-10-10 5q-15-7-19-19l5-10Z"></path><path className="accent" d="M38 12q14 3 16 17M39 21q7 2 8 9"></path></svg>
<div><small>Contact Us</small><b>(123) 456-789</b></div>
</div>
<div className="f-box"><svg aria-hidden="true" className="vet-pictogram vet-icon-certificate" fill="none" focusable="false" stroke="#07376E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect height="39" rx="2" width="46" x="9" y="8"></rect><rect height="31" rx="1" width="38" x="13" y="12"></rect><path d="M24 47v11l8-4 8 4V47"></path><circle cx="32" cy="27" r="9"></circle><g className="accent"><circle cx="28" cy="24" r="1.5"></circle><circle cx="34" cy="24" r="1.5"></circle><path d="M27 31q5-8 10 0q1 4-5 3q-6 1-5-3Z"></path></g></svg>
<div><small>Email Us</small><b>info@domainname.com</b></div>
</div>
</div>
<div className="col-lg-8">
<form className="d-flex gap-2 mb-5 news" id="news-form">
<label className="align-self-center me-2 small">Newsletter Signup</label>
<input className="form-control" placeholder="Enter Your E-mail" required={true} type="email"/>
<button className="btn btn-coral">Subscribe <svg aria-hidden="true" className="vet-svg-icon" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 17 17 7M8 7h9v9"></path></svg></button>
</form>
<div className="row g-4 small">
<div className="col-6 col-md-3">
<h6>Quick Links</h6>
<ul className="list-unstyled f-links">
<li>Home</li>
<li>About Us</li>
<li>Services</li>
<li>Appointment</li>
<li>Contact Us</li>
</ul>
</div>
<div className="col-6 col-md-3">
<h6>Our Services</h6>
<ul className="list-unstyled f-links">
<li>General Health Checkups</li>
<li>Vaccinations & Preventive Care</li>
<li>Surgery & Orthopedics</li>
<li>Nutrition & Diet Plans</li>
<li>Diagnostic Imaging</li>
</ul>
</div>
<div className="col-md-6">
<h6>Contact Info</h6>
<ul className="list-unstyled f-links">
<li><svg aria-hidden="true" className="vet-svg-icon text-coral" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>                                    123 Pet Wellness Street, City, Country</li>
<li><svg aria-hidden="true" className="vet-svg-icon text-coral" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>                                    Mon-Sat: 9:00 AM - 6:00 PM<br/>Sunday Closed</li>
</ul>
</div>
</div>
</div>
</div>
</div>
<div className="text-center small py-3 border-top border-light-subtle opacity-75">Copyright © 2025 All Rights Reserved</div>
</footer>
  );
}

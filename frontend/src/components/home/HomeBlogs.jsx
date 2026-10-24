import React from "react";

export default function HomeBlogs(){
  return (
<section className="py-section" id="blog">
<div className="container">
<div className="row align-items-end g-4 mb-4">
<div className="col-lg-5"><span className="eyebrow"><svg aria-hidden="true" className="vet-svg-icon" fill="currentColor" focusable="false" stroke="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="2"></circle><circle cx="13" cy="5" r="2"></circle><circle cx="19" cy="7" r="2"></circle><circle cx="4" cy="12" r="2"></circle><path d="M8 13c2-3 6-3 8 0l3 4c2 4-1 6-5 4-2-1-4-1-6 0-4 2-7-1-5-4z"></path></svg> Latest Blogs</span>
<h2 className="mb-0">Helpful pet care tips, news & expert advice</h2>
</div>
<div className="col-lg-5 offset-lg-1">
<p className="muted small">Stay informed with our latest articles covering health tips, training guidance, nutrition insights and everything your pet needs for a happy life.</p><a className="btn btn-coral" href="/beta/node/blogs">View All Blogs <svg aria-hidden="true" className="vet-svg-icon" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 17 17 7M8 7h9v9"></path></svg></a></div>
</div>
<div className="row g-4" id="blog-grid">
<div className="col-md-4">
<article className="post">
<div className="ph"><span className="cat">Nutrition</span><img alt="Mental Stimulation: Why Pet Needs More Than Just Exercise" loading="lazy" src="/beta/node/images/Post-1.jpg"/></div>
<h6>Mental Stimulation: Why Pet Needs More Than Just Exercise</h6><a href="/beta/node/contact-us">Read More <svg aria-hidden="true" className="vet-svg-icon" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 17 17 7M8 7h9v9"></path></svg></a></article>
</div>
<div className="col-md-4">
<article className="post">
<div className="ph"><span className="cat">Veterinary Care</span><img alt="How to Create a Stress-Free Vet Experience for Anxious Dogs & Cats" loading="lazy" src="/beta/node/images/Post-2.jpg"/></div>
<h6>How to Create a Stress-Free Vet Experience for Anxious Dogs & Cats</h6><a href="/beta/node/contact-us">Read More <svg aria-hidden="true" className="vet-svg-icon" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 17 17 7M8 7h9v9"></path></svg></a></article>
</div>
<div className="col-md-4">
<article className="post">
<div className="ph"><span className="cat">Pet Visits</span><img alt="Proven Ways to Reduce Stress in Pet Before and During Vet Visits" loading="lazy" src="/beta/node/images/Post-3.jpg"/></div>
<h6>Proven Ways to Reduce Stress in Pet Before and During Vet Visits</h6><a href="/beta/node/contact-us">Read More <svg aria-hidden="true" className="vet-svg-icon" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 17 17 7M8 7h9v9"></path></svg></a></article>
</div>
</div>
</div>
</section>
  );
}

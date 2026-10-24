import React, {useEffect, useState} from 'react';
import './HomeTestimonials.css';
const reviews = [{"name": "Sarah Johnson & Bella", "role": "Marketing Executive", "image": "/beta/node/images/Testimonials-1.jpg", "quote": "I cannot express how grateful I am for the care and the incredible team behind it."}, {"name": "Rohan Mehta & Simba", "role": "Software Engineer", "image": "/beta/node/images/Testimonials-2.jpg", "quote": "The doctors are patient, gentle and explain everything clearly."}, {"name": "Anita Sharma & Coco", "role": "School Teacher", "image": "/beta/node/images/t-3.png", "quote": "The follow-up reminders and diet plan made a real difference."}, {"name": "David Miller & Rocky", "role": "Photographer", "image": "/beta/node/images/te4.png", "quote": "Rocky was treated right away and is back to playing."}, {"name": "Priya Nair & Luna", "role": "Graphic Designer", "image": "/beta/node/images/t-6.png", "quote": "Regular checkups mean we catch small things early."}, {"name": "Karan Verma & Milo", "role": "Pet owner", "image": "/beta/node/images/t7.png", "quote": "Clean clinic, kind staff and honest advice."}];
export default function HomeTestimonials(){
  const [current,setCurrent]=useState(0);
  useEffect(()=>{const timer=window.setInterval(()=>setCurrent(i=>(i+1)%reviews.length),4500);return()=>window.clearInterval(timer)},[]);
  const go=(direction)=>setCurrent(i=>(i+direction+reviews.length)%reviews.length);
  const review=reviews[current];
  return <section id="testimonials" className="py-section bg-cream reference-testimonials vv-react-testimonials">
    <div className="container"><div className="row g-5 align-items-center">
      <div className="col-lg-6"><span className="eyebrow">✦ Testimonials</span><h2>What our happy pet owners say</h2>
        <p className="muted">At our Veterinary & Pet Care Clinic, we believe that every pet deserves exceptional care and every owner deserves peace of mind.</p>
        <div className="row g-2 small mb-4">{['Parasite prevention consultation','Preventive Care Visit','Pet Health Advisory','Pet Care Assessment'].map(item=><div className="col-6" key={item}>✓ {item}</div>)}</div>
        <div className="white-box"><div><b>96% Client</b><small className="d-block">Satisfaction Rate</small><small className="muted">Our clients trust us because we care like family — always putting pets first.</small></div><span className="badge-round sm" aria-hidden="true">✦</span></div>
      </div>
      <div className="col-lg-6"><div className="vv-testimonial-carousel" aria-roledescription="carousel" aria-label="Pet owner testimonials">
        <div className="tslide" key={current}><img src={review.image} alt={review.name} loading="lazy"/><span className="count">{String(current+1).padStart(2,'0')} / {String(reviews.length).padStart(2,'0')}</span>
          <div className="quote"><span className="vv-quote-mark">“</span><p>“{review.quote}”</p><div className="who"><span className="av">{review.name[0]}</span><div><b>{review.name}</b><small className="d-block opacity-75">{review.role}</small></div><span className="stars ms-auto" aria-hidden="true"/></div></div></div>
        <button type="button" className="car-btn prev" aria-label="Previous testimonial" onClick={()=>go(-1)}>←</button>
        <button type="button" className="car-btn next" aria-label="Next testimonial" onClick={()=>go(1)}>→</button>
        <div className="vv-testimonial-dots">{reviews.map((x,i)=><button type="button" key={x.name} aria-label={'Show testimonial '+(i+1)} aria-current={i===current?'true':undefined} onClick={()=>setCurrent(i)}/>)}</div>
      </div></div>
    </div></div>
  </section>
}

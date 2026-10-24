import React, { useState } from 'react';
import './AboutUs.css';

const asset = (name) => `/beta/node/images/${name}`;
const principles = [
  {title:'Our Mission',icon:'♡',image:'Post-3.jpg',copy:'To provide thoughtful veterinary care while helping every pet feel safe, valued and loved.'},
  {title:'Our Vision',icon:'✚',image:'service-image-2-prime.jpg',copy:'To make compassionate pet healthcare more approachable for families in our community.'},
  {title:'Our Values',icon:'✧',image:'service-image-3-prime.jpg',copy:'Kindness, clarity, responsible care and respect for every animal and pet parent.'}
];
const specialties = [
  {icon:'♧',title:'Pet Health Services',copy:'Consultations and preventive care focused on your pet’s wellbeing.'},
  {icon:'✧',title:'Expert Care & Advice',copy:'Guidance for pet parents, with treatment tailored to each patient.'},
  {icon:'✚',title:'Medical Facilities',copy:'Ask our team about available diagnostics and care at your branch.'},
  {icon:'♡',title:'Compassionate Team',copy:'A calming, supportive approach to pets and their families.'}
];
const faqs = [
  {q:'How do I book an appointment at VedaVet?',a:'You can submit an appointment request through our booking page. Our team can confirm the doctor, branch and availability.'},
  {q:'What services does VedaVet provide?',a:'Explore our Services page for veterinary consultations, preventive care and other listed services. Please confirm branch availability before visiting.'},
  {q:'Can I discuss my pet’s symptoms before visiting?',a:'Yes. Contact the hospital team for guidance about the appropriate appointment. For urgent symptoms, contact an emergency veterinary facility promptly.'},
  {q:'Can I bring a new pet for its first consultation?',a:'Yes. Tell us your pet’s age, species and concerns when booking so the team can prepare.'},
  {q:'How can I contact the hospital?',a:'Visit the Contact Us page to view available contact information and send an enquiry.'}
];
export default function AboutUs(){
  const [active,setActive]=useState(0);
  return <main className="about-vv">
    <section className="about-vv-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(5,29,63,.75),rgba(5,29,63,.58)),url('${asset('banner.jpg')}')`}}>
      <div className="about-vv-hero-content"><h1>About us</h1><p><a href="/beta/node/">HOME</a><span> / </span>ABOUT US</p></div>
    </section>

    <section className="about-vv-intro about-vv-wrap">
      <div className="about-vv-intro-art">
        <img src={asset('about-us-image-prime.png')} alt="Veterinary doctor caring for a pet"/>
        <div className="about-vv-float about-vv-float-top">♥ ♥ ♥ ♥ ♥<small>CARE WITH COMPASSION</small></div>
        <div className="about-vv-float about-vv-float-bottom"><strong>Pet-first</strong><small>VETERINARY CARE</small></div>
      </div>
      <div className="about-vv-intro-text"><span className="about-vv-eyebrow">✚ ABOUT US</span><h2>Raising the standard of pet's health &amp; wellness</h2><p>At VedaVet Pet Hospital, we believe caring for pets means supporting the people who love them, too. We aim to offer a warm, reassuring veterinary experience.</p>
        <div className="about-vv-feature"><span>♧</span><div><h3>Caring &amp; experienced approach</h3><p>Personal attention to the needs of each pet and their family.</p></div></div>
        <div className="about-vv-feature"><span>✚</span><div><h3>Support for your pet's wellbeing</h3><p>Clear advice, preventive guidance and a thoughtful approach to care.</p></div></div>
        <a className="about-vv-button" href="/beta/node/appointment">BOOK APPOINTMENT ↗</a>
      </div>
    </section>

    <div className="about-vv-tiny-line about-vv-wrap">♡ Trusted care &nbsp;&nbsp; ✚ Pet wellbeing &nbsp;&nbsp; ♡ Compassionate service &nbsp;&nbsp; ✧ Veterinary support</div>

    <section className="about-vv-cream"><div className="about-vv-wrap"><header className="about-vv-title"><span className="about-vv-eyebrow">✚ OUR APPROACH</span><h2>Our approach to compassionate<br/>pet care excellence</h2></header><div className="about-vv-principles">{principles.map((p)=> <article className="about-vv-principle" key={p.title}><img src={asset(p.image)} alt={p.title}/><div className="about-vv-principle-copy"><div className="about-vv-principle-icon">{p.icon}</div><h3>{p.title}</h3><p>{p.copy}</p></div></article>)}</div><p className="about-vv-bottom-note">♡ Every pet deserves patience, attention and kindness.</p></div></section>

    <section className="about-vv-expertise about-vv-wrap"><div className="about-vv-expertise-text"><span className="about-vv-eyebrow">✚ OUR EXPERTISE</span><h2>Our expertise driving growth,<br/>success, and excellence</h2><p>Veterinary care built around communication, compassion and attention to each pet.</p><div className="about-vv-progress"><div><span>Pet-centered care</span><span>Our priority</span></div><i><b style={{width:'95%'}}/></i></div><div className="about-vv-progress"><div><span>Family-focused support</span><span>Our promise</span></div><i><b style={{width:'87%'}}/></i></div><a href="/beta/node/services" className="about-vv-button">EXPLORE OUR CARE ↗</a></div><div className="about-vv-expertise-art"><div className="about-vv-circle"/><img src={asset('what-we-image-prime.jpg')} alt="Veterinary professional with a pet"/><div className="about-vv-rating">♡ <strong>Care you can trust</strong><small>VedaVet Pet Hospital</small></div></div></section>

    <section className="about-vv-video"><img src={asset('service-image-2-prime.jpg')} alt="Pet receiving gentle veterinary care"/><div className="about-vv-video-overlay"><span>♡</span><p>COMPASSION IN EVERY VISIT</p></div></section>

    <section className="about-vv-team about-vv-wrap"><header className="about-vv-title"><span className="about-vv-eyebrow">✚ OUR TEAM</span><h2>Meet our dedicated veterinary<br/>care professionals</h2></header><div className="about-vv-team-grid">{[
      {image:'Post-3.jpg',title:'Veterinary Team',label:'Compassionate care'},
      {image:'service-image-4-prime.jpg',title:'Pet Care Team',label:'Supporting your pet'},
      {image:'service-image-2-prime.jpg',title:'Clinical Care',label:'Thoughtful treatment'},
      {image:'Post-2.jpg',title:'Wellness Support',label:'Healthy pets, happy families'}
    ].map(person=><article className="about-vv-team-card" key={person.title}><img src={asset(person.image)} alt={person.title}/><h3>{person.title}</h3><p>{person.label}</p></article>)}</div><p className="about-vv-bottom-note">♡ Confirm individual doctors and availability with your VedaVet branch.</p></section>

    <section className="about-vv-pets"><div className="about-vv-pets-copy"><span className="about-vv-eyebrow">✚ CONTACT US TODAY</span><h2>Reach out for compassionate and<br/>reliable pet care</h2><p>We're here to help you take the next step in caring for your companion.</p><a className="about-vv-button" href="/beta/node/contact-us">CONTACT US TODAY ↗</a></div><img src={asset('why-cho.png')} alt="A group of dogs and cats"/></section>

    <section className="about-vv-explore about-vv-wrap"><div><span className="about-vv-eyebrow">✚ WHY CHOOSE US</span><h2>Explore what we do to create<br/>meaningful pet care</h2><p>Practical, compassionate support for pets and their families.</p><ul><li>Care that puts your pet first</li><li>Clear and friendly communication</li><li>Support at every stage of life</li></ul><a className="about-vv-button" href="/beta/node/services">VIEW OUR SERVICES ↗</a></div><div className="about-vv-explore-grid">{specialties.map(s=><article key={s.title}><span>{s.icon}</span><h3>{s.title}</h3><p>{s.copy}</p><a href="/beta/node/services">Learn more →</a></article>)}</div></section>

    <section className="about-vv-testimonials"><div className="about-vv-wrap"><header className="about-vv-title"><span className="about-vv-eyebrow">✚ OUR COMMITMENT</span><h2>Heartfelt experiences shared by<br/>our happy clients</h2></header><div className="about-vv-test-grid"><div className="about-vv-score"><span>♡ ♡ ♡ ♡ ♡</span><strong>Care</strong><b>AT THE HEART</b><p>We value the trust pet parents place in our team.</p></div><article><span>“</span><p>We know that every visit matters. Our goal is to create a welcoming environment where pets and their people feel heard and supported.</p><strong>VedaVet Pet Hospital</strong><small>Our care philosophy</small></article><article><span>“</span><p>From your pet’s first consultation to ongoing wellness, we aim to offer guidance with empathy, kindness and transparency.</p><strong>VedaVet Pet Hospital</strong><small>Our commitment</small></article></div><p className="about-vv-bottom-note">♡ Verified client testimonials can be added when supplied and approved.</p></div></section>

    <section className="about-vv-faq about-vv-wrap"><div><span className="about-vv-eyebrow">✚ FREQUENTLY ASKED QUESTIONS</span><h2>Clear answer to most<br/>common pet care</h2><p>Find answers to the questions pet parents ask most often.</p><a className="about-vv-button" href="/beta/node/contact-us">CONTACT US ↗</a></div><div className="about-vv-faq-items">{faqs.map((item,i)=><div className={'about-vv-accordion '+(active===i?'is-open':'')} key={item.q}><button aria-expanded={active===i} type="button" onClick={()=>setActive(active===i?-1:i)}><span>{String(i+1).padStart(2,'0')}. {item.q}</span><span>{active===i?'−':'+'}</span></button>{active===i&&<p>{item.a}</p>}</div>)}</div></section>
  </main>;
}

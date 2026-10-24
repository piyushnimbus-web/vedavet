import React from 'react';
import {Link,useParams} from 'react-router-dom';
import {services} from './serviceData';
import './ServicePremium.css';
export default function ServiceDetail(){
 const {slug}=useParams();
 const service=services.find(s=>s.slug===slug);
 if(!service)return <main className="vv-service-page"><div className="vv-service-heading"><span>OUR VETERINARY SERVICES</span><h1>Service not found</h1><p>The service you requested may have moved.</p><Link to="/services">View all services →</Link></div></main>;
 return <main className="vv-service-page"><div className="vv-service-heading"><span>VEDAVET PET HOSPITAL</span><h1>{service.name}</h1><p><Link to="/">Home</Link> / <Link to="/services">Services</Link> / {service.name}</p></div><section className="vv-service-detail-wrap"><img src={service.image} alt={service.name}/><div><span className="vv-service-kicker">COMPASSIONATE VETERINARY CARE</span><h2>Expert care tailored to your pet</h2><p>{service.description}</p><p>Our veterinary team can explain assessments, preparation, follow-up care and next steps for your pet. Doctor availability, branch and pricing will be confirmed by our hospital staff.</p><ul><li>Experienced veterinary team</li><li>Personalised care recommendations</li><li>Clear guidance and follow-up</li></ul><button type="button" className="vv-service-cta" data-book-appointment>Book Appointment ↗</button><p className="vv-service-disclaimer">Booking requests are subject to hospital confirmation.</p></div></section><div className="vv-service-more"><h2>Explore More Services</h2><div>{services.filter(s=>s.slug!==slug).slice(0,3).map(s=><Link key={s.slug} to={'/services/'+s.slug}><img src={s.image} alt=""/><strong>{s.name}</strong><span>Explore Service ↗</span></Link>)}</div></div></main>;
}

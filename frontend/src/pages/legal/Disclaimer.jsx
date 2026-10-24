import React from 'react';
import LegalLayout from '../LegalLayout';
export default function Disclaimer(){return <LegalLayout title="Disclaimer" subtitle="Please read this guidance before relying on information presented on the VedaVet website." sections={[
{heading:'General information only',paragraphs:['Articles, product information and service descriptions on this website are provided for general awareness, not as an individual diagnosis or treatment plan.']},
{heading:'Veterinary advice',paragraphs:['Each pet has different health needs. Consult a qualified veterinary professional for examination, treatment and medicine recommendations.']},
{heading:'Urgent or emergency situations',paragraphs:['Do not wait for a website enquiry reply when a pet needs urgent care. Contact an appropriate veterinary emergency service directly. Online form submission is not an emergency response channel.']},
{heading:'Accuracy and availability',paragraphs:['VedaVet aims to provide useful information, but service availability, operational details, website content and product listings may change. Verify essential details before travelling or purchasing.']},
{heading:'External services',paragraphs:['Any external references or maps may be operated by third parties. Their content and availability are outside this website’s direct control.']}
]}/>}

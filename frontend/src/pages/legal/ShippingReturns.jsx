import React from 'react';
import LegalLayout from '../LegalLayout';
export default function ShippingReturns(){return <LegalLayout title="Shipping & Returns" subtitle="Delivery and return information for the VedaVet pet shop, to be confirmed before checkout launches." sections={[
{heading:'Where we deliver',paragraphs:['The serviceable postal codes, delivery partners and dispatch location are not yet confirmed. Delivery availability must be verified before an order is placed.']},
{heading:'Shipping charges and timelines',paragraphs:['Shipping fees, estimated delivery windows and free-shipping eligibility will be presented when approved shop operations are available.']},
{heading:'Packaging and product care',paragraphs:['Special handling may apply to certain pet-care products. Products requiring specific temperature control, prescriptions or other restrictions should not be offered without the relevant operational checks.']},
{heading:'Return eligibility',paragraphs:['Eligible items, return windows, opened-product restrictions and damaged-item reporting requirements are pending VedaVet approval. The final return rules should be displayed before checkout is enabled.']},
{heading:'Support for a delivery issue',paragraphs:['Contact the VedaVet team with your order reference and a description of the concern. Do not send sensitive payment information through the contact form.']}
]}/>}

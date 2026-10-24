import React from 'react';
import LegalLayout from '../LegalLayout';
export default function PrivacyPolicy(){return <LegalLayout title="Privacy Policy" subtitle="Understand how information may be used when you contact VedaVet, book appointments or access the website." sections={[
{heading:'Information you may provide',paragraphs:['When you submit an enquiry, you may provide your name, contact information and details about your pet or request. Additional information may be needed for appointments or services.']},
{heading:'Why information is requested',paragraphs:['Information submitted through our website is intended to help respond to enquiries, coordinate appointments and provide requested services. The final list of processing purposes requires hospital approval.']},
{heading:'Third-party services',paragraphs:['The website may use service providers for hosting, communications or transactions once enabled. Their identity, roles and relevant privacy terms must be confirmed before launch.']},
{heading:'Storage, security and retention',paragraphs:['Access controls, retention periods, and deletion procedures must be confirmed by VedaVet. Please do not submit sensitive payment or medical details through an unsecured enquiry form.']},
{heading:'Your requests',paragraphs:['For requests about personal information you have submitted, please reach out through the Contact Us page. The formal rights and response process should be documented in the final policy.']}
]}/>}

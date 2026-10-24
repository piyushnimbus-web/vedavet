import React from 'react';import PageLayout from './PageLayout';import AppointmentForm from '../components/AppointmentForm';
export default function Appointment(){return <PageLayout title="Book an Appointment"><h2>Request a visit for your pet</h2><p>Please share your preferred date and time. The hospital will confirm the slot separately.</p><AppointmentForm/></PageLayout>;}

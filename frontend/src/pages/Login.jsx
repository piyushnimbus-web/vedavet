import React from 'react';
import AuthForm from './AuthForm';
import './StaffLogin.css';
export default function Login(){return <main className="vv-staff-bg"><section className="vv-staff-card" aria-labelledby="vv-staff-title"><img src="/beta/node/images/logo.png" alt="VedaVet Pet Hospital"/><span className="vv-staff-eyebrow">SECURE TEAM ACCESS</span><h1 id="vv-staff-title">Staff Login</h1><p>Sign in with your authorized staff credentials to access the hospital dashboard.</p><AuthForm mode="login"/></section></main>}

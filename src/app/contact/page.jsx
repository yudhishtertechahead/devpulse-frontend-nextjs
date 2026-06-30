'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import '@/styles/AuthPages.css';

export default function ContactPage() {
  return (
    <main className="auth-page" style={{ position: 'relative' }}>
      <Link
        href="/"
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#cbd5e1',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        <ArrowLeft size={16} /> Back to App
      </Link>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ContactForm />
      </div>
    </main>
  );
}

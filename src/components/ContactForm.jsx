'use client';

import { useState } from 'react';
import { useForm } from '@/hooks/useForm';
import { submitContact } from '@/lib/api/contactApi';
import '@/styles/ContactForm.css';

// Validation rules — returns an errors object
function validate(values) {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = 'Name is required';
  }
  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!values.message.trim()) {
    errors.message = 'Message is required';
  } else if (values.message.trim().length < 20) {
    errors.message = 'Message must be at least 20 characters';
  }
  return errors;
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, reset } =
    useForm({ name: '', email: '', message: '' }, validate);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError('');
    
    try {
      await submitContact(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-form-container">
        <div className="contact-form-success" role="status">
          <h3>Thank you!</h3>
          <p>Your message has been received. We'll be in touch soon.</p>
          <button 
            className="contact-form-submit" 
            style={{ marginTop: '20px' }}
            onClick={() => setSubmitted(false)}
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-container">
      <h2 className="contact-form-title">Contact Support</h2>
      
      {apiError && (
        <div style={{ background: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }} role="alert">
          ✕ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="contact-form-group">
          <label className="contact-form-label" htmlFor="name">Full Name</label>
          <input
            className={`contact-form-input ${errors.name && touched.name ? 'is-invalid' : ''}`}
            id="name" 
            name="name" 
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
            aria-invalid={!!(errors.name && touched.name)}
            placeholder="John Doe"
          />
          {errors.name && touched.name && (
            <span className="contact-form-error" id="name-error" role="alert">{errors.name}</span>
          )}
        </div>

        <div className="contact-form-group">
          <label className="contact-form-label" htmlFor="email">Email Address</label>
          <input
            className={`contact-form-input ${errors.email && touched.email ? 'is-invalid' : ''}`}
            id="email" 
            name="email" 
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
            aria-invalid={!!(errors.email && touched.email)}
            placeholder="john@example.com"
          />
          {errors.email && touched.email && (
            <span className="contact-form-error" id="email-error" role="alert">{errors.email}</span>
          )}
        </div>

        <div className="contact-form-group">
          <label className="contact-form-label" htmlFor="message">Message</label>
          <textarea
            className={`contact-form-textarea ${errors.message && touched.message ? 'is-invalid' : ''}`}
            id="message" 
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.message && touched.message ? 'message-error' : undefined}
            aria-invalid={!!(errors.message && touched.message)}
            placeholder="How can we help you?"
          />
          {errors.message && touched.message && (
            <span className="contact-form-error" id="message-error" role="alert">{errors.message}</span>
          )}
        </div>

        <button 
          className="contact-form-submit" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Copy } from 'lucide-react';
import { services } from '@/data/content';
type Draft = { url: string; text: string };
export function EnquiryForm() {
  const [ready, setReady] = useState(false);
  const [service, setService] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fallback = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    setReady(true);
    const selected = new URLSearchParams(window.location.search).get('service');
    if (
      selected &&
      (selected === 'other' || services.some((s) => s.slug === selected))
    )
      setService(selected);
  }, []);
  function invalidate(event: React.FormEvent<HTMLFormElement>) {
    const field = event.target;
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    )
      setErrors((previous) => ({ ...previous, [field.name]: '' }));
    setDraft(null);
    setCopyStatus('');
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const validationErrors: Record<string, string> = {};
    for (const name of ['name', 'email', 'company', 'message']) {
      const field = form.elements.namedItem(name) as
        HTMLInputElement | HTMLTextAreaElement;
      const text = field.value.trim();
      if (name === 'email' && (!text || field.validity.typeMismatch))
        validationErrors[name] = 'Enter a valid work email address.';
      else if (name === 'message' && text.length < 10)
        validationErrors[name] =
          'Describe your project in at least 10 characters, excluding surrounding spaces.';
      else if (!text) validationErrors[name] = `Please enter your ${name}.`;
    }
    setErrors(validationErrors);
    const invalid = Object.keys(validationErrors)[0];
    if (invalid) {
      (form.elements.namedItem(invalid) as HTMLElement).focus();
      return;
    }
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) || '').trim();
    const label =
      service === 'other'
        ? 'Other'
        : services.find((s) => s.slug === service)?.name || 'General enquiry';
    const subject = `Website enquiry | ${label}`;
    const body = `Name: ${value('name')}\nEmail: ${value('email')}\nCompany: ${value('company')}\nPhone: ${value('phone') || 'Not provided'}\nService: ${label}\n\n${value('message')}`;
    setDraft({
      url: `mailto:contact@lakshya-soft.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      text: `To: contact@lakshya-soft.com\nSubject: ${subject}\n\n${body}`,
    });
    setCopyStatus('');
  }
  async function copyDraft() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.text);
      setCopyStatus(
        'Enquiry copied. Paste it into your email app and send it to contact@lakshya-soft.com.',
      );
    } catch {
      fallback.current?.focus();
      fallback.current?.select();
      setCopyStatus(
        'Automatic copying is unavailable. Copy the selected enquiry text using your keyboard or device menu.',
      );
    }
  }
  return (
    <form
      noValidate
      className="contact-form"
      onSubmit={submit}
      onChange={invalidate}
    >
      <h2>What are you working on?</h2>
      <p>
        Share a little about your challenge. This form prepares an email for you
        to review and send.
      </p>
      <div className="form-grid">
        <label className="field">
          Your name *
          <input
            name="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'error-name' : undefined}
            required
            autoComplete="name"
            maxLength={100}
            placeholder="Full name"
          />
          {errors.name && (
            <span className="field-error" id="error-name">
              {errors.name}
            </span>
          )}
        </label>
        <label className="field">
          Work email *
          <input
            name="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'error-email' : undefined}
            required
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@company.com"
          />
          {errors.email && (
            <span className="field-error" id="error-email">
              {errors.email}
            </span>
          )}
        </label>
        <label className="field">
          Company *
          <input
            name="company"
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? 'error-company' : undefined}
            required
            autoComplete="organization"
            maxLength={150}
            placeholder="Company name"
          />
          {errors.company && (
            <span className="field-error" id="error-company">
              {errors.company}
            </span>
          )}
        </label>
        <label className="field">
          Phone (optional)
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            placeholder="Phone number"
          />
        </label>
        <label className="field full">
          I’m interested in
          <select
            name="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Let’s discuss / general enquiry</option>
            {services.map((s) => (
              <option value={s.slug} key={s.slug}>
                {s.name}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
        </label>
        <label className="field full">
          Your project or challenge *
          <textarea
            name="message"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'error-message' : undefined}
            required
            minLength={10}
            maxLength={4000}
            placeholder="What would you like to build, improve or explore?"
          />
          {errors.message && (
            <span className="field-error" id="error-message">
              {errors.message}
            </span>
          )}
        </label>
      </div>
      <p className="form-note">
        Your details stay in this form until you open your email app and send
        the message. Please avoid including sensitive information.
      </p>
      <noscript>
        <p>
          Send your enquiry by email to{' '}
          <a href="mailto:contact@lakshya-soft.com">contact@lakshya-soft.com</a>
          .
        </p>
      </noscript>
      <button disabled={!ready} type="submit" className="button button-dark">
        Prepare enquiry <ArrowUpRight size={17} />
      </button>
      {draft && (
        <div className="form-status">
          <p role="status">
            Your enquiry is ready. Review it below, then open your email app or
            copy the text.
          </p>
          <div className="draft-actions">
            <a className="button button-dark" href={draft.url}>
              Open email draft <ArrowUpRight size={16} />
            </a>
            <button
              className="button button-light"
              type="button"
              onClick={copyDraft}
            >
              <Copy size={16} /> Copy enquiry
            </button>
          </div>
          <label className="field">
            Your prepared enquiry
            <textarea ref={fallback} readOnly value={draft.text} rows={10} />
          </label>
          <p role="status" aria-live="polite">
            {copyStatus}
          </p>
          <p className="form-note">
            For a long enquiry or if no email app opens, copy the text into an
            email to contact@lakshya-soft.com. Editing the form clears this
            draft so you can prepare it again.
          </p>
        </div>
      )}
    </form>
  );
}

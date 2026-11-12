'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Copy } from 'lucide-react';
import { services } from '@/data/content';
type Draft = { url: string; text: string };
export function EnquiryForm() {
  const [service, setService] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fallback = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
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
    ) {
      field.setCustomValidity('');
      setErrors((previous) => ({ ...previous, [field.name]: '' }));
    }
    setDraft(null);
    setCopyStatus('');
  }
  // The browser blocks submission for built-in failures (an empty required
  // field, a malformed email) before `submit` runs, so record those here too.
  function recordInvalid(event: React.FormEvent<HTMLFormElement>) {
    const field = event.target;
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    ) {
      const { name, validationMessage } = field;
      setErrors((previous) => ({ ...previous, [name]: validationMessage }));
    }
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const validationErrors: Record<string, string> = {};
    for (const name of ['name', 'company', 'message']) {
      const field = form.elements.namedItem(name) as
        HTMLInputElement | HTMLTextAreaElement;
      field.setCustomValidity(
        field.value.trim().length < (name === 'message' ? 10 : 1)
          ? name === 'message'
            ? 'Describe your project in at least 10 characters, excluding surrounding spaces.'
            : `Please enter your ${name}.`
          : '',
      );
    }
    // Browsers accept addresses such as "name@example"; require a dotted domain.
    const email = form.elements.namedItem('email') as HTMLInputElement;
    email.setCustomValidity(
      email.value && !/^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(email.value)
        ? 'Enter a complete email address, such as name@company.com.'
        : '',
    );
    for (const name of ['name', 'email', 'company', 'message']) {
      const field = form.elements.namedItem(name) as
        HTMLInputElement | HTMLTextAreaElement;
      if (field.validationMessage)
        validationErrors[name] = field.validationMessage;
    }
    setErrors(validationErrors);
    if (!form.reportValidity()) return;
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
      className="contact-form"
      onSubmit={submit}
      onChange={invalidate}
      onInvalidCapture={recordInvalid}
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
      <button type="submit" className="button button-dark">
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

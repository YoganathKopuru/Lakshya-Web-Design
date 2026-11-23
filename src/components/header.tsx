'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { services } from '@/data/content';

export function Header() {
  const pathname = usePathname();
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const expertiseTrigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);
  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      if (mega) {
        setMega(false);
        expertiseTrigger.current?.focus();
      } else if (open) {
        setOpen(false);
        menuTrigger.current?.focus();
      }
    }
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open, mega]);
  // The open phone menu covers the page, so the page must not scroll under
  // it (globals.css applies the lock only at the phone breakpoint).
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.dataset.navOpen = '';
    else delete root.dataset.navOpen;
    return () => {
      delete root.dataset.navOpen;
    };
  }, [open]);
  const closeMenus = () => {
    setMega(false);
    if (open) {
      setOpen(false);
      menuTrigger.current?.focus();
    } else {
      expertiseTrigger.current?.focus();
    }
  };
  return (
    <>
      <header
        className="site-header"
        onBlur={(event) => {
          // Tabbing past the last menu item would otherwise move focus onto
          // page content hidden under the open menu.
          const next = event.relatedTarget as Node | null;
          if (next && !event.currentTarget.contains(next)) {
            setOpen(false);
            setMega(false);
          }
        }}
      >
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Lakshya home">
            <img
              src="/logo-reverse.png"
              alt="Lakshya Software Technologies"
              width="164"
              height="54"
            />
          </Link>
          <button
            ref={menuTrigger}
            className="menu-toggle"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => {
              setOpen(!open);
              setMega(false);
            }}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="primary-nav"
            className={open ? 'nav open' : 'nav'}
            aria-label="Main navigation"
          >
            <div className="expertise-nav">
              <button
                ref={expertiseTrigger}
                onClick={() => setMega(!mega)}
                aria-expanded={mega}
                aria-controls="expertise-menu"
                className={
                  pathname.startsWith('/services')
                    ? 'nav-button active'
                    : 'nav-button'
                }
              >
                Expertise <ChevronDown size={13} />
              </button>
              {mega && (
                <div className="mega-menu" id="expertise-menu">
                  <div className="mega-intro">
                    <span className="eyebrow">OUR EXPERTISE</span>
                    <h3>
                      Ideas into
                      <br />
                      real-world impact.
                    </h3>
                    <Link href="/services/" onClick={() => setMega(false)}>
                      Explore all services <ArrowRight size={16} />
                    </Link>
                  </div>
                  <div className="mega-links">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        aria-current={
                          pathname.replace(/\/$/, '') === `/services/${s.slug}`
                            ? 'page'
                            : undefined
                        }
                        href={`/services/${s.slug}/`}
                      >
                        {s.name}
                        <ArrowUpRight size={16} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {[
              ['Work', '/work/'],
              ['Industries', '/industries/'],
              ['Company', '/company/'],
              ['Why Lakshya', '/why-lakshya/'],
              ['Careers', '/careers/'],
            ].map(([label, href]) => (
              <Link
                className={
                  pathname === href || pathname === href.slice(0, -1)
                    ? 'active'
                    : ''
                }
                aria-current={
                  pathname.replace(/\/$/, '') === href.replace(/\/$/, '')
                    ? 'page'
                    : undefined
                }
                key={href}
                href={href}
              >
                {label}
              </Link>
            ))}
            <Link className="button button-dark header-cta" href="/contact/">
              Let’s talk <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      </header>
      {/* Rendered outside the header: the header's backdrop-filter makes it the
        containing block for fixed children, which collapsed this to 2px. The
        scrim is a pointer convenience; keyboard users close with Escape. */}
      {(mega || open) && (
        <div
          className={open ? 'menu-scrim nav-scrim' : 'menu-scrim'}
          aria-hidden="true"
          data-lenis-prevent
          onClick={closeMenus}
        />
      )}
    </>
  );
}

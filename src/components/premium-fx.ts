import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Pointer-driven polish layered on top of the scroll reveals: card
 * spotlights, magnetic calls to action, a reactive hero and header depth.
 * Started only when motion is allowed; every listener and inline style is
 * removed by the returned cleanup.
 */
const SPOTLIGHT = [
  '[data-spotlight]',
  '[data-reveal="pillar"]',
  'main a[class*="card"]',
  'main article[class*="card"]',
].join(',');
const MAGNETIC = '[data-magnetic], main .button, .header-cta';

export function startPremiumFx(root: HTMLElement) {
  const cleanups: Array<() => void> = [];
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Header gains depth once the page leaves the top.
  const header = document.querySelector<HTMLElement>('.site-header');
  if (header) {
    const trigger = ScrollTrigger.create({
      start: 12,
      end: 'max',
      onToggle: (self) => {
        if (self.isActive) header.dataset.scrolled = '';
        else delete header.dataset.scrolled;
      },
      // Step aside while reading down the page; return on any upward scroll.
      // An open menu or keyboard focus inside the header keeps it visible.
      onUpdate: (self) => {
        const busy =
          header.querySelector('.mega-menu, .nav.open') !== null ||
          header.matches(':focus-within');
        if (self.direction === 1 && self.scroll() > 520 && !busy)
          header.dataset.tucked = '';
        else if (self.direction === -1 || busy) delete header.dataset.tucked;
      },
    });
    cleanups.push(() => {
      trigger.kill();
      delete header.dataset.scrolled;
      delete header.dataset.tucked;
    });
  }

  // Hero content drifts up and softens as the film scrolls away.
  const hero = root.querySelector<HTMLElement>('[data-hero]');
  const heroContent = hero?.querySelector<HTMLElement>('[data-hero-content]');
  if (hero && heroContent) {
    const tween = gsap.to(heroContent, {
      yPercent: -14,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'clamp(top top+=93)',
        end: 'bottom top',
        scrub: true,
      },
    });
    cleanups.push(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(heroContent, { clearProps: 'transform,opacity' });
    });
  }

  if (!fine) return () => cleanups.forEach((fn) => fn());

  // Hero aurora and grid follow the pointer.
  if (hero) {
    const move = (event: PointerEvent) => {
      const box = hero.getBoundingClientRect();
      hero.style.setProperty('--hx', `${event.clientX - box.left}px`);
      hero.style.setProperty('--hy', `${event.clientY - box.top}px`);
      hero.dataset.pointer = '';
    };
    const leave = () => delete hero.dataset.pointer;
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
      hero.style.removeProperty('--hx');
      hero.style.removeProperty('--hy');
      leave();
    });
  }

  // Cards: a soft light follows the pointer beneath the content.
  const lit = new Set<HTMLElement>();
  const spot = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const card = (event.target as Element | null)?.closest<HTMLElement>(
      SPOTLIGHT,
    );
    lit.forEach((other) => {
      if (other !== card) {
        delete other.dataset.fxLit;
        lit.delete(other);
      }
    });
    if (!card) return;
    if (!card.querySelector(':scope > .fx-glow')) {
      const glow = document.createElement('span');
      glow.className = 'fx-glow';
      glow.setAttribute('aria-hidden', 'true');
      card.prepend(glow);
      card.dataset.fxHost = '';
      if (getComputedStyle(card).position === 'static')
        card.style.position = 'relative';
    }
    const box = card.getBoundingClientRect();
    card.style.setProperty('--fx-x', `${event.clientX - box.left}px`);
    card.style.setProperty('--fx-y', `${event.clientY - box.top}px`);
    card.dataset.fxLit = '';
    lit.add(card);
  };
  document.addEventListener('pointermove', spot, { passive: true });
  cleanups.push(() => {
    document.removeEventListener('pointermove', spot);
    document.querySelectorAll<HTMLElement>('[data-fx-host]').forEach((card) => {
      card.querySelector(':scope > .fx-glow')?.remove();
      delete card.dataset.fxHost;
      delete card.dataset.fxLit;
      card.style.removeProperty('--fx-x');
      card.style.removeProperty('--fx-y');
    });
  });

  // Calls to action lean gently toward the pointer.
  document.querySelectorAll<HTMLElement>(MAGNETIC).forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    const pull = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      x((event.clientX - box.left - box.width / 2) * 0.22);
      y((event.clientY - box.top - box.height / 2) * 0.3);
    };
    const release = () => {
      x(0);
      y(0);
    };
    el.dataset.fxMagnetic = '';
    el.addEventListener('pointermove', pull, { passive: true });
    el.addEventListener('pointerleave', release);
    cleanups.push(() => {
      el.removeEventListener('pointermove', pull);
      el.removeEventListener('pointerleave', release);
      delete el.dataset.fxMagnetic;
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'transform' });
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

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

  // Inner-page heroes, in both directions: the copy lifts away and softens,
  // the line art drifts at its own pace and a hero card eases back as the
  // page scrolls down; scrolling up plays all of it in reverse.
  root.querySelectorAll<HTMLElement>('.page-hero').forEach((pageHero) => {
    const content = Array.from(pageHero.children).filter(
      (child) => !child.matches('.signal-art, .hero-aurora'),
    );
    const art = pageHero.querySelector<HTMLElement>('.signal-art');
    const scroll = () => ({
      trigger: pageHero,
      start: 'clamp(top top+=93)',
      end: 'bottom top',
      scrub: true,
    });
    const tweens = [
      gsap.to(content, {
        y: -40,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: scroll(),
      }),
    ];
    if (art)
      tweens.push(
        gsap.to(art, { yPercent: 16, ease: 'none', scrollTrigger: scroll() }),
      );
    if (pageHero.classList.contains('story-hero'))
      tweens.push(
        gsap.to(pageHero, {
          scale: 0.95,
          transformOrigin: '50% 0%',
          ease: 'none',
          scrollTrigger: scroll(),
        }),
      );
    cleanups.push(() => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      gsap.set([...content, ...(art ? [art] : []), pageHero], {
        clearProps: 'transform,opacity',
      });
    });
  });

  if (!fine) return () => cleanups.forEach((fn) => fn());

  // Inner-page hero art drifts with the pointer for depth.
  root.querySelectorAll<HTMLElement>('.page-hero').forEach((pageHero) => {
    const move = (event: PointerEvent) => {
      const box = pageHero.getBoundingClientRect();
      const px = ((event.clientX - box.left) / box.width) * 2 - 1;
      const py = ((event.clientY - box.top) / box.height) * 2 - 1;
      pageHero.style.setProperty('--px', px.toFixed(3));
      pageHero.style.setProperty('--py', py.toFixed(3));
    };
    const leave = () => {
      pageHero.style.removeProperty('--px');
      pageHero.style.removeProperty('--py');
    };
    pageHero.addEventListener('pointermove', move, { passive: true });
    pageHero.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      pageHero.removeEventListener('pointermove', move);
      pageHero.removeEventListener('pointerleave', leave);
      leave();
    });
  });

  // Hero aurora and grid follow the pointer.
  if (hero) {
    const move = (event: PointerEvent) => {
      const box = hero.getBoundingClientRect();
      hero.style.setProperty('--hx', `${event.clientX - box.left}px`);
      hero.style.setProperty('--hy', `${event.clientY - box.top}px`);
      // Normalised pointer (-1 to 1) for the layered depth drift.
      const px = ((event.clientX - box.left) / box.width) * 2 - 1;
      const py =
        ((event.clientY - box.top) / Math.min(box.height, innerHeight)) * 2 - 1;
      hero.style.setProperty('--px', Math.max(-1, Math.min(1, px)).toFixed(3));
      hero.style.setProperty('--py', Math.max(-1, Math.min(1, py)).toFixed(3));
      hero.dataset.pointer = '';
    };
    const leave = () => {
      delete hero.dataset.pointer;
      hero.style.removeProperty('--px');
      hero.style.removeProperty('--py');
    };
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

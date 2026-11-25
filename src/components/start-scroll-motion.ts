import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { startPremiumFx } from './premium-fx';

function revealItems(target: HTMLElement) {
  const parts = target.querySelectorAll<HTMLElement>('[data-reveal-part]');
  return parts.length ? parts : [target];
}

/**
 * A damped spring (ζ 0.72, ω 10), the same curve as --ease-spring in
 * signature.css: most of the travel early, a 3.8 % overshoot, a soft settle.
 */
function spring(progress: number) {
  if (progress >= 1) return 1;
  const zeta = 0.72;
  const omega = 10;
  const damped = omega * Math.sqrt(1 - zeta * zeta);
  return (
    1 -
    Math.exp(-zeta * omega * progress) *
      (Math.cos(damped * progress) +
        ((zeta * omega) / damped) * Math.sin(damped * progress))
  );
}

/**
 * Curtain up: each word of a heading rises from behind its own mask on the
 * spring, 55 ms after the word before it (the server-rendered headlines in
 * curtain.tsx use the same timing).
 */
function revealHeading(heading: HTMLElement, delay: number) {
  gsap.set(heading, { opacity: 1, y: 0 });
  const split = SplitText.create(heading, {
    type: 'words',
    mask: 'words',
    wordsClass: 'fx-word',
  });
  gsap.from(split.words, {
    yPercent: 118,
    duration: 1.3,
    ease: spring,
    stagger: 0.055,
    delay,
    onComplete: () => {
      split.revert();
      gsap.set(heading, { clearProps: 'transform,opacity' });
    },
  });
}

/** Section labels decode into place like a terminal readout. */
function decode(label: HTMLElement, delay: number) {
  const text = label.textContent ?? '';
  if (!text.trim()) return;
  if (!label.hasAttribute('aria-label')) label.setAttribute('aria-label', text);
  gsap.to(label, {
    duration: 1.1,
    delay: delay + 0.1,
    ease: 'none',
    scrambleText: { text, chars: '01/<>_—▪', speed: 0.5, revealDelay: 0.25 },
  });
}

function reveal(target: HTMLElement, delay: number) {
  if (target.dataset.reveal === 'pillar') {
    gsap.fromTo(
      target,
      { y: 30 },
      { y: 0, duration: 0.7, ease: 'expo.out', delay, clearProps: 'transform' },
    );
  }
  const all = Array.from(revealItems(target));
  const within = (selector: string) =>
    Array.from(target.querySelectorAll<HTMLElement>(selector)).concat(
      target.matches(selector) ? [target] : [],
    );
  const headings = within('h2');
  const items = all.filter((el) => !headings.includes(el));
  headings.forEach((heading) => revealHeading(heading, delay));
  within('.eyebrow').forEach((eyebrow) => decode(eyebrow, delay));
  if (items.length)
    gsap.fromTo(
      items,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'expo.out',
        delay,
        stagger: 0.12,
        clearProps: 'transform,opacity',
      },
    );
  const media = target.querySelectorAll(
    '[data-editorial-zoom] > :is(img, video, .project-visual)',
  );
  if (media.length) {
    gsap.fromTo(
      media,
      { scale: 1.05 },
      {
        scale: 1,
        duration: 0.85,
        ease: 'power2.out',
        delay,
        clearProps: 'transform',
      },
    );
  }
}

function countMetric(metric: HTMLElement) {
  const display = metric.querySelector<HTMLElement>('[data-metric-display]');
  const value = metric.dataset.metric ?? '';
  const match = /^(\d+)(.*)$/.exec(value);
  if (!display || !match) return;
  // A founding year is a date, not a quantity: counting it up from zero
  // flashes wrong years ("1965 Established"), so it simply fades in.
  if (!match[2] && /^(19|20)\d\d$/.test(match[1])) {
    gsap.fromTo(
      metric,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      },
    );
    return;
  }
  const counter = { value: 0 };
  display.textContent = '0' + match[2];
  gsap.to(counter, {
    value: Number(match[1]),
    duration: 1.5,
    ease: 'power2.out',
    onUpdate: () => {
      display.textContent = Math.round(counter.value) + match[2];
    },
  });
  gsap.fromTo(
    metric.querySelector('[data-metric-label]'),
    { opacity: 0 },
    { opacity: 1, duration: 0.65, delay: 0.12, clearProps: 'opacity' },
  );
}

export function startScrollMotion(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
  const context = gsap.context(() => {
    const progress = document.querySelector('[data-scroll-progress]');
    if (progress) {
      gsap.fromTo(
        progress,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
        },
      );
    }
    root
      .querySelectorAll<HTMLElement>('[data-workflow-card]')
      .forEach((card) => {
        const record = card.querySelector('[data-workflow-record]');
        if (!record) return;
        gsap.fromTo(
          record,
          { y: 18, rotation: -2 },
          {
            y: 0,
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'top 42%',
              scrub: 0.25,
            },
          },
        );
      });
    // The hero console starts tipped back and lays flat as it rises into
    // view (its resting tilt is set in home-hero.module.css, so there is no
    // jump before this script loads).
    // Phones get a gentler tilt so the near edge never projects past the
    // screen.
    const tilt = window.innerWidth < 760 ? 9 : 22;
    root.querySelectorAll<HTMLElement>('[data-console]').forEach((panel) => {
      gsap.fromTo(
        panel,
        { transformPerspective: 1600, rotationX: tilt, scale: 0.95 },
        {
          rotationX: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top 92%',
            end: 'top 22%',
            scrub: 0.5,
          },
        },
      );
    });

    // Manifesto words light up in reading order as the statement scrolls by.
    root.querySelectorAll<HTMLElement>('[data-manifesto]').forEach((text) => {
      const words = text.querySelectorAll<HTMLElement>('[data-word]');
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: {
            trigger: text,
            start: 'top 82%',
            end: 'bottom 48%',
            scrub: 0.4,
          },
        },
      );
    });

    // The metrics band grows from a card into its full frame.
    root.querySelectorAll<HTMLElement>('[data-snapshot]').forEach((band) => {
      gsap.fromTo(
        band,
        { scale: 0.92, borderRadius: 40 },
        {
          scale: 1,
          borderRadius: 24,
          ease: 'none',
          scrollTrigger: {
            trigger: band,
            start: 'top bottom',
            end: 'top 45%',
            scrub: 0.3,
          },
        },
      );
    });

    const media = root.querySelector('[data-hero-media]');
    const hero = root.querySelector('[data-hero]');
    if (media && hero) {
      gsap.to(media, {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'clamp(top 100px)',
          end: '+=440',
          scrub: true,
        },
      });
    }
  }, root);

  // The footer wordmark rises out of the page edge (outside <main>).
  const mega = document.querySelector<HTMLElement>('[data-footer-mega]');
  if (mega) {
    context.add(() => {
      gsap.fromTo(
        mega,
        { yPercent: 70 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: mega.parentElement,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.4,
          },
        },
      );
    });
  }

  // Section headings outside a reveal group still get the curtain.
  const standalone = Array.from(
    root.querySelectorAll<HTMLElement>('h2'),
  ).filter((heading) => !heading.closest('[data-reveal]'));
  standalone.forEach((heading) => (heading.dataset.curtain = ''));
  const targets = Array.from(
    root.querySelectorAll<HTMLElement>(
      '[data-reveal], [data-metric], [data-curtain]',
    ),
  );
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.intersectionRatio < 0.15) continue;
        const target = entry.target as HTMLElement;
        observer.unobserve(target);
        if (target.dataset.revealed !== undefined) continue;
        target.dataset.revealed = '';
        const row = target.parentElement?.hasAttribute('data-reveal-grid')
          ? Array.from(target.parentElement.children).filter(
              (sibling) =>
                (sibling as HTMLElement).offsetTop === target.offsetTop,
            )
          : [];
        const delay = Math.max(0, row.indexOf(target)) * 0.12;
        context.add(() => {
          if (target.matches(':focus-within'))
            gsap.set(revealItems(target), { clearProps: 'transform,opacity' });
          else if (target.hasAttribute('data-metric')) countMetric(target);
          else if (target.hasAttribute('data-curtain'))
            revealHeading(target, 0);
          else reveal(target, delay);
        });
      }
    },
    { threshold: 0.15 },
  );
  const belowFold = targets.filter(
    (target) =>
      (target.hasAttribute('data-reveal') ||
        target.hasAttribute('data-curtain')) &&
      target.dataset.revealed === undefined &&
      target.getBoundingClientRect().top >= window.innerHeight,
  );
  context.add(() => {
    belowFold.forEach((target) =>
      gsap.set(revealItems(target), { y: 30, opacity: 0 }),
    );
  });
  targets.forEach((target) => observer.observe(target));

  const stopFx = startPremiumFx(root);

  return () => {
    stopFx();
    observer.disconnect();
    context.revert();
    standalone.forEach((heading) => delete heading.dataset.curtain);
    root
      .querySelectorAll<HTMLElement>('[data-metric-display]')
      .forEach((display) => {
        display.textContent =
          display.closest<HTMLElement>('[data-metric]')?.dataset.metric ?? '';
      });
  };
}

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
 * Which way content arrives: 1 when it comes up from below (reading down
 * the page), -1 when it comes down from above (scrolling back up).
 */
type Side = 1 | -1;

const splits = new WeakMap<HTMLElement, SplitText>();

/**
 * Curtain: each word of a heading moves into place from behind its own mask
 * on the spring, 55 ms after the word before it (the server-rendered
 * headlines in curtain.tsx use the same timing). Reading down, the words
 * rise; scrolling back up, they drop in from above.
 */
function revealHeading(heading: HTMLElement, delay: number, side: Side = 1) {
  splits.get(heading)?.revert();
  gsap.set(heading, { opacity: 1, y: 0 });
  const split = SplitText.create(heading, {
    type: 'words',
    mask: 'words',
    wordsClass: 'fx-word',
  });
  splits.set(heading, split);
  gsap.from(split.words, {
    yPercent: 118 * side,
    duration: 1.3,
    ease: spring,
    stagger: 0.055,
    delay,
    onComplete: () => {
      split.revert();
      splits.delete(heading);
      gsap.set(heading, { clearProps: 'transform,opacity' });
    },
  });
}

/** Hides a heading again once it is out of view, ready to replay. */
function concealHeading(heading: HTMLElement) {
  const split = splits.get(heading);
  if (split) {
    gsap.killTweensOf(split.words);
    split.revert();
    splits.delete(heading);
  }
  gsap.set(heading, { opacity: 0 });
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

function within(target: HTMLElement, selector: string) {
  return Array.from(target.querySelectorAll<HTMLElement>(selector)).concat(
    target.matches(selector) ? [target] : [],
  );
}

/** Puts a reveal group back into its hidden state on the given side. */
function conceal(target: HTMLElement, side: Side) {
  const headings = within(target, 'h2');
  const items = Array.from(revealItems(target)).filter(
    (el) => !headings.includes(el),
  );
  gsap.killTweensOf(items);
  gsap.set(items, { y: 30 * side, opacity: 0 });
  if (target.dataset.reveal === 'pillar') {
    gsap.killTweensOf(target);
    gsap.set(target, { y: 30 * side });
  }
  headings.forEach(concealHeading);
}

function reveal(target: HTMLElement, delay: number, side: Side = 1) {
  const distance = 30 * side;
  if (target.dataset.reveal === 'pillar') {
    gsap.fromTo(
      target,
      { y: distance },
      { y: 0, duration: 0.7, ease: 'expo.out', delay, clearProps: 'transform' },
    );
  }
  const all = Array.from(revealItems(target));
  const headings = within(target, 'h2');
  const items = all.filter((el) => !headings.includes(el));
  headings.forEach((heading) => revealHeading(heading, delay, side));
  within(target, '.eyebrow').forEach((eyebrow) => decode(eyebrow, delay));
  if (items.length)
    gsap.fromTo(
      items,
      { y: distance, opacity: 0 },
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

    // The film aperture opens with scroll and closes again on the way back.
    // It reaches fully open at 82 % of its runway, so the finished frame
    // holds for a moment before the page moves on.
    root.querySelectorAll<HTMLElement>('[data-film]').forEach((film) => {
      gsap.fromTo(
        film,
        { '--open': 0 },
        {
          '--open': 1,
          ease: 'none',
          scrollTrigger: {
            trigger: film,
            start: 'top top',
            end: () =>
              `+=${Math.max(1, (film.offsetHeight - window.innerHeight) * 0.82)}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
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
  ).filter(
    (heading) =>
      !heading.closest('[data-reveal]') &&
      !heading.hasAttribute('data-curtain-skip'),
  );
  standalone.forEach((heading) => (heading.dataset.curtain = ''));
  const targets = Array.from(
    root.querySelectorAll<HTMLElement>(
      '[data-reveal], [data-metric], [data-curtain]',
    ),
  );
  // Reveals play in both directions: content rises in while reading down,
  // drops in from above while scrolling back up, and quietly resets once it
  // has left the screen so it can play again. Metrics count up once.
  const shown = new Set<HTMLElement>();
  // The direction of travel decides the side content arrives from.
  let lastY = window.scrollY;
  let travel: Side = 1;
  const track = () => {
    const y = window.scrollY;
    if (y !== lastY) travel = y > lastY ? 1 : -1;
    lastY = y;
  };
  window.addEventListener('scroll', track, { passive: true });
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        const box = entry.boundingClientRect;
        const height = entry.rootBounds?.height ?? window.innerHeight;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          if (shown.has(target)) continue;
          shown.add(target);
          target.dataset.revealed = '';
          // Straddling an edge says where it came from; otherwise (after a
          // jump) the last scroll direction does.
          const fromAbove = box.top < 0 && box.bottom <= height;
          const fromBelow = box.bottom > height && box.top >= 0;
          const side: Side = fromAbove ? -1 : fromBelow ? 1 : travel;
          const row = target.parentElement?.hasAttribute('data-reveal-grid')
            ? Array.from(target.parentElement.children).filter(
                (sibling) =>
                  (sibling as HTMLElement).offsetTop === target.offsetTop,
              )
            : [];
          const delay = Math.max(0, row.indexOf(target)) * 0.12;
          context.add(() => {
            if (target.matches(':focus-within'))
              gsap.set(revealItems(target), {
                clearProps: 'transform,opacity',
              });
            else if (target.hasAttribute('data-metric')) {
              observer.unobserve(target);
              countMetric(target);
            } else if (target.hasAttribute('data-curtain'))
              revealHeading(target, 0, side);
            else reveal(target, delay, side);
          });
        } else if (!entry.isIntersecting && shown.has(target)) {
          // Never hide what holds keyboard focus.
          if (target.matches(':focus-within')) continue;
          shown.delete(target);
          // Left through the bottom: next time it comes up from below.
          const side: Side = box.top >= height ? 1 : -1;
          context.add(() => {
            if (target.hasAttribute('data-curtain')) concealHeading(target);
            else conceal(target, side);
          });
        }
      }
    },
    { threshold: [0, 0.15] },
  );
  // Anything off screen at the start waits, hidden, on the side it will
  // arrive from.
  const offscreen = targets.filter(
    (target) =>
      (target.hasAttribute('data-reveal') ||
        target.hasAttribute('data-curtain')) &&
      target.dataset.revealed === undefined,
  );
  context.add(() => {
    offscreen.forEach((target) => {
      const box = target.getBoundingClientRect();
      if (box.top >= window.innerHeight)
        gsap.set(revealItems(target), { y: 30, opacity: 0 });
      else if (box.bottom <= 0)
        gsap.set(revealItems(target), { y: -30, opacity: 0 });
    });
  });
  targets.forEach((target) => observer.observe(target));

  const stopFx = startPremiumFx(root);
  // Every scroll scene now exists: a signal for anything (tests included)
  // that should only act once the motion layer is live.
  document.documentElement.dataset.motion = 'ready';

  return () => {
    delete document.documentElement.dataset.motion;
    stopFx();
    window.removeEventListener('scroll', track);
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

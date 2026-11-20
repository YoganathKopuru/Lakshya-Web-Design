import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { startPremiumFx } from './premium-fx';

function revealItems(target: HTMLElement) {
  const parts = target.querySelectorAll<HTMLElement>('[data-reveal-part]');
  return parts.length ? parts : [target];
}

/** Headings rise line by line from behind a mask. */
function revealHeading(heading: HTMLElement, delay: number) {
  gsap.set(heading, { opacity: 1, y: 0 });
  const split = SplitText.create(heading, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'fx-line',
  });
  gsap.from(split.lines, {
    yPercent: 110,
    duration: 1.1,
    ease: 'expo.out',
    stagger: 0.1,
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

  const targets = Array.from(
    root.querySelectorAll<HTMLElement>('[data-reveal], [data-metric]'),
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
          else reveal(target, delay);
        });
      }
    },
    { threshold: 0.15 },
  );
  const belowFold = targets.filter(
    (target) =>
      target.hasAttribute('data-reveal') &&
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
    root
      .querySelectorAll<HTMLElement>('[data-metric-display]')
      .forEach((display) => {
        display.textContent =
          display.closest<HTMLElement>('[data-metric]')?.dataset.metric ?? '';
      });
  };
}

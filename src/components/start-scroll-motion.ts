import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function revealItems(target: HTMLElement) {
  const parts = target.querySelectorAll('[data-reveal-part]');
  return parts.length ? parts : target;
}

function reveal(target: HTMLElement, delay: number) {
  if (target.dataset.reveal === 'pillar') {
    gsap.fromTo(
      target,
      { y: 30 },
      { y: 0, duration: 0.7, ease: 'expo.out', delay, clearProps: 'transform' },
    );
  }
  gsap.fromTo(
    revealItems(target),
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
  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {
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

  return () => {
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

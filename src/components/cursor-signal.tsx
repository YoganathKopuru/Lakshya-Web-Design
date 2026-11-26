'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE =
  'a, button, summary, label, select, [role="button"], [role="tab"], [role="radio"]';
const TEXT_ENTRY =
  'input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"]), textarea, [contenteditable="true"]';

/**
 * The site's cursor, on mouse and pen screens with motion allowed.
 *
 * A small dot sits exactly on the pointer (drawn in "difference" so it reads
 * on night and paper alike); a ring follows a beat behind on a spring and
 * stretches in the direction of travel. Over links and buttons the dot
 * steps aside and the ring opens up; over elements marked data-cursor the
 * ring becomes a pill naming the action ("Explore", "View"); pressing
 * tightens it. In text fields the system text cursor returns. The native
 * arrow is hidden only once this cursor is on screen, and comes back the
 * moment it is not (touch, reduced motion, leaving the window).
 */
export function CursorSignal() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ring.current;
    const point = dot.current;
    const caption = label.current;
    if (!node || !point || !caption) return;
    const root = document.documentElement;
    const preference = matchMedia(
      '(any-pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    let frame = 0;
    let lastTime = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let stretch = 0;
    let angle = 0;
    let labelled = false;
    let current: Element | null = null;

    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      delete node.dataset.active;
      delete node.dataset.hover;
      delete node.dataset.label;
      delete node.dataset.press;
      delete point.dataset.active;
      delete root.dataset.cursorReady;
      labelled = false;
      current = null;
    };

    // Reads what is under the pointer: interactive, labelled or text entry.
    const describe = (target: Element | null) => {
      if (target === current) return;
      current = target;
      const text = target?.closest?.(TEXT_ENTRY);
      const tagged = text
        ? null
        : target?.closest?.<HTMLElement>('[data-cursor]');
      const interactive = text ? null : target?.closest?.(INTERACTIVE);
      if (text) node.dataset.text = '';
      else delete node.dataset.text;
      if (interactive && !tagged) node.dataset.hover = '';
      else delete node.dataset.hover;
      const name = tagged?.dataset.cursor ?? '';
      if (name) {
        if (caption.textContent !== name) caption.textContent = name;
        node.style.setProperty('--pill', `${caption.offsetWidth + 34}px`);
        node.dataset.label = '';
      } else delete node.dataset.label;
      labelled = Boolean(name);
      if (text || interactive || name) point.dataset.hover = '';
      else delete point.dataset.hover;
    };

    const render = (time: number) => {
      const elapsed = lastTime ? Math.min(64, time - lastTime) : 16;
      lastTime = time;
      const blend = 1 - Math.exp(-elapsed / 48);
      const previousX = x;
      const previousY = y;
      x += (targetX - x) * blend;
      y += (targetY - y) * blend;
      const dx = x - previousX;
      const dy = y - previousY;
      const speed = Math.hypot(dx, dy) / elapsed;
      const settled = Math.hypot(targetX - x, targetY - y) < 0.2;
      if (settled) {
        x = targetX;
        y = targetY;
      }
      // Stretch along the direction of travel, easing back when still.
      const wanted = labelled || settled ? 0 : Math.min(0.32, speed * 0.16);
      stretch += (wanted - stretch) * 0.25;
      if (speed > 0.02) angle = Math.atan2(dy, dx);
      if (stretch < 0.003) stretch = 0;
      node.style.transform =
        `translate3d(${x}px, ${y}px, 0)` +
        (stretch
          ? ` rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.55})`
          : '');
      frame = settled && !stretch ? 0 : requestAnimationFrame(render);
      if (!frame) lastTime = 0;
    };

    const follow = (event: PointerEvent) => {
      if (!preference.matches || event.pointerType === 'touch') return;
      targetX = event.clientX;
      targetY = event.clientY;
      point.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      describe(event.target as Element | null);
      if (node.dataset.active === undefined) {
        x = targetX;
        y = targetY;
        node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        node.dataset.active = '';
        point.dataset.active = '';
        root.dataset.cursorReady = '';
      }
      if (!frame) frame = requestAnimationFrame(render);
    };
    // The page can move under a still pointer (wheel, keyboard, links).
    const recheck = () => {
      if (node.dataset.active === undefined) return;
      describe(document.elementFromPoint(targetX, targetY));
    };
    const press = () => {
      if (node.dataset.active !== undefined) node.dataset.press = '';
    };
    const release = () => {
      delete node.dataset.press;
    };
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };

    window.addEventListener('pointermove', follow, { passive: true });
    window.addEventListener('pointerdown', press, { passive: true });
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('pointerout', leave);
    window.addEventListener('scroll', recheck, { passive: true });
    window.addEventListener('blur', hide);
    preference.addEventListener('change', hide);
    return () => {
      hide();
      window.removeEventListener('pointermove', follow);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('scroll', recheck);
      window.removeEventListener('blur', hide);
      preference.removeEventListener('change', hide);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-signal" aria-hidden="true">
        <span className="cursor-ring">
          <span ref={label} className="cursor-label" />
        </span>
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

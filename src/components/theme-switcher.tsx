'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  currentTheme,
  defaultTheme,
  observeTheme,
  themeStorageKey,
  themes,
  type ThemeId,
} from '@/lib/theme';

type Point = { x: number; y: number };

function applyTheme(next: ThemeId) {
  const root = document.documentElement;
  root.dataset.theme = next;
  try {
    localStorage.setItem(themeStorageKey, next);
  } catch {
    // Private windows may refuse storage; the choice still applies now.
  }
  const chrome = themes.find((theme) => theme.id === next)?.chrome;
  if (chrome)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', chrome);
}

/**
 * Two swatches in a pill: Midnight (the signature blend) and Clean (the
 * original light theme). The new theme washes in as a circle that grows from
 * the swatch that was pressed, using the View Transitions API where it
 * exists; elsewhere, and for reduced motion, the change is instant.
 * Keyboard: a radio group, so the arrow keys move between the two.
 */
export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>(defaultTheme);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const active = currentTheme();
    setTheme(active);
    // The head script may run before the theme-color tag exists; sync it.
    const chrome = themes.find((option) => option.id === active)?.chrome;
    if (chrome)
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', chrome);
    return observeTheme(setTheme);
  }, []);

  const choose = (next: ThemeId, origin: Point) => {
    if (next === currentTheme()) return;
    const root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof document.startViewTransition !== 'function' || reduce) {
      applyTheme(next);
      return;
    }
    const { x, y } = origin;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    root.dataset.themeSwitching = '';
    // Some engines can stall a view transition (a busy or hidden page); the
    // theme still has to change, so it applies itself after a short wait.
    let applied = false;
    const apply = () => {
      if (applied) return;
      applied = true;
      window.clearTimeout(safety);
      applyTheme(next);
    };
    const safety = window.setTimeout(apply, 600);
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 820,
            easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => {
        // The theme is already applied if the animation cannot run.
      });
    const done = () => {
      delete root.dataset.themeSwitching;
    };
    transition.finished.then(done, done);
  };

  const centre = (element: HTMLElement): Point => {
    const box = element.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  };

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const step =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const nextIndex = (index + step + themes.length) % themes.length;
    const target = buttons.current[nextIndex];
    if (!target) return;
    target.focus();
    choose(themes[nextIndex].id, centre(target));
  };

  return (
    <div className="theme-switch" role="radiogroup" aria-label="Colour theme">
      <span className="theme-switch-thumb" aria-hidden="true" />
      {themes.map((option, index) => (
        <button
          key={option.id}
          ref={(node) => {
            buttons.current[index] = node;
          }}
          type="button"
          role="radio"
          aria-checked={theme === option.id}
          aria-label={`${option.name} theme`}
          tabIndex={theme === option.id ? 0 : -1}
          className="theme-swatch"
          data-swatch={option.id}
          data-tip={option.name}
          onClick={(event) =>
            choose(
              option.id,
              event.detail === 0
                ? centre(event.currentTarget)
                : { x: event.clientX, y: event.clientY },
            )
          }
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          <span aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

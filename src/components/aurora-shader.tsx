'use client';

import { useEffect, useRef } from 'react';
import { currentTheme, observeTheme, type ThemeId } from '@/lib/theme';
import { isLite, LITE_EVENT } from './motion-governor';

const vertex = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

/* Domain-warped noise (two passes of fractal noise feeding a third) mapped
   onto the logo spectrum. Midnight paints indigo, blue and teal light with
   the night between; Clean paints only the light, as pale veils that never
   darken its blue sky, and keeps them out from behind small text (u_clear:
   up to four boxes, left, top, right, bottom as fractions of the canvas)
   so it always reads. The light lives in a band (u_band: fade in from x to
   y, out from z to w, top to bottom) and gathers a little around the
   pointer. Output is premultiplied alpha over the CSS sky. */
const fragment = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_glow;
uniform float u_clean;
uniform vec4 u_band;
uniform vec4 u_clear[4];

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 turn = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = turn * p;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u_time * 0.045;

  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, -t)));
  vec2 r = vec2(
    fbm(p * 1.5 + 3.2 * q + vec2(1.7, 9.2) + t * 0.7),
    fbm(p * 1.5 + 3.2 * q + vec2(8.3, 2.8) - t * 0.6)
  );
  float f = fbm(p * 1.1 + 2.6 * r);
  float ribbon = smoothstep(0.5, 1.0, length(q));
  float sheen = smoothstep(0.58, 0.98, r.x);

  float depth = 1.0 - uv.y;
  float band = smoothstep(u_band.x, u_band.y, depth) * (1.0 - smoothstep(u_band.z, u_band.w, depth));

  vec2 at = vec2(uv.x, depth);
  float clear = 1.0;
  for (int i = 0; i < 4; i++) {
    vec2 outside = max(max(u_clear[i].xy - at, at - u_clear[i].zw), 0.0);
    clear = min(clear, smoothstep(0.0, 0.1, length(outside * vec2(aspect, 1.0))));
  }

  vec3 night = vec3(0.020, 0.024, 0.059);
  vec3 indigo = vec3(0.180, 0.215, 0.860);
  vec3 blue = vec3(0.184, 0.380, 0.900);
  vec3 teal = vec3(0.122, 0.749, 0.624);
  vec3 colour = mix(night, indigo, smoothstep(0.28, 0.78, f));
  colour = mix(colour, blue, ribbon * 0.45);
  colour = mix(colour, teal, sheen * 0.6);
  float alpha = band * (0.25 + 0.75 * f);

  vec3 periwinkle = vec3(0.560, 0.620, 1.000);
  vec3 sky = vec3(0.520, 0.760, 1.000);
  vec3 mint = vec3(0.620, 0.900, 0.830);
  vec3 veil = mix(periwinkle, sky, ribbon * 0.6);
  veil = mix(veil, mint, sheen * 0.5);
  colour = mix(colour, veil, u_clean);
  alpha = mix(alpha, band * clear * smoothstep(0.38, 0.78, f) * 0.5, u_clean);

  vec2 pointer = vec2(u_pointer.x * aspect, 1.0 - u_pointer.y);
  float light = exp(-dot(p - pointer, p - pointer) * 7.0) * u_glow * mix(1.0, clear, u_clean);
  colour += mix(teal, blue, 0.35) * light * 0.35;
  alpha = clamp(alpha + light * 0.18, 0.0, 1.0);

  float grain = hash(gl_FragCoord.xy + fract(u_time * 7.0) * 91.0) - 0.5;
  colour += grain * 0.03;
  gl_FragColor = vec4(colour * alpha, alpha);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type AuroraPlace = 'hero' | 'card';

/**
 * Where the light sits (u_band above), per theme and place. Midnight's sky
 * is dark throughout, so its light fills a broad middle band. Clean's
 * homepage sky turns light towards the console, so its veils fade out
 * before that; on the hero cards both themes use the middle band.
 */
const BANDS: Record<
  ThemeId,
  Record<AuroraPlace, [number, number, number, number]>
> = {
  midnight: {
    hero: [0.08, 0.42, 0.6, 0.9],
    card: [0.08, 0.42, 0.6, 0.9],
  },
  clean: {
    hero: [0, 0.1, 0.45, 0.62],
    card: [0.08, 0.42, 0.6, 0.9],
  },
};

/** An empty box, far outside the canvas, for unused u_clear slots. */
const NOWHERE = [-9, -9, -9, -9];

/**
 * A living sky: the homepage hero's (place "hero") or an inner-page hero
 * card's ("card"), in the palette of the active theme. It renders only
 * while it is on screen, at a reduced resolution (the image is soft by
 * nature), capped at 30 fps. Reduced motion gets a single still frame.
 * Without WebGL the CSS gradient underneath is the whole sky.
 *
 * `keepClear` selects (within the host section) up to four elements of
 * small text that Clean's pale light stays out from behind, so the copy
 * keeps its contrast wherever the light drifts.
 */
export function AuroraShader({
  className,
  place = 'hero',
  keepClear,
}: {
  className?: string;
  place?: AuroraPlace;
  keepClear?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    // No GPU (software rendering) means no shader: the CSS sky is the
    // whole sky rather than a sky that costs the page its smoothness.
    const gl = element.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl) return;
    // Some browsers still hand out a software renderer here; it draws on the
    // CPU and would slow the whole page, so it gets the CSS sky instead.
    const renderer = (() => {
      const reported = String(gl.getParameter(gl.RENDERER));
      if (!/webkit webgl/i.test(reported)) return reported;
      const debug = gl.getExtension('WEBGL_debug_renderer_info');
      return debug
        ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL))
        : reported;
    })();
    if (
      /swiftshader|llvmpipe|softpipe|software|warp|basic render/i.test(renderer)
    ) {
      element.dataset.off = '';
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, vertex);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uPointer = gl.getUniformLocation(program, 'u_pointer');
    const uGlow = gl.getUniformLocation(program, 'u_glow');
    const uClean = gl.getUniformLocation(program, 'u_clean');
    const uBand = gl.getUniformLocation(program, 'u_band');
    const uClear = gl.getUniformLocation(program, 'u_clear');
    const section = element.closest('section');
    const range = document.createRange();
    const clear = new Float32Array(16);
    let measured = 0;
    // Where the small text sits, as fractions of the canvas (Clean only).
    const measure = () => {
      measured = performance.now();
      for (let slot = 0; slot < 4; slot++) clear.set(NOWHERE, slot * 4);
      if (currentTheme() === 'clean' && keepClear && section) {
        const box = element.getBoundingClientRect();
        Array.from(section.querySelectorAll(keepClear))
          .slice(0, 4)
          .forEach((node, slot) => {
            if (!box.width || !box.height) return;
            range.selectNodeContents(node);
            const text = range.getBoundingClientRect();
            clear.set(
              [
                (text.left - box.left) / box.width,
                (text.top - box.top) / box.height,
                (text.right - box.left) / box.width,
                (text.bottom - box.top) / box.height,
              ],
              slot * 4,
            );
          });
      }
      gl.uniform4fv(uClear, clear);
    };
    // The active theme's palette and placement of the light.
    const look = () => {
      const theme = currentTheme();
      const band = BANDS[theme][place];
      gl.uniform1f(uClean, theme === 'clean' ? 1 : 0);
      gl.uniform4f(uBand, band[0], band[1], band[2], band[3]);
      measure();
    };

    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: 0.5, y: 0.55, tx: 0.5, ty: 0.55, glow: 0, target: 0 };
    const startedAt = performance.now();
    const intervals: number[] = [];
    let frame = 0;
    let last = 0;
    let visible = true;
    let calm = false;

    const resize = () => {
      const box = element.getBoundingClientRect();
      const scale = box.width < 760 ? 0.35 : 0.5;
      element.width = Math.max(1, Math.round(box.width * scale));
      element.height = Math.max(1, Math.round(box.height * scale));
      gl.viewport(0, 0, element.width, element.height);
    };

    const draw = (time: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      pointer.glow += (pointer.target - pointer.glow) * 0.05;
      gl.uniform2f(uRes, element.width, element.height);
      gl.uniform1f(uTime, time / 1000);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uGlow, pointer.glow);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      element.dataset.ready = '';
    };

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (time - last < 33) return;
      // Frame budget: once the page has settled, a device that cannot hold
      // ~16 fps across a dozen frames keeps a still sky instead.
      if (last && time - startedAt > 1000) {
        intervals.push(time - last);
        if (intervals.length > 12) intervals.shift();
        const average =
          intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
        if (intervals.length === 12 && average > 60) {
          calm = true;
          element.dataset.calm = '';
          cancelAnimationFrame(frame);
          frame = 0;
          last = 0;
          draw(52000);
          return;
        }
      }
      last = time;
      // Text moves under the light (scroll scenes, late fonts): follow it.
      if (time - measured > 500) measure();
      draw(time - startedAt + 40000);
    };

    const active = () => visible && !document.hidden;

    // Cost probe, once: render a warm-up frame (shader compilation happens
    // here), then time a few frames. Reading back one pixel makes the
    // browser finish each frame before the clock stops (gl.finish() may
    // return early). A device that needs over 14 ms a frame keeps a still
    // sky; over 40 ms (software rendering) it keeps the CSS sky alone.
    let probed = false;
    const pixel = new Uint8Array(4);
    const settle = () =>
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    const timed = (work: () => void) => {
      let best = Infinity;
      for (let i = 0; i < 3; i++) {
        const began = performance.now();
        work();
        best = Math.min(best, performance.now() - began);
      }
      return best;
    };
    const probe = () => {
      probed = true;
      gl.uniform2f(uRes, element.width, element.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      settle();
      // The cost of a frame is its draw-and-read time less the bare read
      // (the fixed price of waiting for the GPU at all).
      const read = timed(settle);
      const frame = timed(() => {
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        settle();
      });
      const cost = Math.max(0, frame - read);
      // Software-slow: drop the canvas entirely and let the CSS sky show.
      if (cost > 40) element.dataset.off = '';
      else if (cost > 14) calm = true;
      if (calm) element.dataset.calm = '';
    };

    const start = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      intervals.length = 0;
      // Lite mode (motion-governor.tsx): the CSS sky is the whole sky.
      if (isLite()) element.dataset.off = '';
      if (!active() || element.dataset.off !== undefined) return;
      look();
      if (!probed && !still.matches) probe();
      if (element.dataset.off !== undefined) return;
      if (still.matches || calm) {
        draw(52000);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const box = element.getBoundingClientRect();
      pointer.tx = (event.clientX - box.left) / box.width;
      pointer.ty = (event.clientY - box.top) / box.height;
      pointer.target = 1;
    };
    const leave = () => {
      pointer.target = 0;
    };

    const sizeObserver = new ResizeObserver(() => {
      resize();
      if (still.matches) start();
    });
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    resize();
    sizeObserver.observe(element);
    viewObserver.observe(element);
    section?.addEventListener('pointermove', move, { passive: true });
    section?.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', start);
    still.addEventListener('change', start);
    const stopTheme = observeTheme(start);
    window.addEventListener(LITE_EVENT, start);
    start();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(LITE_EVENT, start);
      stopTheme();
      sizeObserver.disconnect();
      viewObserver.disconnect();
      section?.removeEventListener('pointermove', move);
      section?.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', start);
      still.removeEventListener('change', start);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      // Free the GPU context once the canvas has really left the page (a
      // development re-mount keeps the same canvas, which must stay usable).
      setTimeout(() => {
        if (!element.isConnected)
          gl.getExtension('WEBGL_lose_context')?.loseContext();
      }, 0);
    };
  }, [place, keepClear]);

  return <canvas ref={canvas} className={className} aria-hidden="true" />;
}

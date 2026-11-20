'use client';

import { useEffect, useRef } from 'react';

/**
 * A field of mint particles rolling in slow waves under an emerald haze.
 * Written from scratch in plain WebGL (no Three.js) so it adds ~3 kB. It only
 * animates while on screen and the tab is visible, draws one still frame for
 * reduced motion, and leaves the CSS haze behind if WebGL is unavailable.
 */
const VERTEX = `
attribute vec2 a_grid;
uniform float u_time;
uniform float u_aspect;
uniform vec2 u_sway;
uniform float u_dpr;
varying float v_light;

float wave(vec2 p, float t) {
  return 0.55 * sin(p.x * 0.42 + t * 0.55) * cos(p.y * 0.33 + t * 0.38)
       + 0.28 * sin((p.x + p.y) * 0.78 - t * 0.8)
       + 0.12 * sin(p.x * 1.6 - p.y * 1.25 + t * 1.3);
}

void main() {
  vec2 ground = vec2((a_grid.x - 0.5) * 18.0, -a_grid.y * 13.0 - 0.6);
  float h = wave(ground, u_time);
  vec3 p = vec3(ground.x + u_sway.x * 0.6, h, ground.y);
  p.y -= 1.75 + u_sway.y * 0.25;
  float pitch = 0.1;
  float c = cos(pitch);
  float s = sin(pitch);
  p = vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
  float depth = -p.z;
  float focal = 1.55;
  gl_Position = vec4(p.x * focal / u_aspect, p.y * focal, 0.0, depth);
  float crest = smoothstep(-0.45, 0.85, h);
  float fog = 1.0 - smoothstep(4.0, 13.5, depth);
  v_light = fog * (0.28 + 0.72 * crest);
  gl_PointSize = u_dpr * clamp((1.3 + crest * 2.1) * (5.0 / depth), 0.8, 7.0);
}`;

const FRAGMENT = `
precision mediump float;
varying float v_light;
uniform vec3 u_color;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * v_light;
  vec3 tint = mix(u_color, vec3(1.0), v_light * 0.35);
  gl_FragColor = vec4(tint * a, a);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export function FlowField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: 'low-power',
    });
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const narrow = matchMedia('(max-width: 760px)').matches;
    const cols = narrow ? 110 : 190;
    const rows = narrow ? 52 : 80;
    const grid = new Float32Array(cols * rows * 2);
    for (let y = 0, i = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        grid[i++] = x / (cols - 1);
        grid[i++] = y / (rows - 1);
      }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW);
    const attribute = gl.getAttribLocation(program, 'a_grid');
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uTime = u('u_time');
    const uAspect = u('u_aspect');
    const uSway = u('u_sway');
    const uDpr = u('u_dpr');
    gl.uniform3f(u('u_color'), 0.5, 0.92, 0.76);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 0);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uAspect, width / Math.max(height, 1));
      gl.uniform1f(uDpr, dpr);
    };

    const sway = { x: 0, y: 0, tx: 0, ty: 0 };
    const draw = (time: number) => {
      sway.x += (sway.tx - sway.x) * 0.04;
      sway.y += (sway.ty - sway.y) * 0.04;
      gl.uniform1f(uTime, time);
      gl.uniform2f(uSway, sway.x, sway.y);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, cols * rows);
    };

    const still = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = false;
    let origin = 0;
    const loop = (now: number) => {
      if (!origin) origin = now;
      draw(8 + (now - origin) / 1000);
      frame = requestAnimationFrame(loop);
    };
    // Software rasterisers (no GPU) get one still frame instead of a loop
    // that would compete with scrolling for the main thread.
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(
      gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? '',
    );
    const software =
      /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (software || still.matches || !visible || document.hidden) {
        draw(8);
        return;
      }
      frame = requestAnimationFrame(loop);
    };
    const pointer = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      sway.tx = ((event.clientX - box.left) / box.width - 0.5) * 2;
      sway.ty = ((event.clientY - box.top) / box.height - 0.5) * 2;
    };

    resize();
    const sizes = new ResizeObserver(() => {
      resize();
      if (!frame) draw(8);
    });
    sizes.observe(canvas);
    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    view.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    still.addEventListener('change', sync);
    canvas.parentElement?.addEventListener('pointermove', pointer, {
      passive: true,
    });
    canvas.dataset.ready = '';

    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect();
      view.disconnect();
      document.removeEventListener('visibilitychange', sync);
      still.removeEventListener('change', sync);
      canvas.parentElement?.removeEventListener('pointermove', pointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      delete canvas.dataset.ready;
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

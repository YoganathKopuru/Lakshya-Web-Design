const vertexSource = `
  attribute vec2 position;
  varying vec2 point;

  void main() {
    point = position;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Project the front hemisphere into the hero. Rotating longitude moves the
// map across the surface while the silhouette, light and atmosphere stay put.
const fragmentSource = `
  precision mediump float;
  uniform sampler2D earth;
  uniform float longitude;
  varying vec2 point;

  void main() {
    const float pi = 3.14159265;
    vec2 p = point / 0.93;
    float radius = length(p);
    if (radius > 1.0) discard;

    float z = sqrt(max(0.0, 1.0 - dot(p, p)));
    vec3 normal = vec3(p, z);
    vec3 tilted = vec3(p.x, 0.94 * p.y + 0.34 * z, 0.94 * z - 0.34 * p.y);
    float lon = atan(tilted.x, tilted.z) + longitude;
    float lat = asin(clamp(tilted.y, -1.0, 1.0));
    vec2 uv = vec2(fract(0.5 + lon / (2.0 * pi)), 0.5 - lat / pi);
    vec3 surface = texture2D(earth, uv).rgb;
    float key = max(0.0, dot(normal, normalize(vec3(-0.28, 0.62, 0.78))));
    vec3 ocean = vec3(0.025, 0.073, 0.12) * (0.4 + 0.6 * key);
    vec3 lights = surface * vec3(0.88, 1.12, 1.22) * (0.6 + 0.62 * key);
    vec3 halo = vec3(0.06, 0.38, 0.45) * pow(1.0 - z, 3.0) * (0.3 + 0.7 * key);
    float edge = 1.0 - smoothstep(0.995, 1.0, radius);
    gl_FragColor = vec4((ocean + lights + halo) * edge, edge);
  }
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

export function mountEarthGlobe(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('webgl', {
    antialias: false,
    depth: false,
  });
  if (!context) return;
  const gl = context;

  const program = gl.createProgram();
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (program && vertex && fragment) {
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
  }
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return;
  }

  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  if (!buffer || !texture) {
    gl.deleteBuffer(buffer);
    gl.deleteTexture(texture);
    gl.deleteProgram(program);
    return;
  }

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const rotation = gl.getUniformLocation(program, 'longitude');
  gl.uniform1i(gl.getUniformLocation(program, 'earth'), 0);

  const image = new Image();
  let ready = false;
  let angle = 1.42;
  function draw(nextAngle = angle) {
    angle = nextAngle;
    if (!ready) return;

    gl.uniform1f(rotation, angle);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.dataset.globeReady = '';
  }

  function resize() {
    const size = Math.max(
      1,
      Math.round(canvas.clientWidth * Math.min(devicePixelRatio, 1.5)),
    );
    if (canvas.width === size && canvas.height === size) return;
    canvas.width = size;
    canvas.height = size;
    gl.viewport(0, 0, size, size);
    draw();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  image.onload = () => {
    if (gl.isContextLost()) return;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    ready = gl.getError() === gl.NO_ERROR;
    draw();
  };
  // NASA Earth Observatory, Black Marble 2016 (global night lights).
  image.src = '/earth-black-marble.webp';
  const showFallback = () => {
    ready = false;
    delete canvas.dataset.globeReady;
  };
  canvas.addEventListener('webglcontextlost', showFallback);

  return {
    draw,
    dispose() {
      observer.disconnect();
      image.onload = null;
      canvas.removeEventListener('webglcontextlost', showFallback);
      showFallback();
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

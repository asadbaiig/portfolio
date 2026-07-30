import { Effect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MAX_CLICKS = 10;
const SHAPE_MAP = { square: 0, circle: 1, triangle: 2, diamond: 3 };

const createTouchTexture = () => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const trail = [];
  let last = null;
  let radius = 0.1 * size;
  const maxAge = 64;
  const speed = 1 / maxAge;

  const clear = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, size, size);
  };

  const drawPoint = point => {
    const pos = { x: point.x * size, y: (1 - point.y) * size };
    const inAge = maxAge * 0.3;
    let intensity = point.age < inAge
      ? Math.sin((point.age / inAge) * Math.PI / 2)
      : -(1 - (point.age - inAge) / (maxAge - inAge)) * ((1 - (point.age - inAge) / (maxAge - inAge)) - 2);
    intensity = Math.max(0, intensity) * point.force;
    const color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = size * 5;
    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;
    ctx.shadowBlur = radius;
    ctx.shadowColor = `rgba(${color},${0.22 * intensity})`;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,0,0,1)';
    ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  return {
    texture,
    addTouch(norm) {
      let force = 0;
      let vx = 0;
      let vy = 0;
      if (last) {
        const dx = norm.x - last.x;
        const dy = norm.y - last.y;
        if (dx === 0 && dy === 0) return;
        const d = Math.hypot(dx, dy) || 1;
        vx = dx / d;
        vy = dy / d;
        force = Math.min((dx * dx + dy * dy) * 10000, 1);
      }
      last = { x: norm.x, y: norm.y };
      trail.push({ x: norm.x, y: norm.y, age: 0, force, vx, vy });
    },
    update() {
      clear();
      for (let i = trail.length - 1; i >= 0; i -= 1) {
        const point = trail[i];
        const f = point.force * speed * (1 - point.age / maxAge);
        point.x += point.vx * f;
        point.y += point.vy * f;
        point.age += 1;
        if (point.age > maxAge) trail.splice(i, 1);
      }
      trail.forEach(drawPoint);
      texture.needsUpdate = true;
    },
    set radiusScale(value) {
      radius = 0.1 * size * value;
    }
  };
};

const createLiquidEffect = (texture, opts) => new Effect('LiquidEffect', `
  uniform sampler2D uTexture;
  uniform float uStrength;
  uniform float uTime;
  uniform float uFreq;

  void mainUv(inout vec2 uv) {
    vec4 tex = texture2D(uTexture, uv);
    float vx = tex.r * 2.0 - 1.0;
    float vy = tex.g * 2.0 - 1.0;
    float intensity = tex.b;
    float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);
    uv += vec2(vx, vy) * uStrength * intensity * wave;
  }
`, {
  uniforms: new Map([
    ['uTexture', new THREE.Uniform(texture)],
    ['uStrength', new THREE.Uniform(opts.strength)],
    ['uTime', new THREE.Uniform(0)],
    ['uFreq', new THREE.Uniform(opts.freq)]
  ])
});

const VERTEX_SRC = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;
uniform int uShapeType;

const int MAX_CLICKS = 10;
const int SHAPE_SQUARE = 0;
const int SHAPE_CIRCLE = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND = 3;

uniform vec2 uClickPos[MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2.0 + a.y * a.y * 0.75);
}
#define Bayer4(a) (Bayer2(0.5 * (a)) * 0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(0.5 * (a)) * 0.25 + Bayer2(a))

float hash11(float n) { return fract(sin(n) * 43758.5453); }

float vnoise(vec3 p) {
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp * fp * fp * (fp * (fp * 6.0 - 15.0) + 10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  return mix(mix(x00, x10, w.y), mix(x01, x11, w.y), w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t) {
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < 5; ++i) {
    sum += amp * vnoise(p * freq);
    freq *= 1.25;
    amp *= 1.0;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov) {
  float r = sqrt(cov) * 0.25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov) {
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d = p.y - r * (1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d / aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov) {
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy - uResolution * 0.5;
  float aspectRatio = uResolution.x / uResolution.y;
  vec2 pixelId = floor(fragCoord / uPixelSize);
  vec2 pixelUV = fract(fragCoord / uPixelSize);
  float cellPixelSize = 8.0 * uPixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;
  float feed = base + (uDensity - 0.5) * 0.3;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i) {
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      vec2 cuv = (((pos - uResolution * 0.5 - cellPixelSize * 0.5) / uResolution)) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float ring = exp(-pow((r - uRippleSpeed * t) / uRippleThickness, 2.0));
      float atten = exp(-1.0 * t) * exp(-10.0 * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);
  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float coverage = bw * (1.0 + (h - 0.5) * uPixelJitter);

  float mask;
  if (uShapeType == SHAPE_CIRCLE) mask = maskCircle(pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) mask = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND) mask = maskDiamond(pixelUV, coverage);
  else mask = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    mask *= smoothstep(0.0, uEdgeFade, edge);
  }

  vec3 srgbColor = mix(
    uColor * 12.92,
    1.055 * pow(uColor, vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, uColor)
  );
  fragColor = vec4(srgbColor, mask);
}
`;

export default function PixelBlast({
  variant = 'circle',
  pixelSize = 6,
  color = '#00ff88',
  patternScale = 3,
  patternDensity = 1.15,
  pixelSizeJitter = 0.45,
  enableRipples = true,
  rippleSpeed = 0.4,
  rippleThickness = 0.12,
  rippleIntensityScale = 1.5,
  liquid = true,
  liquidStrength = 0.12,
  liquidRadius = 1.2,
  liquidWobbleSpeed = 5,
  speed = 0.6,
  edgeFade = 0.2,
  transparent = true,
  className = '',
  style
}) {
  const containerRef = useRef(null);
  const threeRef = useRef(null);
  const visibilityRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.setClearAlpha(transparent ? 0 : 1);
    container.appendChild(renderer.domElement);

    const uniforms = {
      uResolution: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uClickPos: { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
      uClickTimes: { value: new Float32Array(MAX_CLICKS) },
      uShapeType: { value: SHAPE_MAP[variant] ?? 1 },
      uPixelSize: { value: pixelSize * renderer.getPixelRatio() },
      uScale: { value: patternScale },
      uDensity: { value: patternDensity },
      uPixelJitter: { value: pixelSizeJitter },
      uEnableRipples: { value: enableRipples ? 1 : 0 },
      uRippleSpeed: { value: rippleSpeed },
      uRippleThickness: { value: rippleThickness },
      uRippleIntensity: { value: rippleIntensityScale },
      uEdgeFade: { value: edgeFade }
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SRC,
      fragmentShader: FRAGMENT_SRC,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      glslVersion: THREE.GLSL3
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const touch = liquid ? createTouchTexture() : null;
    let composer = null;
    let liquidEffect = null;
    if (liquid && touch) {
      touch.radiusScale = liquidRadius;
      composer = new EffectComposer(renderer);
      liquidEffect = createLiquidEffect(touch.texture, { strength: liquidStrength, freq: liquidWobbleSpeed });
      const renderPass = new RenderPass(scene, camera);
      const effectPass = new EffectPass(camera, liquidEffect);
      effectPass.renderToScreen = true;
      composer.addPass(renderPass);
      composer.addPass(effectPass);
    }

    const setSize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
      uniforms.uPixelSize.value = pixelSize * renderer.getPixelRatio();
      if (composer) composer.setSize(renderer.domElement.width, renderer.domElement.height);
    };

    const mapToPixels = e => {
      const rect = renderer.domElement.getBoundingClientRect();
      const scaleX = renderer.domElement.width / rect.width;
      const scaleY = renderer.domElement.height / rect.height;
      return {
        fx: (e.clientX - rect.left) * scaleX,
        fy: (rect.height - (e.clientY - rect.top)) * scaleY,
        w: renderer.domElement.width,
        h: renderer.domElement.height
      };
    };

    let clickIx = 0;
    const onPointerDown = e => {
      const { fx, fy } = mapToPixels(e);
      uniforms.uClickPos.value[clickIx].set(fx, fy);
      uniforms.uClickTimes.value[clickIx] = uniforms.uTime.value;
      clickIx = (clickIx + 1) % MAX_CLICKS;
    };

    let pendingPointer = null;
    const onPointerMove = e => {
      if (!touch) return;
      pendingPointer = { x: e.clientX, y: e.clientY };
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    const clock = new THREE.Clock();
    let raf = 0;
    const timeOffset = Math.random() * 1000;
    const animate = () => {
      if (visibilityRef.current) {
        uniforms.uTime.value = timeOffset + clock.getElapsedTime() * speed;
        if (liquidEffect) liquidEffect.uniforms.get('uTime').value = uniforms.uTime.value;
        if (composer) {
          if (touch && pendingPointer) {
            const { fx, fy, w, h } = mapToPixels(pendingPointer);
            touch.addTouch({ x: fx / w, y: fy / h });
            pendingPointer = null;
          }
          touch.update();
          composer.render();
        } else {
          renderer.render(scene, camera);
        }
      }
      raf = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visibilityRef.current = entry.isIntersecting;
    });
    observer.observe(container);

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    raf = requestAnimationFrame(animate);
    threeRef.current = { renderer, material, quad, composer, ro, observer, raf };

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      observer.disconnect();
      cancelAnimationFrame(raf);
      quad.geometry.dispose();
      material.dispose();
      composer?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
      threeRef.current = null;
    };
  }, [color, edgeFade, enableRipples, liquid, liquidRadius, liquidStrength, liquidWobbleSpeed, patternDensity, patternScale, pixelSize, pixelSizeJitter, rippleIntensityScale, rippleSpeed, rippleThickness, speed, transparent, variant]);

  return <div ref={containerRef} className={`pixel-blast-container ${className}`} style={style} aria-hidden="true" />;
}

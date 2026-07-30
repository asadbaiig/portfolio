import { BloomEffect, ChromaticAberrationEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 uSkew;
uniform float uLineThickness;
uniform vec3 uLinesColor;
uniform vec3 uScanColor;
uniform float uGridScale;
uniform float uLineJitter;
uniform float uScanOpacity;
uniform float uScanGlow;
uniform float uScanSoftness;
uniform float uScanDuration;
uniform float uScanDelay;
uniform float uNoise;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    value += noise(p) * amp;
    p *= 2.0;
    amp *= 0.5;
  }
  return value;
}

void main() {
  vec2 fragCoord = vUv * iResolution.xy;
  vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  p += uSkew * 0.35;

  float perspective = 1.0 + p.y * 0.42;
  vec2 gridUv = vec2(p.x / max(0.25, perspective), p.y + iTime * 0.08) / max(0.001, uGridScale);

  float jitter = uLineJitter * 0.12;
  gridUv += vec2(
    sin(gridUv.y * 0.9 + iTime * 1.7),
    cos(gridUv.x * 0.8 - iTime * 1.4)
  ) * jitter;

  vec2 cell = abs(fract(gridUv) - 0.5);
  vec2 fw = fwidth(gridUv);
  float thickness = max(0.35, uLineThickness) * 0.018;
  float lineX = 1.0 - smoothstep(thickness, thickness + fw.x * 1.4, cell.x);
  float lineY = 1.0 - smoothstep(thickness, thickness + fw.y * 1.4, cell.y);
  float line = max(lineX, lineY);

  float depthFade = smoothstep(1.35, -0.55, p.y) * (1.0 - smoothstep(1.1, 1.85, abs(p.x)));
  float haze = fbm(gridUv * 0.12 + iTime * 0.04) * 0.12;

  float cycle = max(0.1, uScanDuration + uScanDelay);
  float phase = clamp((mod(iTime, cycle) - uScanDelay) / max(0.1, uScanDuration), 0.0, 1.0);
  phase = phase < 0.5 ? phase * 2.0 : 1.0 - (phase - 0.5) * 2.0;
  float scanY = mix(-1.15, 1.15, phase);
  float bandWidth = max(0.025, 0.09 * uScanSoftness);
  float scan = exp(-pow((p.y - scanY) / bandWidth, 2.0)) * uScanOpacity;
  float glow = exp(-pow((p.y - scanY) / (bandWidth * max(1.0, uScanGlow * 4.0)), 2.0)) * uScanOpacity * 0.35;

  vec3 color = uLinesColor * line * depthFade;
  color += uScanColor * (scan * max(line, 0.25) + glow);
  color += uLinesColor * haze * depthFade;

  float grain = hash(fragCoord + iTime * 60.0) - 0.5;
  color += grain * uNoise;

  float vignette = smoothstep(1.55, 0.25, length(p));
  float alpha = clamp(max(line * depthFade, scan + glow) * vignette, 0.0, 1.0);
  fragColor = vec4(clamp(color, 0.0, 1.0), alpha);
}
`;

function srgbColor(hex) {
  return new THREE.Color(hex).convertSRGBToLinear();
}

export default function GridScan({
  sensitivity = 0.55,
  lineThickness = 1,
  linesColor = '#00ff88',
  gridScale = 0.12,
  lineJitter = 0.1,
  scanColor = '#ff0066',
  scanOpacity = 0.44,
  scanGlow = 0.7,
  scanSoftness = 1.6,
  scanDuration = 2.2,
  scanDelay = 1.2,
  enablePost = true,
  bloomIntensity = 0.45,
  bloomThreshold = 0.05,
  bloomSmoothing = 0.35,
  chromaticAberration = 0.0015,
  noiseIntensity = 0.015,
  className = '',
  style
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const uniforms = {
      iResolution: { value: new THREE.Vector3(1, 1, renderer.getPixelRatio()) },
      iTime: { value: 0 },
      uSkew: { value: new THREE.Vector2(0, 0) },
      uLineThickness: { value: lineThickness },
      uLinesColor: { value: srgbColor(linesColor) },
      uScanColor: { value: srgbColor(scanColor) },
      uGridScale: { value: gridScale },
      uLineJitter: { value: lineJitter },
      uScanOpacity: { value: scanOpacity },
      uScanGlow: { value: scanGlow },
      uScanSoftness: { value: scanSoftness },
      uScanDuration: { value: scanDuration },
      uScanDelay: { value: scanDelay },
      uNoise: { value: noiseIntensity }
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    let composer = null;
    if (enablePost) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new BloomEffect({ intensity: 1, luminanceThreshold: bloomThreshold, luminanceSmoothing: bloomSmoothing });
      bloom.blendMode.opacity.value = bloomIntensity;
      const chroma = new ChromaticAberrationEffect({ offset: new THREE.Vector2(chromaticAberration, chromaticAberration) });
      const pass = new EffectPass(camera, bloom, chroma);
      pass.renderToScreen = true;
      composer.addPass(pass);
    }

    const pointer = new THREE.Vector2(0, 0);
    const current = new THREE.Vector2(0, 0);
    const onPointerMove = e => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onPointerLeave = () => pointer.set(0, 0);

    const resize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height, renderer.getPixelRatio());
      composer?.setSize(renderer.domElement.width, renderer.domElement.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    resize();

    let raf = 0;
    const start = performance.now();
    const response = THREE.MathUtils.lerp(0.04, 0.16, THREE.MathUtils.clamp(sensitivity, 0, 1));
    const animate = () => {
      current.lerp(pointer, response);
      uniforms.uSkew.value.copy(current);
      uniforms.iTime.value = (performance.now() - start) / 1000;
      if (composer) composer.render();
      else renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      composer?.dispose();
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
    };
  }, [bloomIntensity, bloomSmoothing, bloomThreshold, chromaticAberration, enablePost, gridScale, lineJitter, lineThickness, linesColor, noiseIntensity, scanColor, scanDelay, scanDuration, scanGlow, scanOpacity, scanSoftness, sensitivity]);

  return <div ref={containerRef} className={`gridscan-background ${className}`} style={style} aria-hidden="true" />;
}

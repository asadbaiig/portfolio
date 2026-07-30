import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uEnableWaves;

void main() {
  vUv = uv;
  float time = uTime * 5.0;
  vec3 transformed = position;
  transformed.x += sin(time + position.y) * 0.42 * uEnableWaves;
  transformed.y += cos(time + position.z) * 0.14 * uEnableWaves;
  transformed.z += sin(time + position.x) * 0.75 * uEnableWaves;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
  float time = uTime;
  vec2 pos = vUv;
  float r = texture2D(uTexture, pos + cos(time + pos.x) * 0.008).r;
  float g = texture2D(uTexture, pos + sin(time * 0.7 + pos.y) * 0.008).g;
  float b = texture2D(uTexture, pos - cos(time * 1.3 + pos.y) * 0.008).b;
  float a = texture2D(uTexture, pos).a;
  gl_FragColor = vec4(r, g, b, a);
}
`;

const charset = ' .:-=+*#%@';

class CanvasText {
  constructor(text, { fontSize, fontFamily, color }) {
    this.text = text;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  resize() {
    this.ctx.font = `700 ${this.fontSize}px ${this.fontFamily}`;
    const metrics = this.ctx.measureText(this.text);
    this.canvas.width = Math.ceil(metrics.width) + 32;
    this.canvas.height = Math.ceil(this.fontSize * 1.2);
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = `700 ${this.fontSize}px ${this.fontFamily}`;
    this.ctx.fillStyle = this.color;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.text, 16, this.canvas.height / 2);
  }
}

class AsciiRenderer {
  constructor(renderer, container, { fontSize }) {
    this.renderer = renderer;
    this.container = container;
    this.fontSize = fontSize;
    this.domElement = document.createElement('div');
    this.domElement.className = 'ascii-text-filter';
    this.pre = document.createElement('pre');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.domElement.appendChild(this.pre);
    this.domElement.appendChild(this.canvas);
    this.mouse = { x: 0, y: 0 };
    this.center = { x: 0, y: 0 };
    this.hue = 0;
    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener('mousemove', this.onMouseMove, { passive: true });
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.ctx.font = `${this.fontSize}px IBM Plex Mono, SF Mono, monospace`;
    const charWidth = Math.max(1, this.ctx.measureText('A').width);
    this.cols = Math.max(1, Math.floor(width / charWidth));
    this.rows = Math.max(1, Math.floor(height / this.fontSize));
    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { ...this.center };
  }

  onMouseMove(event) {
    this.mouse = { x: event.clientX, y: event.clientY };
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.renderer.domElement, 0, 0, this.canvas.width, this.canvas.height);
    const data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    let output = '';
    for (let y = 0; y < this.canvas.height; y += 1) {
      for (let x = 0; x < this.canvas.width; x += 1) {
        const i = (x + y * this.canvas.width) * 4;
        const alpha = data[i + 3];
        if (alpha < 8) {
          output += ' ';
          continue;
        }
        const gray = (data[i] * 0.3 + data[i + 1] * 0.6 + data[i + 2] * 0.1) / 255;
        output += charset[Math.min(charset.length - 1, Math.floor(gray * (charset.length - 1)))] ?? ' ';
      }
      output += '\n';
    }
    this.pre.textContent = output;
    const deg = Math.atan2(this.mouse.y - this.center.y, this.mouse.x - this.center.x) * 180 / Math.PI;
    this.hue += (deg - this.hue) * 0.05;
    this.domElement.style.filter = `hue-rotate(${this.hue.toFixed(1)}deg)`;
  }

  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}

export default function ASCIIText({
  text = 'ASAD_BAIG',
  enableWaves = true,
  asciiFontSize = 8,
  textFontSize = 190,
  textColor = '#fdf9f3',
  planeBaseHeight = 8
}) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let raf = 0;
    let disposed = false;
    let resizeObserver = null;

    const setup = async () => {
      await document.fonts?.ready;
      if (disposed) return;

      const rect = container.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setPixelRatio(1);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
      camera.position.z = 30;

      const textCanvas = new CanvasText(text, {
        fontSize: textFontSize,
        fontFamily: 'IBM Plex Mono, SF Mono, Monaco, monospace',
        color: textColor
      });
      textCanvas.resize();
      textCanvas.render();

      const texture = new THREE.CanvasTexture(textCanvas.canvas);
      texture.minFilter = THREE.NearestFilter;
      const aspect = textCanvas.canvas.width / textCanvas.canvas.height;
      const geometry = new THREE.PlaneGeometry(planeBaseHeight * aspect, planeBaseHeight, 36, 36);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: texture },
          uEnableWaves: { value: enableWaves ? 1 : 0 }
        }
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const filter = new AsciiRenderer(renderer, container, { fontSize: asciiFontSize });
      container.appendChild(filter.domElement);
      filter.setSize(width, height);

      const setSize = () => {
        const next = container.getBoundingClientRect();
        const w = Math.max(1, next.width);
        const h = Math.max(1, next.height);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        filter.setSize(w, h);
      };

      resizeObserver = new ResizeObserver(setSize);
      resizeObserver.observe(container);

      const animate = () => {
        const time = performance.now() * 0.001;
        material.uniforms.uTime.value = Math.sin(time);
        textCanvas.render();
        texture.needsUpdate = true;
        mesh.rotation.x += (((filter.mouse.y / filter.height) - 0.5) * -0.55 - mesh.rotation.x) * 0.045;
        mesh.rotation.y += (((filter.mouse.x / filter.width) - 0.5) * 0.55 - mesh.rotation.y) * 0.045;
        filter.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };

      instanceRef.current = { renderer, scene, geometry, material, texture, filter };
      animate();
    };

    setup();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      const instance = instanceRef.current;
      if (instance) {
        instance.filter.dispose();
        instance.geometry.dispose();
        instance.material.dispose();
        instance.texture.dispose();
        instance.renderer.dispose();
        instance.renderer.forceContextLoss();
        if (instance.filter.domElement.parentNode === container) container.removeChild(instance.filter.domElement);
      }
      instanceRef.current = null;
    };
  }, [asciiFontSize, enableWaves, planeBaseHeight, text, textColor, textFontSize]);

  return <div ref={containerRef} className="ascii-text-container" aria-hidden="true" />;
}

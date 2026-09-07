import { useEffect, useRef } from 'react';
export default function Sculpture({ animated }) {
  const host = useRef(null);
  useEffect(() => {
    let cancelled = false, cleanup;
    import('three').then(THREE => {
      if (cancelled) return;
      const el = host.current;
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
      camera.position.z = 8;
      const group = new THREE.Group();
      scene.add(group);
      const geometry = new THREE.TorusKnotGeometry(1.28, .38, 180, 32, 2, 3);
      const material = new THREE.MeshPhysicalMaterial({ color: '#9b83ee', metalness: .72, roughness: .24, clearcoat: 1 });
      const knot = new THREE.Mesh(geometry, material);
      group.add(knot);
      group.rotation.set(.3, -.5, -.25);
      scene.add(new THREE.AmbientLight('#b9a8ff', 2.4));
      const lights = [[0xffffff, 55, 3, 4, 4], [0x7c4dff, 65, -4, -1, 2], [0x91d8ff, 45, 1, -3, -1]];
      lights.forEach(([color, intensity, x, y, z]) => { const light = new THREE.PointLight(color, intensity); light.position.set(x,y,z); scene.add(light); });
      const resize = () => { renderer.setSize(el.clientWidth, el.clientHeight); camera.aspect = el.clientWidth / el.clientHeight; camera.updateProjectionMatrix(); renderer.render(scene, camera); };
      const observer = new ResizeObserver(resize); observer.observe(el); resize();
      let visible = true;
      const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }); intersection.observe(el);
      let targetX = 0, targetY = 0;
      const pointer = e => { const r = el.getBoundingClientRect(); targetY = ((e.clientX-r.left)/r.width-.5)*.6; targetX = ((e.clientY-r.top)/r.height-.5)*.4; };
      const reset = () => { targetX = 0; targetY = 0; };
      el.addEventListener('pointermove', pointer); el.addEventListener('pointerleave', reset);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      renderer.setAnimationLoop(() => { if (!visible || document.hidden || !animated || reduced.matches) return; knot.rotation.y += .003; group.rotation.x += (.3+targetX-group.rotation.x)*.04; group.rotation.y += (-.5+targetY-group.rotation.y)*.04; renderer.render(scene, camera); });
      cleanup = () => { renderer.setAnimationLoop(null); observer.disconnect(); intersection.disconnect(); el.removeEventListener('pointermove', pointer); el.removeEventListener('pointerleave', reset); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); };
    }).catch(() => {});
    return () => { cancelled = true; cleanup?.(); };
  }, [animated]);
  return <div className="sculpture" ref={host} role="img" aria-label="A sculptural violet knot rendered in three dimensions"><div className="sculpture-fallback"/></div>;
}

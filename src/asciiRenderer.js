// A single GPU draw renders every glyph and photo tile. No per-frame canvas text,
// texture uploads, particle sorting, or per-particle JavaScript calculations.
export function createAsciiRenderer(canvas) {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, depth: true, powerPreference: 'low-power' });
  if (!gl) return null;
  const vertex = `#version 300 es
    precision highp float;
    layout(location=0) in vec3 sphere;
    layout(location=1) in vec2 target;
    layout(location=2) in float seed;
    uniform vec2 viewport;
    uniform float ratio, radius, progress, phase, grid;
    uniform vec2 pointer;
    out vec2 photoUV;
    out float morph, solid, spriteSize, glyphSize, tileSize, light, rim, tint;
    void main() {
      float t = clamp((progress-seed*.08)/.92,0.,1.);
      morph = t*t*(3.-2.*t);
      solid = smoothstep(.55,1.,morph);
      float idle=1.-progress;
      float angle=phase+progress*1.4+pointer.x*.6*idle;
      float tilt=.3+sin(phase*.7)*.12*idle+pointer.y*.4*idle;
      float x=sphere.x*cos(angle)+sphere.z*sin(angle);
      float z=-sphere.x*sin(angle)+sphere.z*cos(angle);
      float y=sphere.y*cos(tilt)-z*sin(tilt);
      float depth=sphere.y*sin(tilt)+z*cos(tilt);
      light=clamp((depth+1.)*.5,0.,1.);
      rim=smoothstep(.72,1.,length(vec2(x,y)));
      vec2 origin=vec2(x,y)*3./(3.-depth);
      // Push glyphs away from the cursor, settling back when it leaves.
      vec2 cursor=pointer*viewport/(2.*radius);
      vec2 away=origin-cursor;
      float push=exp(-dot(away,away)*9.)*.16*(1.-morph)*light;
      origin+=away/(length(away)+1e-4)*push;
      tint=clamp(origin.x*.35-origin.y*.35+.5,0.,1.);
      float breathing=sin(phase*1.4+seed*24.)*.012*(1.-morph);
      origin *= 1.+breathing;
      vec2 arc=vec2(sin(seed*60.+phase),cos(seed*60.+phase*.8))*sin(morph*3.14159265)*.12;
      vec2 pos=mix(origin,target,morph)+arc;
      gl_Position=vec4(pos.x*radius*2./viewport.x,-pos.y*radius*2./viewport.y,-depth*.3*(1.-morph),1.);
      glyphSize=(6.5+light*7.5)*(1.-rim*.25)*(1.-solid);
      tileSize=(radius*2./grid+.4)*solid;
      spriteSize=max(1.,max(glyphSize,tileSize));
      gl_PointSize=spriteSize*ratio;
      photoUV=target*.5+.5;
    }`;
  const fragment = `#version 300 es
    precision highp float;
    uniform sampler2D glyphAtlas, portrait;
    uniform float grid, wireframe, phase;
    in vec2 photoUV;
    in float morph, solid, spriteSize, glyphSize, tileSize, light, rim, tint;
    out vec4 color;
    void main() {
      vec2 delta=(gl_PointCoord-.5)*spriteSize;
      if(wireframe>.5) {
        // Floating: HUD-style corner brackets with a core dot, shaded by depth.
        // Assembled: full tile outlines whose brightness traces the portrait.
        vec2 p=gl_PointCoord;
        float lum=dot(texture(portrait,photoUV).rgb,vec3(.299,.587,.114));
        float hl=smoothstep(.12,.8,lum);
        float edge=min(min(p.x,1.-p.x),min(p.y,1.-p.y));
        float w=mix(.07,.035+hl*.035,solid);
        float stroke=1.-smoothstep(w,w+fwidth(edge),edge);
        vec2 c=abs(p-.5);
        stroke*=mix(step(.26,min(c.x,c.y)),1.,solid);
        float r=length(p-.5);
        float core=(1.-smoothstep(.07,.07+fwidth(r),r))*(1.-solid);
        float a=max(stroke,core*.9);
        if(a<.05) discard;
        vec3 hue=mix(vec3(.72,.58,1.),vec3(.45,.85,.98),tint);
        hue=mix(hue*.6,hue*1.2,light);
        vec3 ink=mix(hue,mix(hue*.7,vec3(1.),hl*.8),solid);
        float fade=mix(.2+.8*light*(1.-rim*.4),.15+.85*hl,solid);
        color=vec4(ink,a*fade);
        return;
      }
      if(solid>0. && max(abs(delta.x),abs(delta.y))<=tileSize*.5) {
        vec2 uv=photoUV+delta/tileSize/grid;
        if(morph>.99 && length(uv-.5)>.5) discard;
        color=vec4(texture(portrait,uv).rgb,1.);
      } else if(glyphSize>.1 && max(abs(delta.x),abs(delta.y))<=glyphSize*.5) {
        vec2 uv=delta/glyphSize+.5;
        // Dense glyphs on the lit front, light glyphs toward the silhouette and back.
        float density=light*(1.-rim*.75);
        float glyph=clamp(floor(density*7.+sin(phase*2.2+photoUV.x*18.+photoUV.y*13.)*.7),0.,7.);
        float alpha=texture(glyphAtlas,vec2((glyph+uv.x)/8.,uv.y)).a;
        if(alpha<.1) discard;
        vec3 hue=mix(vec3(.72,.58,1.),vec3(.45,.85,.98),tint);
        hue=mix(hue*.55,hue*1.15+.05,light);
        vec3 ink=mix(hue,texture(portrait,photoUV).rgb,morph);
        color=vec4(ink,alpha*mix(.3+.7*light,1.,morph));
      } else discard;
    }`;
  const shaders = [];
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    shaders.push(shader);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  };
  const program = gl.createProgram();
  let buffer;
  const textures = [];
  const dispose = () => {
    textures.forEach(texture => gl.deleteTexture(texture));
    if (buffer) gl.deleteBuffer(buffer);
    shaders.forEach(shader => gl.deleteShader(shader));
    gl.deleteProgram(program);
  };
  try {
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const grid = 40;
    const targets = [];
    for (let row = 0; row < grid; row++) for (let col = 0; col < grid; col++) {
      const x = (col + .5) / grid * 2 - 1, y = (row + .5) / grid * 2 - 1;
      if (x * x + y * y <= Math.pow(1 + 1.42 / grid, 2)) targets.push([x, y]);
    }
    const data = new Float32Array(targets.length * 6);
    targets.forEach(([tx, ty], i) => {
      const y = 1 - 2 * i / (targets.length - 1), r = Math.sqrt(1 - y * y), a = i * Math.PI * (3 - Math.sqrt(5));
      data.set([Math.cos(a) * r, y, Math.sin(a) * r, tx, ty, (i * .61803398875) % 1], i * 6);
    });
    buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    [3, 2, 1].forEach((size, index) => { gl.enableVertexAttribArray(index); gl.vertexAttribPointer(index, size, gl.FLOAT, false, 24, [0, 12, 20][index]); });
    const uniforms = Object.fromEntries(['viewport', 'ratio', 'radius', 'progress', 'phase', 'grid', 'pointer', 'glyphAtlas', 'portrait', 'wireframe'].map(name => [name, gl.getUniformLocation(program, name)]));
    const texture = (unit, source) => {
      const item = gl.createTexture(); textures.push(item); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, item);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    };
    const atlas = document.createElement('canvas'); atlas.width = 256; atlas.height = 32;
    const ctx = atlas.getContext('2d'); ctx.font = '26px "Courier New", monospace'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    [...'.:+*oO#@'].forEach((glyph, i) => ctx.fillText(glyph, i * 32 + 16, 16)); texture(0, atlas);
    const placeholder = document.createElement('canvas'); placeholder.width = placeholder.height = 1; texture(1, placeholder);
    gl.uniform1i(uniforms.glyphAtlas, 0); gl.uniform1i(uniforms.portrait, 1); gl.uniform1f(uniforms.grid, grid);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.DEPTH_TEST);
    return {
      setPhoto(photo) {
        const sample = document.createElement('canvas'); sample.width = sample.height = 512;
        const side = Math.min(photo.naturalWidth, photo.naturalHeight);
        sample.getContext('2d').drawImage(photo, (photo.naturalWidth - side) / 2, (photo.naturalHeight - side) * .35, side, side, 0, 0, 512, 512);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textures[1]); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sample);
      },
      resize(width, height) {
        const ratio = Math.min(devicePixelRatio || 1, 1.5); canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
        gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(uniforms.viewport, width, height); gl.uniform1f(uniforms.ratio, ratio); gl.uniform1f(uniforms.radius, Math.min(width * .34, height * .36));
      },
      draw(progress, phase, wireframe = false, pointer = { x: 0, y: 0 }) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.uniform1f(uniforms.progress, progress); gl.uniform1f(uniforms.phase, phase); gl.uniform2f(uniforms.pointer, pointer.x, pointer.y); gl.uniform1f(uniforms.wireframe, wireframe ? 1 : 0); gl.drawArrays(gl.POINTS, 0, targets.length);
      }, dispose,
    };
  } catch (error) { dispose(); console.warn('ASCII GPU renderer unavailable', error); return null; }
}

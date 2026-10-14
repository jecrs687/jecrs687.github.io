// phones and low-memory devices get a lighter film
const LOW = matchMedia("(pointer: coarse)").matches || Math.min(screen.width, screen.height) < 600 || (navigator.deviceMemory || 8) <= 4;
if (LOW) document.documentElement.classList.add("low");
// ---------- Emma in 3D: Kinoloom "diorama" lookdev, v2 — a finely faceted low-poly chibi ----------
// Built like the Kinoloom rigs: parametric three.js parts on a joint hierarchy, seeded vertex jitter so facets catch
// the key light, poses as pure functions of time. v2 adds: one sculpted head (no seams), features snapped to the face
// by raycast, textured eyes, ribbon hair locks with sheen, folded tee and jeans, drawstring, stacked cuffs, real sneakers.
THREE.ColorManagement.legacyMode = false;
const TAU = Math.PI * 2;
const smooth = (a, b, t) => { const u = clamp((t - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

const COL = {
  skin: 0xc68b65, noseTip: 0xcf8a6c, ear: 0xc97f68, lip: 0x7c4234, brow: 0x2a1d18,
  hair: 0x171513, hairMid: 0x26231f, hairHi: 0x5d5853,
  shirt: 0x2c3562, rib: 0x252c54,
  jeans: 0x1e1e22, jeansFade: 0x3c3d44, cuff: 0x5b5d65, cuffHi: 0x6d6f77, cord: 0xe6e2da,
  shoe: 0x45484f, shoeHi: 0x55585f, sole: 0xe9e6df, lace: 0xdedbd4,
  frame: 0x1a1311, sclera: 0xfbf8f2, ink: 0x15100f, mouth: 0x4e1b1e, tongue: 0xd8767a, teeth: 0xfdfbf6,
};

// ---- textures ----
function canvasTex(w, h, draw, srgb = true) { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); if (srgb) t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t; }
// navy tee with a soft, shaded capybara screen print, laid out for a lathe whose front is at u = 0.5
function shirtTexture() {
  return canvasTex(1024, 512, (x, W, H) => {
    const r = mulberry32(3);
    x.fillStyle = "#263052"; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 3200; i++) { x.fillStyle = r() < .5 ? "rgba(255,255,255,.03)" : "rgba(0,0,20,.05)"; x.fillRect(r() * W, r() * H, 2, 2); }
    x.save(); x.translate(W / 2 + 4, H * .47); x.scale(1.5, 1.85);   // lathe stretches u and v differently
    const E = (cx, cy, rx, ry, a = 0) => { const p = new Path2D(); p.ellipse(cx, cy, rx, ry, a, 0, TAU); return p; };
    const grad = (y0, y1, a, b) => { const g = x.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; };
    for (const [lx, ly] of [[-24, 26], [-8, 28], [30, 26], [44, 24]]) { x.fillStyle = "#7d5134"; const p = new Path2D(); p.roundRect(lx - 7, ly - 6, 14, 20, 7); x.fill(p); }
    x.fillStyle = grad(-30, 34, "#865836", "#b58258"); x.fill(E(14, 2, 50, 30, -.06));            // barrel body: darker back, warm belly
    const head = new Path2D(); head.moveTo(-4, -24); head.bezierCurveTo(-26, -36, -56, -30, -64, -12); head.bezierCurveTo(-70, 4, -60, 20, -42, 20); head.bezierCurveTo(-24, 22, -8, 14, -4, 4); head.closePath();
    x.fillStyle = grad(-34, 22, "#8c5c39", "#a9774f"); x.fill(head);
    x.fillStyle = "rgba(205,160,118,.55)"; x.fill(E(-56, 4, 11, 12));                               // blunt snout
    x.fillStyle = "#5e3b25"; x.fill(E(-12, -27, 7, 5.5, -.4));                                       // ear
    x.fillStyle = "#2a1a12"; x.fill(E(-38, -10, 3.2, 3.6)); x.fill(E(-61, -2, 2.6, 3.4, .2));       // eye, nostril
    x.strokeStyle = "rgba(60,36,24,.6)"; x.lineWidth = 2; x.beginPath(); x.moveTo(-60, 11); x.quadraticCurveTo(-55, 14, -50, 12); x.stroke();
    x.strokeStyle = "rgba(70,44,26,.35)";
    for (let i = 0; i < 16; i++) { const px = -30 + r() * 80, py = -20 + r() * 30; x.beginPath(); x.moveTo(px, py); x.lineTo(px + 6, py + 4); x.stroke(); }
    x.restore();
    for (let i = 0; i < 900; i++) { x.fillStyle = "rgba(38,48,82,.35)"; x.fillRect(W / 2 - 110 + r() * 220, H * .47 - 90 + r() * 160, 1.6, 1.6); } // screen-print wear
  });
}
function plainTee() { // same jersey grain, no print — for the sleeves
  return canvasTex(256, 128, (x, W, H) => { const r = mulberry32(5); x.fillStyle = "#263052"; x.fillRect(0, 0, W, H); for (let i = 0; i < 500; i++) { x.fillStyle = r() < .5 ? "rgba(255,255,255,.03)" : "rgba(0,0,20,.05)"; x.fillRect(r() * W, r() * H, 2, 2); } });
}
function irisTexture() {
  return canvasTex(256, 256, (x, W) => {
    const c = W / 2;
    x.fillStyle = "#fbf8f2"; x.fillRect(0, 0, W, W);
    const g = x.createRadialGradient(c, c + 14, 8, c, c, 118);
    g.addColorStop(0, "#c1895a"); g.addColorStop(.55, "#8b5a36"); g.addColorStop(.86, "#5a3820"); g.addColorStop(1, "#2a1a10");
    x.fillStyle = g; x.beginPath(); x.arc(c, c, 118, 0, TAU); x.fill();
    x.strokeStyle = "rgba(255,225,180,.22)"; x.lineWidth = 3;
    for (let a = 0; a < TAU; a += .2) { x.beginPath(); x.moveTo(c + Math.cos(a) * 50, c + Math.sin(a) * 50); x.lineTo(c + Math.cos(a) * 100, c + Math.sin(a) * 100); x.stroke(); }
    x.fillStyle = "rgba(30,15,8,.35)"; x.beginPath(); x.arc(c, c - 40, 112, Math.PI * 1.05, Math.PI * 1.95); x.fill();   // lid shadow
    x.fillStyle = "#120c09"; x.beginPath(); x.arc(c, c + 4, 46, 0, TAU); x.fill();
  });
}
function softDot(color) {
  return canvasTex(128, 128, (x, W) => { const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, color); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, W, W); });
}

// ---- materials: diorama shading (physical, flat-shaded facets, low specular) ----
const MATS = {};
function M(role) {
  if (MATS[role]) return MATS[role];
  const c = COL[role];
  let m;
  if (role === "skin" || role === "noseTip" || role === "ear") m = new THREE.MeshPhysicalMaterial({ color: c, roughness: .58, specularIntensity: .25, sheen: .6, sheenRoughness: .5, sheenColor: new THREE.Color(0xff9a7a), flatShading: true });
  else if (role === "hair") m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, vertexColors: true, roughness: .58, specularIntensity: .28, flatShading: true, side: THREE.DoubleSide });
  else if (role === "jeans") m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, vertexColors: true, roughness: .86, specularIntensity: .15, flatShading: true });
  else if (role === "shirt") m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: shirtTexture(), roughness: .82, specularIntensity: .12, flatShading: true, side: THREE.DoubleSide });
  else if (role === "sleeve") m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: plainTee(), roughness: .82, specularIntensity: .12, flatShading: true, side: THREE.DoubleSide });
  else if (role === "frame") m = new THREE.MeshPhysicalMaterial({ color: c, roughness: .38, clearcoat: .9, clearcoatRoughness: .3, specularIntensity: .6 });
  else if (role === "lens") m = new THREE.MeshPhysicalMaterial({ color: 0xf4efe6, transparent: true, opacity: .12, roughness: 0, clearcoat: 1, depthWrite: false });
  else if (role === "iris") m = new THREE.MeshPhysicalMaterial({ map: irisTexture(), roughness: .18, clearcoat: 1, clearcoatRoughness: .08 });
  else if (role === "blush") m = new THREE.MeshBasicMaterial({ map: softDot("rgba(232,120,104,1)"), transparent: true, opacity: .55, depthWrite: false });
  else if (["sclera", "ink", "teeth", "mouth", "tongue"].includes(role)) m = new THREE.MeshPhysicalMaterial({ color: c, roughness: .25, clearcoat: .8, clearcoatRoughness: .15 });
  else m = new THREE.MeshPhysicalMaterial({ color: c, roughness: role === "cuff" || role === "cord" ? .8 : .5, specularIntensity: .2, flatShading: true });
  return (MATS[role] = m);
}

// ---- geometry helpers ----
let SEED = 1;
function jitter(geo, amount, seed = SEED++) {
  geo = geo.index ? geo.toNonIndexed() : geo;
  const p = geo.attributes.position, rnd = mulberry32(seed), cache = new Map();
  for (let i = 0; i < p.count; i++) {
    const k = `${p.getX(i).toFixed(4)},${p.getY(i).toFixed(4)},${p.getZ(i).toFixed(4)}`;
    let o = cache.get(k); if (!o) cache.set(k, (o = [(rnd() - .5) * amount, (rnd() - .5) * amount, (rnd() - .5) * amount]));
    p.setXYZ(i, p.getX(i) + o[0], p.getY(i) + o[1], p.getZ(i) + o[2]);
  }
  geo.computeVertexNormals(); return geo;
}
function deform(geo, fn) { const p = geo.attributes.position, v = new THREE.Vector3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); fn(v); p.setXYZ(i, v.x, v.y, v.z); } geo.computeVertexNormals(); return geo; }
function mk(geo, m, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; return o; }
const G = (parent, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
// a tapered capsule hanging from its pivot (y = 0) down to y = -len, as one lathe: no seams at the joints
function capsuleLathe(r0, r1, len, seg = 14, cap = 5) {
  const pts = [];
  for (let i = 0; i <= cap; i++) { const a = -Math.PI / 2 + (i / cap) * Math.PI / 2; pts.push(new THREE.Vector2(Math.max(1e-4, Math.cos(a) * r1), -len + Math.sin(a) * r1)); }
  for (let i = 1; i <= cap; i++) { const a = (i / cap) * Math.PI / 2; pts.push(new THREE.Vector2(Math.max(1e-4, Math.cos(a) * r0), Math.sin(a) * r0)); }
  return new THREE.LatheGeometry(pts, seg);
}
const limb = (r0, r1, len, seg = 14) => jitter(capsuleLathe(r0, r1, len, seg), (r0 + r1) * .03);
function lathe(prof, seg = 24, zScale = 1, phiStart = 0) { const g = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), seg, phiStart); g.scale(1, 1, zScale); return g; }
function tube(points, r, m, seg = 16) { return mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), seg, r, 6, false), m); }
function ring(R, tb, m, seg = 32, arc = TAU) { const o = new THREE.Mesh(new THREE.TorusGeometry(R, tb, 8, seg, arc), m); o.castShadow = true; return o; }
function bar(a, b, r, m, seg = 8) {
  const d = new THREE.Vector3().subVectors(b, a), g = new THREE.CylinderGeometry(r, r, 1, seg); g.translate(0, .5, 0);
  const o = new THREE.Mesh(g, m); o.position.copy(a); o.quaternion.setFromUnitVectors(V3(0, 1, 0), d.clone().normalize()); o.scale.set(1, d.length(), 1); o.castShadow = true; return o;
}
// jeans get a stone-wash fade on the front of each part, painted into vertex colours (in the part's local frame)
function denim(geo, fadeY = null) {
  geo = geo.index ? geo.toNonIndexed() : geo;
  const p = geo.attributes.position, cols = [], base = new THREE.Color(COL.jeans), fade = new THREE.Color(COL.jeansFade), c = new THREE.Color();
  let maxR = 1e-6; for (let i = 0; i < p.count; i++) maxR = Math.max(maxR, Math.hypot(p.getX(i), p.getZ(i)));
  for (let i = 0; i < p.count; i++) {
    const f = Math.pow(clamp(p.getZ(i) / maxR * .5 + .5, 0, 1), 2.2) * (fadeY ? fadeY(p.getY(i)) : 1);
    c.copy(base).lerp(fade, clamp(f, 0, 1) * .75); cols.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3)); return geo;
}

// ---- hair: ribbon locks (tapered blades with a little thickness), merged into one mesh with a sheen stripe ----
class HairBuilder {
  constructor() { this.pos = []; this.col = []; this.cRoot = new THREE.Color(0x0b0a09); this.cMid = new THREE.Color(COL.hairMid); this.cHi = new THREE.Color(COL.hairHi); }
  blade(P0, P1, P2, N, w, t, hi = .6) {
    const segs = 8, rings = [], cols = [];
    for (let s = 0; s <= segs; s++) {
      const u = s / segs, iu = 1 - u;
      const C = P0.clone().multiplyScalar(iu * iu).addScaledVector(P1, 2 * iu * u).addScaledVector(P2, u * u);
      const T = P1.clone().sub(P0).multiplyScalar(2 * iu).addScaledVector(P2.clone().sub(P1), 2 * u).normalize();
      const S = T.clone().cross(N).normalize(), Nn = S.clone().cross(T).normalize();
      const wf = w * Math.pow(iu, .8) * (u < .2 ? .7 + 1.5 * u : 1), tf = t * (1 - u * .85);
      rings.push([C.clone().addScaledVector(S, -wf / 2), C.clone().addScaledVector(S, -wf * .12).addScaledVector(Nn, tf), C.clone().addScaledVector(S, wf / 2), C.clone().addScaledVector(Nn, -tf * .35)]);
      const base = this.cRoot.clone().lerp(this.cMid, smooth(0, .55, u));
      const sheen = Math.exp(-(((u - .55) / .22) ** 2)) * hi;
      cols.push([base, base.clone().lerp(this.cHi, sheen), base, base.clone().multiplyScalar(.8)]);
    }
    for (let s = 0; s < segs; s++) for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4, a = rings[s][k], b = rings[s][k2], c1 = rings[s + 1][k], d = rings[s + 1][k2];
      const ca = cols[s][k], cb = cols[s][k2], cc = cols[s + 1][k], cd = cols[s + 1][k2];
      for (const [v, cv] of [[a, ca], [c1, cc], [b, cb], [b, cb], [c1, cc], [d, cd]]) { this.pos.push(v.x, v.y, v.z); this.col.push(cv.r, cv.g, cv.b); }
    }
  }
  mesh() {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(this.col, 3));
    g.computeVertexNormals(); return mk(g, M("hair"));
  }
}

// ---- the build: units ~ metres, ~1.24 tall to the top of the hair ----
const HX = .2, HY = .205, HZ = .19;
function buildEmma() {
  SEED = 1;
  const root = new THREE.Group(), body = G(root);
  const hips = G(body, 0, .43, 0);

  // pelvis + waistband + drawstring peeking out under the tee
  hips.add(mk(denim(jitter(lathe([[1e-4, -.085], [.142, -.085], [.158, -.03], [.154, .04], [1e-4, .04]], 22, .76), .003)), M("jeans")));
  const wb = ring(.153, .011, new THREE.MeshPhysicalMaterial({ color: COL.jeans, roughness: .85, flatShading: true }), 30); wb.rotation.x = Math.PI / 2; wb.scale.set(1, .76, 1); wb.position.y = -.012; hips.add(wb);
  for (const s of [-1, 1]) {
    hips.add(tube([V3(s * .008, -.014, .119), V3(s * .016, -.04, .124), V3(s * .012, -.07, .122), V3(s * .02, -.088, .12)], .0042, M("cord"), 12));
    hips.add(mk(new THREE.CylinderGeometry(.0055, .0055, .014, 8), M("cord"), s * .02, -.095, .12));
  }

  // legs: loose black jeans with a front fade, folds stacked above wide rolled cuffs, dark grey sneakers
  const legs = {};
  for (const [k, s] of [["L", -1], ["R", 1]]) {
    const thigh = G(hips, s * .078, -.012, 0);
    thigh.add(mk(denim(jitter(capsuleLathe(.082, .078, .18, 16), .004), y => .6 + .6 * Math.exp(-(((y + .1) / .06) ** 2))), M("jeans")));
    const knee = G(thigh, 0, -.18, 0);
    const shinG = deform(jitter(capsuleLathe(.078, .082, .172, 16), .004), v => {
      const a = Math.atan2(v.x, v.z);
      const f = smooth(-.08, -.15, v.y) * .055 * Math.sin(v.y * 95 + a * 1.5);       // bunching above the cuff
      const kf = Math.exp(-((v.y / .03) ** 2)) * .03 * Math.sin(a * 3);               // knee creases
      v.x *= 1 + f + kf; v.z *= 1 + f + kf;
    });
    knee.add(mk(denim(shinG, y => .5 + .7 * Math.exp(-(((y + .02) / .05) ** 2))), M("jeans")));
    knee.add(mk(jitter(new THREE.CylinderGeometry(.094, .097, .05, 22, 1, true), .003), M("cuff"), 0, -.15, 0));
    const fold = ring(.094, .011, M("cuffHi"), 26); fold.rotation.x = Math.PI / 2; fold.position.y = -.126; knee.add(fold);
    const fold2 = ring(.096, .008, M("cuff"), 26); fold2.rotation.x = Math.PI / 2; fold2.position.y = -.174; knee.add(fold2);
    const foot = G(knee, 0, -.175, 0);
    // sneaker: rounded upper with a flat bottom and toe spring, rubber sole and toe cap, laces, tongue, heel tab
    foot.add(mk(deform(jitter(new THREE.IcosahedronGeometry(1, 3), .015), v => { if (v.y < 0) v.y *= .35; if (v.z > .4) v.y += (v.z - .4) * .12; v.multiply(V3(.063, .052, .112)); }), M("shoe"), 0, -.036, .03));
    foot.add(mk(deform(new THREE.CylinderGeometry(1, 1, 1, 26), v => v.multiply(V3(.067, .02, .12))), M("sole"), 0, -.06, .03));
    foot.add(mk(deform(new THREE.IcosahedronGeometry(1, 2), v => { if (v.y > .2) v.y = .2; v.multiply(V3(.054, .03, .05)); }), M("sole"), 0, -.048, .1));
    for (let i = 0; i < 4; i++) foot.add(mk(new THREE.BoxGeometry(.044 - i * .004, .006, .008), M("lace"), 0, .012 - i * .007, .035 + i * .018));
    const tongue = mk(new THREE.BoxGeometry(.032, .012, .04), M("shoeHi"), 0, .016, .02); tongue.rotation.x = -.5; foot.add(tongue);
    foot.add(mk(new THREE.BoxGeometry(.026, .03, .01), M("shoeHi"), 0, -.012, -.08));
    legs[k] = { thigh, knee, foot, s };
  }

  // torso: a loose navy tee with folds toward the hem, print on the front, ribbed crew collar
  const chest = G(hips, 0, .03, 0);
  const teeG = deform(jitter(lathe([[1e-4, -.04], [.162, -.04], [.168, -.005], [.166, .06], [.158, .13], [.152, .18], [.144, .216], [.12, .246], [.07, .263], [1e-4, .269]], 30, .8, Math.PI), .0025), v => {
    const a = Math.atan2(v.x, v.z), low = smooth(.09, -.04, v.y);
    const f = 1 + low * (.028 * Math.sin(a * 7 + 1.3) + .014 * Math.sin(a * 13));
    v.x *= f; v.z *= f;
  });
  const tee = mk(teeG, M("shirt")); chest.add(tee);
  const collar = ring(.06, .012, M("rib"), 30); collar.rotation.x = Math.PI / 2; collar.scale.set(1, .85, 1); collar.position.set(0, .258, .006); chest.add(collar);

  // arms: flared short sleeves with folds, soft capsule arms, hands with jointed fingers
  const arms = {};
  for (const [k, s] of [["L", -1], ["R", 1]]) {
    const shoulder = G(chest, s * .152, .215, 0);
    shoulder.add(mk(deform(jitter(lathe([[1e-4, .05], [.05, .042], [.07, .01], [.073, -.05], [.083, -.108], [.077, -.114]], 22), .002), v => {
      const a = Math.atan2(v.x, v.z), f = 1 + smooth(-.03, -.11, v.y) * .05 * Math.sin(a * 5 + s);
      v.x *= f; v.z *= f;
    }), M("sleeve")));
    shoulder.add(mk(limb(.05, .048, .115).translate(0, -.015, 0), M("skin")));
    const elbow = G(shoulder, 0, -.13, 0);
    elbow.add(mk(limb(.048, .04, .12), M("skin")));
    const hand = G(elbow, 0, -.122, 0);
    hand.add(mk(deform(jitter(new THREE.IcosahedronGeometry(1, 2), .03), v => v.multiply(V3(.024, .042, .04))), M("skin"), 0, -.03, 0));
    const fingers = [];
    for (let i = 0; i < 4; i++) {
      const z = -.026 + i * .0175, len = [.022, .026, .025, .02][i];
      const base = G(hand, s * .003, -.064, z); base.add(mk(limb(.0105, .0098, len, 8), M("skin")));
      const tip = G(base, 0, -len, 0); tip.add(mk(limb(.0098, .0088, len * .8, 8), M("skin")));
      fingers.push({ base, tip });
    }
    const thumb = G(hand, -s * .006, -.024, .036); thumb.add(mk(limb(.0125, .011, .026, 8), M("skin")));
    const thumbTip = G(thumb, 0, -.026, 0); thumbTip.add(mk(limb(.011, .0098, .02, 8), M("skin")));
    thumb.rotation.x = .9;
    arms[k] = { shoulder, elbow, hand, fingers, thumb, s };
  }

  // head: one sculpted skull — full cheeks, soft narrow chin, round back — finely faceted
  const neck = G(chest, 0, .255, 0);
  neck.add(mk(limb(.05, .054, .06).translate(0, .05, 0), M("skin")));
  const head = G(neck, 0, .02, 0); head.scale.setScalar(1.1);
  const F = G(head, 0, .2, 0);
  const skullG = deform(jitter(new THREE.IcosahedronGeometry(1, 4), .012), v => {
    const cheek = Math.exp(-(((v.y + .38) / .26) ** 2)) * Math.max(0, v.z + .2);
    v.x *= 1 + .05 * cheek; v.z *= 1 + .05 * cheek;
    if (v.y < -.42) { const k = (-v.y - .42) / .58; v.x *= 1 - .36 * k * k; v.z = v.z * (1 - .1 * k) + .05 * k; }
    if (v.z < 0) v.z *= 1.06;
    v.multiply(V3(HX, HY, HZ));
  });
  F.add(mk(skullG, M("skin")));
  // snap features onto the sculpted face with a raycast
  const probe = new THREE.Mesh(skullG, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })); probe.updateMatrixWorld(true);
  const ray = new THREE.Raycaster();
  const surfZ = (x, y) => { ray.set(V3(x, y, 1), V3(0, 0, -1)); const h = ray.intersectObject(probe)[0]; return h ? h.point.z : .15; };

  // nose: a small button with a warm tip
  const nz = surfZ(0, -.068);
  F.add(mk(deform(new THREE.IcosahedronGeometry(1, 2), v => v.multiply(V3(.018, .015, .017))), M("skin"), 0, -.068, nz + .002));
  F.add(mk(deform(new THREE.IcosahedronGeometry(1, 2), v => v.multiply(V3(.01, .008, .008))), M("noseTip"), 0, -.071, nz + .013));
  // ears: big and round, a warm inner bowl, turned slightly forward
  for (const s of [-1, 1]) {
    const ear = G(F, s * .196, -.035, -.004); ear.rotation.y = s * .35;
    ear.add(mk(deform(jitter(new THREE.IcosahedronGeometry(1, 2), .04), v => v.multiply(V3(.022, .05, .036))), M("skin")));
    ear.add(mk(deform(new THREE.IcosahedronGeometry(1, 2), v => v.multiply(V3(.01, .032, .022))), M("ear"), s * .012, -.002, .004));
  }
  // cheek blush, soft-edged
  for (const s of [-1, 1]) {
    const bx = s * .105, by = -.09, bl = new THREE.Mesh(new THREE.PlaneGeometry(.075, .045), M("blush"));
    bl.position.set(bx, by, surfZ(bx, by) + .003); bl.lookAt(V3(bx * 3.2, by * .6, 1)); F.add(bl);
  }
  // eyes: sclera, a painted iris (ring, streaks, pupil, two highlights), a skin lid that blinks, a heavy upper lash
  const eyes = [];
  for (const s of [-1, 1]) {
    const r = .037, ex = s * .072, ey = -.028, e = G(F, ex, ey, surfZ(ex, ey) - r * .55);
    e.scale.set(1, 1.1, 1);
    e.add(mk(new THREE.SphereGeometry(r, 32, 18), M("sclera")));
    const iris = new THREE.Mesh(new THREE.CircleGeometry(r * .78, 32), M("iris")); iris.position.z = r * 1.006; e.add(iris);
    const lid = mk(new THREE.SphereGeometry(r * 1.07, 32, 14, 0, TAU, 0, Math.PI * .5), M("skin")); e.add(lid);
    const lash = new THREE.Mesh(new THREE.TorusGeometry(r * 1.06, r * .11, 8, 28, Math.PI), M("ink")); lash.rotation.x = Math.PI / 2; lid.add(lash);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(r * .16, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); glint.position.set(r * .3, r * .3, r * 1.02); e.add(glint);
    const glint2 = glint.clone(); glint2.scale.setScalar(.45); glint2.position.set(-r * .3, -r * .32, r * 1.015); e.add(glint2);
    const happy = new THREE.Mesh(new THREE.TorusGeometry(r * .64, r * .11, 8, 22, Math.PI), M("ink")); happy.position.set(0, -r * .25, r * 1.02); happy.visible = false; e.add(happy);
    e.userData = { lid, happy, eyeParts: [iris, glint, glint2] };
    eyes.push(e);
  }
  // brows: thick, softly arched, dark brown — visible above the glasses
  const brows = [-1, 1].map(s => {
    const b = tube([[.032, .062], [.068, .074], [.104, .066]].map(([x, y]) => V3(s * x, y, surfZ(s * x, y) + .006)), .0072, M("brow"), 10);
    F.add(b); return b;
  });
  // mouth: a gentle closed smile line, plus an open mouth with teeth and tongue for grins and talking
  const mz = surfZ(0, -.122);
  const smile = tube([V3(-.03, -.115, surfZ(-.03, -.115) + .002), V3(-.012, -.124, mz + .002), V3(.012, -.124, mz + .002), V3(.03, -.115, surfZ(.03, -.115) + .002)], .0034, M("lip"), 14);
  F.add(smile);
  const MO = G(F, 0, -.126, mz - .006);
  const open = mk(new THREE.SphereGeometry(.028, 20, 12), M("mouth")); open.scale.set(1.2, .9, .5); MO.add(open);
  const teeth = mk(new THREE.BoxGeometry(.036, .008, .01), M("teeth"), 0, .012, .008); MO.add(teeth);
  const tongue = mk(new THREE.SphereGeometry(.018, 14, 8), M("tongue"), 0, -.012, .004); tongue.scale.set(1.3, .6, .6); MO.add(tongue);
  const mouth = { MO, smile, open, teeth, tongue };

  // glasses: thick dark acetate frames — flat fronts with bevelled edges, round with a slightly squared top, a thick
  // keyhole bridge, hinge blocks, flat arms back over the ears, nose pads and a soft glare on each lens
  const frame = M("frame"), frameEdge = new THREE.MeshPhysicalMaterial({ color: 0x3b2a22, roughness: .35, clearcoat: .9, clearcoatRoughness: .25 });
  const superE = (a, b, n, steps = 64) => { const pts = []; for (let i = 0; i < steps; i++) { const t = (i / steps) * TAU, c = Math.cos(t), s2 = Math.sin(t); pts.push(new THREE.Vector2(a * Math.sign(c) * Math.abs(c) ** (2 / n), (s2 > 0 ? b * 1.0 : b * .96) * Math.sign(s2) * Math.abs(s2) ** (2 / (s2 > 0 ? n + .5 : n)))); } return pts; };
  const LA = .053, LB = .05, FW = .0105, GY = -.026;
  const rimShape = new THREE.Shape(superE(LA + FW, LB + FW, 2.1)); rimShape.holes.push(new THREE.Path(superE(LA, LB, 2.1)));
  const rimGeo = new THREE.ExtrudeGeometry(rimShape, { depth: .009, bevelEnabled: true, bevelThickness: .0028, bevelSize: .0022, bevelSegments: 2, curveSegments: 64 });
  rimGeo.translate(0, 0, -.0045);
  const glareTex = canvasTex(128, 128, (x, W) => {
    x.clearRect(0, 0, W, W); x.save(); x.translate(64, 64); x.rotate(-.7);
    x.fillStyle = "rgba(255,255,255,.55)"; x.fillRect(-60, -26, 120, 14); x.fillStyle = "rgba(255,255,255,.3)"; x.fillRect(-60, -6, 120, 6); x.restore();
  });
  const glare = new THREE.MeshBasicMaterial({ map: glareTex, transparent: true, opacity: .35, depthWrite: false });
  const lensFront = {};
  for (const s of [-1, 1]) {
    const gx = s * .077, gz = surfZ(gx, GY) + .028;
    const lensG = G(F, gx, GY, gz); lensG.rotation.y = s * .12; lensFront[s] = lensG;
    const rim = new THREE.Mesh(rimGeo, [frame, frameEdge]); rim.castShadow = true; lensG.add(rim);
    const lensShape = new THREE.Shape(superE(LA + .001, LB + .001, 2.1));
    const lens = new THREE.Mesh(new THREE.ShapeGeometry(lensShape, 48), M("lens")); lens.position.z = -.002; lensG.add(lens);
    const gl = new THREE.Mesh(new THREE.ShapeGeometry(lensShape, 48), glare); gl.position.z = .001; lensG.add(gl);
    // hinge block on the outer top corner, then a flat arm back over the ear and down behind it
    const hx = s * (LA + FW + .004);
    lensG.add(mk(new THREE.BoxGeometry(.012, .016, .014), frame, hx, LB * .45, -.006));
    const hingeW = new THREE.Vector3(hx, LB * .45, -.012).applyMatrix4(new THREE.Matrix4().compose(lensG.position, lensG.quaternion, new THREE.Vector3(1, 1, 1)));
    const temple = V3(s * .19, GY + .028, .06), earTop = V3(s * .2, GY + .026, -.01), behind = V3(s * .204, GY - .016, -.05);
    for (const [a, b] of [[hingeW, temple], [temple, earTop], [earTop, behind]]) {
      const d = new THREE.Vector3().subVectors(b, a), arm = mk(new THREE.BoxGeometry(.0058, .0105, 1), frame);
      arm.position.copy(a).addScaledVector(d, .5); arm.lookAt(b); arm.scale.z = d.length(); F.add(arm);
    }
    // nose pad
    F.add(mk(new THREE.SphereGeometry(.007, 10, 8), M("lens"), s * .022, GY - .022, gz - .02));
  }
  // thick keyhole bridge joining the two fronts
  const bx = .077 - LA - FW * .3, bz = surfZ(0, GY) + .026;
  const bridgeCurve = new THREE.CatmullRomCurve3([V3(-bx, GY + .018, bz - .004), V3(0, GY + .024, bz + .002), V3(bx, GY + .018, bz - .004)]);
  F.add(mk(new THREE.TubeGeometry(bridgeCurve, 16, .0068, 8, false), frame));

  // hair: a dark scalp base following the hairline, then three layers of chunky faceted clumps — a big under-volume,
  // a messy outer layer whose tips flick outward, cowlicks on the crown — plus a chunky side-swept fringe,
  // spiky flicks over the ears, a layered back and nape
  const HAIRLINE = [[0, .55], [.75, .52], [1.15, .32], [1.45, .22], [1.75, .2], [2.2, -.62], [Math.PI, -.86]];
  const hairline = phi => { const a = Math.abs(Math.atan2(Math.sin(phi), Math.cos(phi))); for (let i = 1; i < HAIRLINE.length; i++) if (a <= HAIRLINE[i][0]) return lerp(HAIRLINE[i - 1][1], HAIRLINE[i][1], (a - HAIRLINE[i - 1][0]) / (HAIRLINE[i][0] - HAIRLINE[i - 1][0])); return -.5; };
  const capG = deform(jitter(new THREE.IcosahedronGeometry(1, 4), .01), v => {
    const el = Math.asin(clamp(v.y, -1, 1)), phi = Math.atan2(v.x, v.z);
    v.multiplyScalar(el < hairline(phi) ? .9 : 1.05);
    if (v.z < 0) v.z *= 1.06;
    v.multiply(V3(HX, HY, HZ)); v.y += .006;
  });
  F.add(mk(capG, new THREE.MeshPhysicalMaterial({ color: COL.hair, roughness: .6, specularIntensity: .25, flatShading: true })));
  const HB = new HairBuilder(), r = mulberry32(77);
  const sp = (phi, el, lift = 1) => V3(HX * Math.cos(el) * Math.sin(phi) * lift, HY * Math.sin(el) * lift + .008, HZ * Math.cos(el) * Math.cos(phi) * lift * (Math.cos(phi) < 0 ? 1.06 : 1));
  const lockAt = (rp, re, tp, te, w, t, lift = 1.12, arch = .08, hi = .7, flick = 0) => {
    const P0 = sp(rp, re, .97), P2 = sp(tp, te, lift), P1 = sp((rp + tp) / 2 + (r() - .5) * .22, (re + te) / 2, lift + arch);
    if (flick) P2.addScaledVector(P2.clone().normalize(), flick * .022);   // tip kicks out, away from the head
    HB.blade(P0, P1, P2, P0.clone().normalize(), w, t, hi);
  };
  const front = rp => Math.cos(rp) > .35;
  for (let i = 0; i < 74; i++) {                      // 1. big under-volume: wide flat clumps all over the scalp
    const rp = (r() - .5) * TAU, re = .4 + r() * .9;
    if (front(rp) && re < .75) continue;
    lockAt(rp, re, rp + (r() - .5) * .4, re - (front(rp) ? .3 : .45) - r() * .2, .15 + r() * .05, .05, (front(rp) ? 1.17 : 1.22) + r() * .07, .1, .55);
  }
  for (let i = 0; i < 64; i++) {                      // 2. messy outer layer: spiky clumps whose tips flick out
    const rp = (r() - .5) * TAU, re = .55 + r() * .7;
    if (front(rp) && re < .85) continue;
    lockAt(rp, re, rp + (r() - .5) * .5, re - .28 - r() * .3, .12 + r() * .04, .042, 1.19 + r() * .07, .06, .8, .2 + r() * .6);
  }
  for (let i = 0; i < 4; i++) {                       // 3. a few small cowlicks at the crown, falling back
    const rp = Math.PI * .85 + (r() - .5) * 1.2, re = 1.15 + r() * .15;
    lockAt(rp, re, rp + (r() - .5) * .6, re - .3, .1, .036, 1.24 + r() * .05, .05, .9, .6);
  }
  for (let i = 0; i < 9; i++) {                       // 4. chunky fringe swept to one side, pointed tips at the brows
    const rp = -.95 + i * .22 + (r() - .5) * .06;
    const te = .22 + r() * .06 + Math.abs(rp) * .14 - (i === 5 ? .05 : 0);
    lockAt(rp, .88 - Math.abs(rp) * .15, rp - .3 + (r() - .5) * .1, te, (Math.abs(rp) < .5 ? .19 : .16) + r() * .03, .044, 1.1, .13, .6, i % 3 === 0 ? .3 : 0);
  }
  for (const s of [-1, 1]) for (let j = 0; j < 7; j++) { // 5. spiky flicks over the ears
    const rp = s * (1.1 + j * .14);
    lockAt(rp, .48 + r() * .2, rp + s * (.26 + r() * .12), .0 + r() * .14, .12, .04, 1.23 + r() * .07, .04, .7, .5 + r() * .5);
  }
  for (let i = 0; i < 48; i++) {                      // 6. layered back, full and rounded
    const rp = Math.PI + (r() - .5) * 2.6;
    lockAt(rp, .05 + r() * .7, rp + (r() - .5) * .35, -.4 - r() * .26, .15, .048, 1.19 + r() * .07, .09, .65, r() < .4 ? .8 : 0);
  }
  for (const s of [-1, 1]) for (let j = 0; j < 9; j++) { // fuller sides: clumps falling over the tops of the ears
    const rp = s * (1.25 + j * .12 + r() * .05);
    lockAt(rp, .45 + r() * .3, rp + s * .1, -.02 - r() * .12, .13, .044, 1.16 + r() * .06, .07, .6, .3);
  }
  for (let i = 0; i < 14; i++) {                      // 7. nape, pointed ends down to the neck
    const rp = Math.PI + (i / 13 - .5) * 2.0;
    lockAt(rp, -.2, rp + (r() - .5) * .25, -.76 - r() * .1, .11, .034, 1.06, .03, .5, .4);
  }
  for (const s of [-1, 1]) lockAt(s * 1.38, .4, s * 1.42, -.05, .06, .022, 1.03, .02, .3); // short sideburns
  const hairG = HB.mesh(); F.add(hairG);

  // stand the soles on y = 0
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  body.position.y = body.userData.base = -box.min.y;
  return { root, rig: { body, hips, chest, tee, neck, head, F, eyes, brows, mouth, arms, legs, hairG }, height: box.max.y - box.min.y };
}

// ---- poses: pure functions of time + scroll state ----
function blinkAt(t) { const ph = t % 3.6, b = ph < .16 ? 1 - Math.abs(ph - .08) / .08 : 0; const ph2 = (t + .35) % 7.7; return Math.max(b, ph2 < .16 ? 1 - Math.abs(ph2 - .08) / .08 : 0); }
const talkEnv = t => clamp(.35 + .65 * Math.abs(Math.sin(t * 11)) * (.6 + .4 * Math.sin(t * 3.3)), 0, 1);
const ARM = side => ({ sx: .05, sz: side * .24, ex: -.2, ez: 0, hy: 0, curl: .35, thumb: .9 });
function basePose(t, calm) {
  const k = calm ? 0 : 1;
  return {
    rotY: 0, bob: 0, y: 0,
    hipRoll: .03 * Math.sin(t * .9) * k, lean: .015 * Math.sin(t * 1.3) * k, twist: .03 * Math.sin(t * .7) * k, breathe: Math.sin(t * 2.3) * k,
    headX: .03 * Math.sin(t * .8) * k, headY: .07 * Math.sin(t * .45) * k, headZ: .03 * Math.sin(t * .6) * k,
    arms: { L: ARM(-1), R: ARM(1) },
    legs: { L: { hx: 0, kx: 0, hz: -.035, hy: -.12 }, R: { hx: 0, kx: 0, hz: .035, hy: .12 } },
    blink: blinkAt(t), eyes: "open", mouth: 0, mouthO: 0, grin: 0, smile: .7, wide: 0, brow: 0,
  };
}
function addWalk(P, ph, w) {
  if (w <= 0) return;
  const sn = Math.sin(ph);
  P.legs.L.hx += -.55 * sn * w; P.legs.R.hx += .55 * sn * w;
  P.legs.L.kx += w * .85 * Math.max(0, Math.sin(ph + 1.3)); P.legs.R.kx += w * .85 * Math.max(0, Math.sin(ph + Math.PI + 1.3));
  P.legs.L.hy *= 1 - w; P.legs.R.hy *= 1 - w;
  P.arms.L.sx += .55 * sn * w; P.arms.R.sx += -.55 * sn * w;
  P.arms.L.ex += -.3 * w; P.arms.R.ex += -.3 * w;
  P.bob += w * (.03 * Math.abs(Math.cos(ph)) - .03);
  P.hipRoll += .05 * sn * w; P.twist += .08 * sn * w; P.lean += .06 * w;
}
const mixArm = (A, to, a) => { for (const k in to) A[k] = lerp(A[k], to[k], a); };
function addWave(P, t, a, side) { // one arm up, open palm to camera
  if (a <= 0) return;
  const s = side === "R" ? 1 : -1;
  mixArm(P.arms[side], { sx: -.25, sz: s * 2.5, ex: -.4, ez: s * (.2 + .45 * Math.sin(t * 10)), hy: s * 1.4, curl: 0, thumb: .3 }, a);
  P.headZ += -s * .1 * a; P.smile = Math.max(P.smile, a); P.brow += .4 * a; P.hipRoll += s * .04 * a;
}
function addHips(P, a) { // hands on hips, chest out
  if (a <= 0) return;
  mixArm(P.arms.L, { sx: .15, sz: -.95, ez: 2.0, ex: -.2, curl: 1.1, thumb: 1.2 }, a);
  mixArm(P.arms.R, { sx: .15, sz: .95, ez: -2.0, ex: -.2, curl: 1.1, thumb: 1.2 }, a);
  P.lean += -.05 * a; P.headX += -.04 * a; P.smile = Math.max(P.smile, a);
}
function addCheek(P, a, side) { // hand to cheek with a big open smile
  if (a <= 0) return;
  const s = side === "R" ? 1 : -1;
  mixArm(P.arms[side], { sx: -.35, sz: s * .5, ex: -2.25, ez: -s * .25, hy: s * .6, curl: .15, thumb: .4 }, a);
  P.headZ += s * .14 * a; P.grin = Math.max(P.grin, a); P.wide = Math.max(P.wide, .4 * a); P.brow += .6 * a;
}
function addJoy(P, t, a) { // both arms up, eyes squeezed shut, big grin
  if (a <= 0) return;
  const bounce = Math.max(0, Math.sin(t * 7));
  mixArm(P.arms.L, { sx: -.15, sz: -2.45, ex: -.35, ez: -.25 * Math.sin(t * 7), hy: -1.4, curl: 0, thumb: .3 }, a);
  mixArm(P.arms.R, { sx: -.15, sz: 2.45, ex: -.35, ez: .25 * Math.sin(t * 7 + 1), hy: 1.4, curl: 0, thumb: .3 }, a);
  P.y += .025 * bounce * a; P.eyes = a > .5 ? "happy" : P.eyes; P.grin = Math.max(P.grin, a); P.headX += -.06 * a; P.headZ += .05 * Math.sin(t * 3.5) * a;
}
function addTalk(P, t, a, side) {
  if (a <= 0) return;
  const s = side === "R" ? 1 : -1, g = .5 + .5 * Math.sin(t * 2.6);
  P.mouth = Math.max(P.mouth, talkEnv(t) * a); P.brow += .3 * a * Math.max(0, Math.sin(t * 2.7)); P.headX += .05 * a * Math.sin(t * 5.3);
  mixArm(P.arms[side], { sx: -.95 - .2 * g, sz: s * (.3 + .15 * g), ex: -1.1 + .2 * g, ez: -s * .3, hy: s * .9, curl: .12, thumb: .3 }, a);
}

function applyPose(C, P) {
  const { root, rig } = C;
  root.rotation.y = P.rotY;
  rig.body.position.y = rig.body.userData.base + P.y + P.bob;
  rig.hips.rotation.set(0, P.twist * .4, P.hipRoll);
  rig.chest.rotation.set(P.lean, -P.twist, -P.hipRoll * .7);
  rig.tee.scale.set(1 + .012 * P.breathe, 1 + .008 * P.breathe, 1 + .02 * P.breathe);
  rig.head.rotation.set(P.headX - P.lean * .5, P.headY, P.headZ + P.hipRoll * .4);
  for (const k of ["L", "R"]) {
    const A = rig.arms[k], p = P.arms[k];
    A.shoulder.rotation.set(p.sx, 0, p.sz - A.s * .012 * P.breathe);
    A.elbow.rotation.set(p.ex, 0, p.ez);
    A.hand.rotation.set(0, p.hy, 0);
    for (const [i, f] of A.fingers.entries()) { f.base.rotation.z = -A.s * p.curl * (.9 + i * .06); f.tip.rotation.z = -A.s * p.curl * 1.1; }
    A.thumb.rotation.x = p.thumb;
    const L = rig.legs[k], q = P.legs[k];
    L.thigh.rotation.set(q.hx, q.hy, q.hz); L.knee.rotation.x = q.kx; L.foot.rotation.x = -(q.hx + q.kx) * .6;
  }
  const b = clamp(P.blink, 0, 1), happy = P.eyes === "happy";
  for (const e of rig.eyes) {
    const u = e.userData;
    u.happy.visible = happy; u.eyeParts.forEach(o => (o.visible = !happy));
    u.lid.rotation.x = happy ? .6 : -1.12 - .3 * P.wide + (1.7 + .3 * P.wide) * b;
    e.scale.set(1 + .1 * P.wide, 1.1 * (1 + .1 * P.wide), 1);
  }
  for (const br of rig.brows) br.position.y = .014 * clamp(P.brow, 0, 1.5);
  const m = rig.mouth, open = Math.max(P.mouth, P.mouthO, P.grin);
  m.smile.visible = open < .18; m.smile.scale.set(.85 + .3 * clamp(P.smile, 0, 1), 1, 1);
  m.open.visible = m.tongue.visible = open >= .18; m.teeth.visible = P.grin > .3;
  m.open.scale.set(P.grin > .3 ? 1.25 : P.mouthO > P.mouth ? .75 : 1.05, .25 + .65 * open, .45);
}

// ten blocks: each scene owns its sky, set, ground and the thing Emma does there
// ---------- props: things Emma interacts with, built in the same faceted diorama style ----------
const PM = {};
const pmat = (key, color, o = {}) => PM[key] || (PM[key] = new THREE.MeshPhysicalMaterial({ color, roughness: .55, specularIntensity: .25, flatShading: true, ...o }));
const box = (w, h, d, m, x = 0, y = 0, z = 0) => mk(jitter(new THREE.BoxGeometry(w, h, d, 1, 1, 1), Math.min(w, h, d) * .06), m, x, y, z);
const egg = (sx, sy, sz, m, x = 0, y = 0, z = 0, detail = 2) => mk(deform(jitter(new THREE.IcosahedronGeometry(1, detail), .05), v => v.multiply(V3(sx, sy, sz))), m, x, y, z);
const easeBack = u => { const c = 1.7; u = clamp(u, 0, 1); return 1 + (c + 1) * (u - 1) ** 3 + c * (u - 1) ** 2; };

// standing desk with a laptop (seen from behind — a capybara sticker on the lid), a mug that steams, a little plant
function buildDesk() {
  const g = new THREE.Group(), wood = pmat("wood", 0xb9844f), metal = pmat("metal", 0x2b2d33, { roughness: .4 }), lid = pmat("lid", 0xc9ccd3, { roughness: .35, specularIntensity: .5 });
  g.add(box(.6, .028, .3, wood, 0, .555, 0));
  for (const sx of [-1, 1]) { g.add(box(.03, .54, .03, metal, sx * .26, .28, 0)); g.add(box(.03, .02, .26, metal, sx * .26, .02, 0)); }
  const lap = G(g, -.02, .57, .02);
  lap.add(box(.28, .012, .19, lid));
  const keys = new THREE.Mesh(new THREE.PlaneGeometry(.24, .1), new THREE.MeshStandardMaterial({ map: canvasTex(128, 64, (x, W, H) => { x.fillStyle = "#30333a"; x.fillRect(0, 0, W, H); x.fillStyle = "#4a4e57"; for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) x.fillRect(4 + c * 10, 4 + r * 14, 8, 11); }) }));
  keys.rotation.x = -Math.PI / 2; keys.position.set(0, .0065, -.02); lap.add(keys);
  const hinge = G(lap, 0, .006, .09); hinge.rotation.x = .32;      // lid opens toward Emma; we see its back
  const screen = box(.28, .19, .008, lid, 0, .095, 0); hinge.add(screen);
  const sticker = new THREE.Mesh(new THREE.CircleGeometry(.035, 24), new THREE.MeshStandardMaterial({ map: canvasTex(128, 128, (x, W) => { x.fillStyle = "#f6efe2"; x.beginPath(); x.arc(64, 64, 62, 0, TAU); x.fill(); x.fillStyle = "#9a6a43"; x.beginPath(); x.ellipse(70, 72, 40, 28, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(38, 58, 22, 20, 0, 0, TAU); x.fill(); x.fillStyle = "#f5b335"; x.beginPath(); x.arc(42, 34, 12, 0, TAU); x.fill(); x.fillStyle = "#2a1a12"; x.fillRect(30, 54, 6, 3); }), roughness: .5 }));
  sticker.position.set(.04, .1, .0045); hinge.add(sticker);
  const glow = new THREE.PointLight(0x9fd8ff, 0, .8, 2); glow.position.set(0, .1, -.12); hinge.add(glow);
  // mug + steam
  const mugM = pmat("mug", 0xf1e9dc);
  const mug = G(g, .2, .57, -.04); mug.add(mk(jitter(new THREE.CylinderGeometry(.032, .028, .07, 12), .002), mugM, 0, .035, 0));
  const handle = ring(.018, .006, mugM, 12); handle.position.set(.035, .038, 0); handle.rotation.y = Math.PI / 2; mug.add(handle);
  mug.add(mk(new THREE.CylinderGeometry(.028, .028, .004, 12), pmat("coffee", 0x4a2c1c), 0, .066, 0));
  const steam = [0, 1, 2].map(i => { const s = new THREE.Mesh(new THREE.SphereGeometry(.014, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .4, depthWrite: false })); mug.add(s); return s; });
  // succulent
  const pot = G(g, -.22, .57, -.06); pot.add(mk(jitter(new THREE.CylinderGeometry(.03, .024, .045, 8), .002), pmat("pot", 0xc46a3f), 0, .022, 0));
  for (let i = 0; i < 6; i++) { const l = egg(.012, .03, .008, pmat("leaf", 0x5c9a48), 0, .06, 0, 1); l.rotation.set(Math.cos(i) * .5, i, Math.sin(i * 1.7) * .6); pot.add(l); }
  // a floating code window above the desk, facing the audience, typing itself
  const cc = document.createElement("canvas"); cc.width = 512; cc.height = 300;
  const codeTex = new THREE.CanvasTexture(cc); codeTex.encoding = THREE.sRGBEncoding;
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(.5, .293), new THREE.MeshBasicMaterial({ map: codeTex, transparent: true, depthWrite: false }));
  panel.scale.setScalar(1.45); panel.position.set(-.8, 1.12, -.25); panel.rotation.y = .3; g.add(panel);
  const CODE = [["#c792ea", "const emma = new Developer({"], ["#c3e88d", '  name: "Emma", city: "Swieqi",'], ["#c3e88d", '  stack: ["Next.js", "Node", ".NET"],'], ["#f78c6c", '  loves: ["karaoke", "capybaras"],'], ["#c792ea", "});"], ["#89ddff", "emma.ship();  // again"]];
  let lastChars = -1;
  const drawCode = n => {
    const x = cc.getContext("2d"); x.clearRect(0, 0, 512, 300);
    x.fillStyle = "rgba(20,22,32,.92)"; x.beginPath(); x.roundRect(4, 4, 504, 292, 18); x.fill();
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => { x.fillStyle = c; x.beginPath(); x.arc(28 + i * 20, 26, 6, 0, TAU); x.fill(); });
    x.font = "20px 'IBM Plex Mono', monospace"; let left = n, y = 72;
    for (const [col, txt] of CODE) { const s = txt.slice(0, Math.max(0, left)); x.fillStyle = col; x.fillText(s, 24, y); left -= txt.length; if (left < 0) { x.fillStyle = "#ffcc66"; x.fillRect(24 + x.measureText(s).width + 2, y - 18, 10, 22); break; } y += 36; }
    codeTex.needsUpdate = true;
  };
  const total = CODE.reduce((s, [, l]) => s + l.length, 0);
  g.userData.update = (t, a) => {
    const n = Math.floor(((t * 14) % (total + 40)));
    if (n !== lastChars) { drawCode(n); lastChars = n; }
    glow.intensity = 1.6 * a;
    steam.forEach((s, i) => { const k = (t * .5 + i / 3) % 1; s.position.set(Math.sin(t * 2 + i) * .01, .08 + k * .12, 0); s.scale.setScalar(.6 + k); s.material.opacity = .35 * (1 - k) * a; });
  };
  return g;
}

// acoustic guitar: two bouts, sound hole, bridge, neck, headstock with pegs, six strings
function buildGuitar() {
  const g = new THREE.Group(), top = pmat("gtop", 0xd8a05c), side = pmat("gside", 0x7a4526), neck = pmat("gneck", 0x4a2d1c), metal = pmat("gstr", 0xe8e2d0, { roughness: .2, specularIntensity: .8 });
  g.add(egg(.115, .12, .04, top, 0, 0, 0));
  g.add(egg(.088, .088, .038, top, 0, .14, 0));
  const rim = egg(.119, .124, .03, side, 0, 0, -.012); g.add(rim); g.add(egg(.092, .092, .03, side, 0, .14, -.012));
  const hole = new THREE.Mesh(new THREE.CircleGeometry(.03, 24), pmat("ghole", 0x1a0f08)); hole.position.set(0, .08, .041); g.add(hole);
  const rosette = ring(.034, .003, pmat("gros", 0x2a1a10), 24); rosette.position.set(0, .08, .041); g.add(rosette);
  g.add(box(.07, .012, .008, neck, 0, -.05, .042));
  g.add(box(.03, .28, .02, neck, 0, .33, .01));
  for (let i = 0; i < 8; i++) g.add(box(.031, .002, .021, metal, 0, .22 + i * .03, .012));
  g.add(box(.045, .07, .018, neck, 0, .5, .008));
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) g.add(mk(new THREE.CylinderGeometry(.004, .004, .02, 6), metal, s * .028, .48 + i * .018, .008).rotateZ(Math.PI / 2));
  for (let i = 0; i < 6; i++) g.add(box(.0016, .52, .002, metal, -.0125 + i * .005, .22, .044));
  return g;
}

// handheld microphone: grip, gold band, faceted mesh head
function buildMic() {
  const g = new THREE.Group();
  const grip = mk(jitter(new THREE.CylinderGeometry(.013, .01, .12, 10), .001), pmat("micgrip", 0x1e1f24, { roughness: .35 })); grip.rotation.x = Math.PI / 2; g.add(grip);
  const band = ring(.014, .004, pmat("micband", 0xd9b35a, { roughness: .25, metalness: .8 }), 14); band.position.z = .06; g.add(band);
  g.add(mk(new THREE.IcosahedronGeometry(.026, 1), pmat("michead", 0xb8bcc6, { roughness: .3, metalness: .7 }), 0, 0, .085));
  return g;
}

// an open book (two covers, page blocks, one page that flips) and Japanese/Korean flashcards orbiting
function buildBook() {
  const g = new THREE.Group(), cover = pmat("cover", 0xb0413e), paper = pmat("paper", 0xf6efe0, { roughness: .9 });
  for (const s of [-1, 1]) {
    const half = G(g, 0, 0, 0); half.rotation.y = -s * .38;
    half.add(box(.13, .18, .006, cover, s * .066, 0, -.004));
    half.add(box(.122, .17, .014, paper, s * .062, 0, .006));
  }
  const pageT = canvasTex(128, 180, (x, W, H) => { x.fillStyle = "#f6efe0"; x.fillRect(0, 0, W, H); x.fillStyle = "rgba(60,40,30,.5)"; for (let i = 0; i < 14; i++) x.fillRect(12, 16 + i * 11, 70 + (i * 37) % 34, 3); x.font = "28px serif"; x.fillStyle = "#b0413e"; x.fillText("猫", 84, 50); });
  const flipper = G(g, 0, 0, .014);
  const page = new THREE.Mesh(new THREE.PlaneGeometry(.12, .168), new THREE.MeshStandardMaterial({ map: pageT, side: THREE.DoubleSide, roughness: .9 }));
  page.position.x = .06; flipper.add(page);
  g.userData.update = (t, a) => { const k = (t * .35) % 1; flipper.rotation.y = -.38 + Math.PI * .76 * smooth(.6, .95, k); page.position.z = .002 + .01 * Math.sin(Math.PI * smooth(.6, .95, k)); };
  return g;
}
function buildCards() {
  const g = new THREE.Group();
  const card = (glyph, col) => new THREE.Mesh(new THREE.PlaneGeometry(.11, .14), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, map: canvasTex(160, 200, (x, W, H) => {
    x.fillStyle = "#fffaf0"; x.beginPath(); x.roundRect(4, 4, W - 8, H - 8, 16); x.fill(); x.strokeStyle = col; x.lineWidth = 6; x.stroke();
    x.fillStyle = col; x.font = "96px 'Zen Kaku Gothic New', 'Hiragino Sans', sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(glyph, W / 2, H / 2 + 6);
  }) }));
  const cards = [["あ", "#d9534f"], ["한", "#2f6fb0"], ["猫", "#3f8f5a"], ["글", "#8a4fb0"]].map(([gl, c]) => { const m = card(gl, c); g.add(m); return m; });
  g.userData.update = (t, a) => cards.forEach((m, i) => {
    const ang = t * .6 + i * TAU / cards.length;
    m.position.set(Math.cos(ang) * .42, 1.05 + Math.sin(t * 1.3 + i) * .05, Math.sin(ang) * .3 + .05);
    m.rotation.y = Math.sin(ang) * .3; m.rotation.z = Math.sin(t + i) * .12;
    m.material.opacity = a;
  });
  return g;
}

// a capybara sidekick: barrel body, blocky head, blunt snout, little ears, content closed eyes, a yuzu on its head
function buildCapy() {
  const g = new THREE.Group(), fur = pmat("capy", 0x9a6a43), dark = pmat("capyDark", 0x6b4529), light = pmat("capyLight", 0xb98a5e), ink = pmat("capyInk", 0x1e140e, { roughness: .3 });
  const body = G(g, 0, 0, 0);
  body.add(egg(.17, .13, .24, fur, 0, .2, -.02));
  for (const [x, z] of [[-.09, .12], [.09, .12], [-.09, -.14], [.09, -.14]]) body.add(egg(.035, .06, .04, dark, x, .07, z, 1));
  const head = G(body, 0, .27, .2); head.rotation.x = .25;
  head.add(egg(.09, .085, .12, fur, 0, 0, 0));
  head.add(egg(.075, .065, .06, light, 0, -.015, .1));
  for (const s of [-1, 1]) {
    head.add(egg(.008, .012, .006, ink, s * .022, .01, .158, 1));                       // nostrils
    const eye = new THREE.Mesh(new THREE.TorusGeometry(.012, .003, 6, 12, Math.PI), ink); eye.position.set(s * .062, .03, .07); eye.rotation.set(0, s * .9, Math.PI); head.add(eye);
    const ear = egg(.018, .016, .01, dark, s * .055, .075, -.04, 1); head.add(ear); ear.userData.s = s;
  }
  const yz = G(head, .005, .1, -.01);
  yz.add(egg(.042, .038, .042, pmat("yuzu", 0xf5b335, { roughness: .45 }), 0, .03, 0));
  const leaf = egg(.02, .006, .012, pmat("leaf", 0x5c9a48), .02, .07, 0, 1); leaf.rotation.z = -.5; yz.add(leaf);
  g.userData.update = (t, a) => {
    body.scale.y = 1 + .02 * Math.sin(t * 2.2);
    head.rotation.x = .25 + .06 * Math.sin(t * .9);
    head.children.forEach(c => { if (c.userData.s) c.rotation.z = c.userData.s * (.2 + .25 * Math.max(0, Math.sin(t * 3)) ** 8); });
    yz.rotation.z = .08 * Math.sin(t * 1.4);
  };
  return g;
}

// floating music notes for the guitar and the karaoke
function buildNotes() {
  const g = new THREE.Group(), ink = pmat("note", 0x1d1b22, { roughness: .3, specularIntensity: .6 });
  const notes = Array.from({ length: 6 }, (_, i) => {
    const n = new THREE.Group();
    n.add(egg(.026, .02, .014, ink, 0, 0, 0, 1)); n.add(box(.006, .08, .006, ink, .022, .04, 0));
    if (i % 2) n.add(box(.04, .012, .006, ink, .04, .078, 0)); else { const f = box(.022, .006, .006, ink, .032, .07, 0); f.rotation.z = -.6; n.add(f); }
    g.add(n); return n;
  });
  g.userData.update = (t, a) => notes.forEach((n, i) => {
    const k = (t * .28 + i / notes.length) % 1;
    n.position.set(-.35 + (i % 3) * .3 + Math.sin(t * 2 + i) * .06, .7 + k * .7, .1 + (i % 2) * .1);
    n.rotation.z = Math.sin(t * 2 + i) * .3; n.scale.setScalar(a * Math.sin(Math.PI * k) * 1.2);
  });
  return g;
}

// karaoke spotlight: a soft cone from above
function buildSpot() {
  const g = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(.5, 1.8, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff0c8, transparent: true, opacity: .1, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
  cone.position.y = .95; g.add(cone);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(.45, 32), new THREE.MeshBasicMaterial({ color: 0xfff0c8, transparent: true, opacity: .18, depthWrite: false, blending: THREE.AdditiveBlending }));
  pool.rotation.x = -Math.PI / 2; pool.position.y = .005; g.add(pool);
  g.userData.update = (t, a) => { cone.material.opacity = .1 * a; pool.material.opacity = .18 * a; };
  return g;
}


// rolling suitcase: hard shell with ribs, telescoping handle, wheels, travel stickers (Brazil, Italy, Malta, a capybara)
function buildSuitcase() {
  const g = new THREE.Group(), shell = pmat("case", 0xd9693f, { roughness: .4, specularIntensity: .45 }), dark = pmat("caseDark", 0x2b2d33, { roughness: .4 });
  g.add(mk(deform(jitter(new THREE.BoxGeometry(.3, .44, .16, 3, 4, 2), .004), v => { const k = .02; v.x *= 1 - k * (v.y / .22) ** 2; }), shell, 0, .26, 0));
  for (let i = 0; i < 4; i++) g.add(box(.008, .4, .17, pmat("caseRib", 0xc45a32), -.105 + i * .07, .26, 0));
  for (const s of [-1, 1]) for (const z of [-.05, .05]) { const w = mk(new THREE.CylinderGeometry(.022, .022, .02, 12), dark, s * .11, .022, z); w.rotation.z = Math.PI / 2; g.add(w); }
  for (const s of [-1, 1]) g.add(box(.012, .3, .012, dark, s * .07, .62, -.05));
  g.add(box(.17, .025, .03, dark, 0, .775, -.05));
  const sticker = (draw, x, y, r) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 24), new THREE.MeshStandardMaterial({ map: canvasTex(128, 128, draw), roughness: .5 })); m.position.set(x, y, .082); g.add(m); };
  sticker((x, W) => { x.fillStyle = "#1f9b4a"; x.beginPath(); x.arc(64, 64, 62, 0, TAU); x.fill(); x.fillStyle = "#f7d038"; x.beginPath(); x.moveTo(64, 14); x.lineTo(118, 64); x.lineTo(64, 114); x.lineTo(10, 64); x.fill(); x.fillStyle = "#2b4a9a"; x.beginPath(); x.arc(64, 64, 26, 0, TAU); x.fill(); }, -.07, .36, .045);
  sticker((x, W) => { x.fillStyle = "#fff"; x.beginPath(); x.arc(64, 64, 62, 0, TAU); x.fill(); x.save(); x.beginPath(); x.arc(64, 64, 62, 0, TAU); x.clip(); x.fillStyle = "#1f9b4a"; x.fillRect(0, 0, 43, 128); x.fillStyle = "#d9433a"; x.fillRect(85, 0, 43, 128); x.restore(); }, .07, .4, .04);
  sticker((x, W) => { x.fillStyle = "#fff"; x.beginPath(); x.arc(64, 64, 62, 0, TAU); x.fill(); x.save(); x.beginPath(); x.arc(64, 64, 62, 0, TAU); x.clip(); x.fillStyle = "#cf2a36"; x.fillRect(64, 0, 64, 128); x.restore(); x.fillStyle = "#aaa"; x.fillRect(16, 20, 18, 18); }, .06, .18, .038);
  sticker((x, W) => { x.fillStyle = "#f6efe2"; x.beginPath(); x.arc(64, 64, 62, 0, TAU); x.fill(); x.fillStyle = "#9a6a43"; x.beginPath(); x.ellipse(70, 72, 40, 28, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(38, 58, 22, 20, 0, 0, TAU); x.fill(); x.fillStyle = "#f5b335"; x.beginPath(); x.arc(42, 34, 12, 0, TAU); x.fill(); }, -.06, .16, .042);
  return g;
}

// grand piano, seen side-on: curved case, lid propped open, keyboard facing Emma, three legs, pedals, a score
function buildPiano() {
  const g = new THREE.Group(), lac = pmat("pianoLac", 0x141112, { roughness: .22, specularIntensity: .9, clearcoat: 1, clearcoatRoughness: .08 }), gold = pmat("gold", 0xd9b35a, { roughness: .3, metalness: .7 }), inner = pmat("pianoInner", 0xb98a4a, { roughness: .5 });
  // top-view outline of the case: keyboard edge at y = 0, straight bass side, curved treble side, rounded tail
  const outline = new THREE.Shape();
  outline.moveTo(-.3, 0); outline.lineTo(.3, 0); outline.lineTo(.3, .32); outline.bezierCurveTo(.3, .55, -.02, .5, -.08, .82); outline.quadraticCurveTo(-.12, .98, -.3, .96); outline.lineTo(-.3, 0);
  const caseG = new THREE.ExtrudeGeometry(outline, { depth: .17, bevelEnabled: true, bevelThickness: .008, bevelSize: .008, bevelSegments: 2, curveSegments: 24 });
  caseG.rotateX(Math.PI / 2); caseG.translate(0, .66, 0);                      // shape y -> +z (away from the keys), extrusion goes down
  g.add(mk(caseG, lac));
  const soundboard = new THREE.Mesh(new THREE.ShapeGeometry(outline, 24).rotateX(Math.PI / 2), inner); soundboard.position.y = .64; soundboard.scale.set(.94, 1, .94); g.add(soundboard);
  for (let k = 0; k < 14; k++) g.add(box(.004, .004, .7 - k * .02, gold, -.24 + k * .035, .646, .38));     // strings
  const lid = G(g, -.3, .667, 0); lid.rotation.z = .62;                         // hinged on the bass side, propped open
  const lidG = new THREE.ExtrudeGeometry(outline, { depth: .012, bevelEnabled: false, curveSegments: 24 }); lidG.rotateX(Math.PI / 2); lidG.translate(.3, .012, 0);
  lid.add(mk(lidG, lac));
  g.add(bar(V3(.28, .66, .32), V3(.3 - Math.cos(.62) * 0 + .02, .66 + .36, .32), .006, gold));             // lid prop stick
  for (const [x, z] of [[-.25, .06], [.25, .06], [-.22, .86]]) g.add(mk(jitter(new THREE.CylinderGeometry(.03, .022, .49, 8), .002), lac, x, .245, z));
  g.add(box(.62, .05, .1, lac, 0, .565, -.05));                                 // key bed
  const keysTex = canvasTex(512, 64, (x, W, H) => { x.fillStyle = "#f8f5ec"; x.fillRect(0, 0, W, H); x.fillStyle = "#c9c4b8"; for (let i = 0; i <= 36; i++) x.fillRect(i * W / 36, 0, 1.5, H); x.fillStyle = "#16120f"; for (let i = 0; i < 36; i++) { if ([0, 1, 3, 4, 5].includes(i % 7)) x.fillRect((i + 1) * W / 36 - 5, 0, 10, H * .6); } });
  const keys = new THREE.Mesh(new THREE.PlaneGeometry(.58, .09), new THREE.MeshStandardMaterial({ map: keysTex, roughness: .4 })); keys.rotation.x = -Math.PI / 2; keys.rotation.z = Math.PI; keys.position.set(0, .592, -.06); g.add(keys);
  for (const s of [-1, 1]) g.add(box(.025, .06, .11, lac, s * .3, .59, -.05));
  const score = new THREE.Mesh(new THREE.PlaneGeometry(.26, .15), new THREE.MeshStandardMaterial({ map: canvasTex(256, 150, (x, W, H) => { x.fillStyle = "#f6efe0"; x.fillRect(0, 0, W, H); x.strokeStyle = "#555"; for (let s = 0; s < 3; s++) for (let l = 0; l < 5; l++) { x.beginPath(); x.moveTo(10, 18 + s * 44 + l * 6); x.lineTo(W - 10, 18 + s * 44 + l * 6); x.stroke(); } x.fillStyle = "#222"; for (let n = 0; n < 24; n++) { x.beginPath(); x.ellipse(20 + n * 10, 18 + (n % 3) * 44 + (n * 7) % 24, 3.5, 2.6, -.4, 0, TAU); x.fill(); } }), side: THREE.DoubleSide }));
  score.position.set(0, .74, .02); score.rotation.set(.25, Math.PI, 0); g.add(score);
  g.add(box(.3, .01, .03, lac, 0, .67, .0));
  const lyre = G(g, 0, .1, .02); lyre.add(box(.06, .16, .02, lac, 0, .08, 0)); for (const s of [-1, 0, 1]) lyre.add(box(.018, .008, .03, gold, s * .022, .0, -.01));
  const lamp = new THREE.PointLight(0xffc880, 0, 1.2, 2); lamp.position.set(0, 1.0, .3); g.add(lamp);
  g.userData.update = (t, a) => { lamp.intensity = 1.1 * a; };
  return g;
}

// park bench: slatted seat and back, cast-iron sides
function buildBench() {
  const g = new THREE.Group(), wood = pmat("benchWood", 0x9a6a3c), iron = pmat("iron", 0x2a2d33, { roughness: .4 });
  for (let k = 0; k < 4; k++) g.add(box(.9, .022, .055, wood, 0, .245, -.04 - k * .065));
  for (let k = 0; k < 3; k++) { const s = box(.9, .055, .02, wood, 0, .34 + k * .075, -.27); s.rotation.x = -.18; g.add(s); }
  for (const s of [-1, 1]) { g.add(box(.03, .25, .26, iron, s * .4, .12, -.12)); g.add(box(.03, .3, .03, iron, s * .4, .4, -.27)); g.add(box(.03, .03, .22, iron, s * .4, .33, -.12)); }
  return g;
}

// Claude: a little orange spark with a friendly face, floating at Emma's side from the AI lab onward
function buildClaude() {
  const g = new THREE.Group(), body = G(g), orange = pmat("claude", 0xd97757, { roughness: .45, specularIntensity: .4 }), face = pmat("claudeFace", 0xf4ece2, { roughness: .6 }), ink = pmat("claudeInk", 0x2a1c16, { roughness: .3 });
  const rays = G(body);
  for (let k = 0; k < 11; k++) {
    const a = k / 11 * TAU + (k % 2) * .06, len = .085 + (k % 3) * .012;
    const ray = mk(jitter(new THREE.CapsuleGeometry(.018, len, 4, 8), .002), orange); ray.position.set(Math.cos(a) * (len / 2 + .045), Math.sin(a) * (len / 2 + .045), 0); ray.rotation.z = a - Math.PI / 2; ray.scale.z = .7; rays.add(ray);
  }
  rays.add(mk(new THREE.SphereGeometry(.062, 24, 16), orange));
  const disc = mk(new THREE.SphereGeometry(.05, 24, 16), face, 0, 0, .03); disc.scale.z = .45; body.add(disc);
  const eyes = [-1, 1].map(s => { const e = mk(new THREE.SphereGeometry(.009, 10, 8), ink, s * .017, .008, .052); e.scale.y = 1.3; body.add(e); return e; });
  const smileM = new THREE.Mesh(new THREE.TorusGeometry(.012, .0028, 6, 14, Math.PI), ink); smileM.rotation.z = Math.PI; smileM.position.set(0, -.012, .053); body.add(smileM);
  for (const s of [-1, 1]) { const ch = new THREE.Mesh(new THREE.CircleGeometry(.008, 12), new THREE.MeshBasicMaterial({ color: 0xf2a08a, transparent: true, opacity: .7 })); ch.position.set(s * .03, -.006, .053); body.add(ch); }
  const halo = new THREE.Mesh(new THREE.CircleGeometry(.2, 32), new THREE.MeshBasicMaterial({ map: softDot("rgba(255,170,120,1)"), transparent: true, opacity: .45, depthWrite: false, blending: THREE.AdditiveBlending })); halo.position.z = -.03; body.add(halo);
  const sparkles = [0, 1, 2].map(i => { const s = mk(new THREE.OctahedronGeometry(.012), pmat("spark", 0xffd2a0, { emissive: 0xffa060, emissiveIntensity: .6 })); body.add(s); return s; });
  g.userData.update = (t, a) => {
    rays.rotation.z = t * .5; body.position.y = Math.sin(t * 2.1) * .03; body.rotation.z = Math.sin(t * 1.3) * .08;
    const blink = (t % 4) < .12; eyes.forEach(e => (e.scale.y = blink ? .2 : 1.3));
    sparkles.forEach((s, i) => { const k = (t * .6 + i / 3) % 1; s.position.set(Math.cos(i * 2.1 + t) * .13, -.05 + k * .25, .02); s.scale.setScalar(Math.sin(k * Math.PI) * 1.2); s.rotation.y = t * 3; });
  };
  return g;
}

// compact camera held up to the face, with a flash that fires every few seconds
function buildCamera() {
  const g = new THREE.Group(), body = pmat("camBody", 0xe8e2d6, { roughness: .4 }), dark = pmat("camDark", 0x22242a, { roughness: .35 });
  g.add(box(.15, .09, .05, body));
  g.add(box(.15, .03, .052, dark, 0, -.03, 0));
  const lens = mk(new THREE.CylinderGeometry(.03, .034, .04, 20), dark, 0, 0, .04); lens.rotation.x = Math.PI / 2; g.add(lens);
  const glass = new THREE.Mesh(new THREE.CircleGeometry(.022, 20), new THREE.MeshPhysicalMaterial({ color: 0x3a5a8a, roughness: .05, clearcoat: 1 })); glass.position.z = .061; g.add(glass);
  g.add(box(.03, .015, .01, dark, -.05, .052, 0));
  const flashM = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .2 });
  const flash = new THREE.Mesh(new THREE.PlaneGeometry(.03, .016), flashM); flash.position.set(.045, .03, .027); g.add(flash);
  const burst = new THREE.Mesh(new THREE.CircleGeometry(.25, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); burst.position.set(.045, .03, .05); g.add(burst);
  const light = new THREE.PointLight(0xffffff, 0, 2, 2); light.position.set(0, 0, .2); g.add(light);
  g.userData.update = (t, a) => { const k = (t % 3.2), f = k < .12 ? 1 - k / .12 : 0; burst.material.opacity = f * .8 * a; burst.scale.setScalar(.5 + f); light.intensity = 6 * f * a; flashM.opacity = .2 + .8 * f; };
  return g;
}

// striped popcorn bucket, heaped, with a few kernels hopping out
function buildPopcorn() {
  const g = new THREE.Group();
  const stripes = new THREE.MeshStandardMaterial({ map: canvasTex(256, 64, (x, W, H) => { for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 ? "#f6efe2" : "#d9433a"; x.fillRect(i * W / 16, 0, W / 16 + 1, H); } x.fillStyle = "#f2c14e"; x.fillRect(0, 22, W, 20); x.fillStyle = "#d9433a"; x.font = "bold 16px sans-serif"; x.fillText("POPCORN  POPCORN  POPCORN", 6, 38); }), roughness: .6, side: THREE.DoubleSide });
  g.add(mk(new THREE.CylinderGeometry(.075, .055, .15, 18, 1, true), stripes, 0, .075, 0));
  g.add(mk(new THREE.CircleGeometry(.055, 18).rotateX(-Math.PI / 2), pmat("bucketBase", 0xd9433a), 0, .002, 0));
  const kern = pmat("kernel", 0xfff4d6, { roughness: .8 }), r = mulberry32(8);
  for (let i = 0; i < 26; i++) { const a = r() * TAU, d = r() * .065; g.add(egg(.016 + r() * .006, .013, .015, kern, Math.cos(a) * d, .15 + r() * .03 + (.065 - d) * .4, Math.sin(a) * d, 1)); }
  const pops = [0, 1, 2].map(() => { const k = egg(.015, .013, .014, kern, 0, .2, 0, 1); g.add(k); return k; });
  g.userData.update = (t, a) => pops.forEach((k, i) => { const u = (t * .7 + i / 3) % 1; k.position.set(Math.sin(i * 2.1) * .04 * u, .17 + Math.sin(u * Math.PI) * .12, Math.cos(i * 2.1) * .04 * u); k.rotation.set(u * 6, u * 4, 0); k.visible = a > .5; });
  return g;
}

// ---- more interaction poses ----
function addPull(P, t, a) {   // a hand on the suitcase handle, the other on the hip
  if (a <= 0) return;
  mixArm(P.arms.R, { sx: -.05, sz: .42, ex: -.12, ez: 0, hy: 0, curl: 1.15, thumb: 1.2 }, a);
  mixArm(P.arms.L, { sx: .15, sz: -.95, ez: 2.0, ex: -.2, curl: 1.1, thumb: 1.2 }, a);
  P.headZ += .06 * a; P.smile = Math.max(P.smile, 1); P.headY += -.15 * a;
}
function addPiano(P, t, a) {  // both hands on the keys, wider than typing, swaying with the music
  if (a <= 0) return;
  const run = Math.sin(t * 2.2);
  mixArm(P.arms.L, { sx: -1.0, sz: -.28 - .1 * run, ex: -.7, ez: .35, hy: .2, curl: .3 + .4 * Math.max(0, Math.sin(t * 9)), thumb: .6 }, a);
  mixArm(P.arms.R, { sx: -1.0, sz: .28 - .1 * run, ex: -.7, ez: -.35, hy: -.2, curl: .3 + .4 * Math.max(0, Math.sin(t * 9 + 2)), thumb: .6 }, a);
  P.headX += .14 * a; P.headZ += .1 * Math.sin(t * 1.1) * a; P.hipRoll += .04 * Math.sin(t * 1.1) * a;
  P.eyes = a > .5 && Math.sin(t * .6) > -.3 ? "happy" : P.eyes; P.smile = Math.max(P.smile, 1);
}
function addPopcorn(P, t, a) { // bucket in one arm, the other hand going from bucket to mouth
  if (a <= 0) return;
  mixArm(P.arms.L, { sx: -.75, sz: -.2, ex: -1.25, ez: .65, hy: .5, curl: .9, thumb: .9 }, a);
  const e = Math.max(0, Math.sin(t * 1.6)) ** 2;
  mixArm(P.arms.R, { sx: lerp(-.7, -1.05, e), sz: lerp(.25, .3, e), ex: lerp(-1.0, -2.15, e), ez: lerp(-.45, -.55, e), hy: -.4, curl: .7, thumb: .6 }, a);
  P.mouthO = Math.max(P.mouthO, e > .7 ? (e - .7) * 3 * a : 0); P.wide = Math.max(P.wide, .3 * a); P.headX += -.04 * a;
}


function addSit(P, a) {       // sitting on the bench: thighs forward, shins down, hips lowered onto the seat
  if (a <= 0) return;
  for (const k of ["L", "R"]) { const L = P.legs[k]; L.hx = lerp(L.hx, -1.45, a); L.kx = lerp(L.kx, 1.45, a); L.hz = lerp(L.hz, (k === "L" ? -1 : 1) * .12, a); L.hy = lerp(L.hy, 0, a); }
  P.y -= .155 * a; P.lean += .04 * a;
}
function addSelfie(P, t, a) { // camera out at arm's length, a peace sign by the cheek, a big smile
  if (a <= 0) return;
  mixArm(P.arms.R, { sx: -1.2, sz: 1.05, ex: -.55, ez: -.2, hy: .6, curl: 1.0, thumb: 1.1 }, a);
  mixArm(P.arms.L, { sx: -.55, sz: -.35, ex: -2.15, ez: .5, hy: -1.2, curl: .2, thumb: 1.2 }, a);
  P.headZ += -.16 * a; P.headY += .25 * a; P.grin = Math.max(P.grin, a * (Math.sin(t * .8) > -.2 ? 1 : 0)); P.eyes = a > .5 && Math.sin(t * .8) > .5 ? "happy" : P.eyes;
}
function addPair(P, t, a) {   // pair-programming: turned toward Claude, explaining with one hand
  if (a <= 0) return;
  const g = .5 + .5 * Math.sin(t * 2.4);
  mixArm(P.arms.L, { sx: -.9 - .2 * g, sz: -.45, ex: -1.0, ez: .3, hy: -.9, curl: .1, thumb: .3 }, a);
  mixArm(P.arms.R, { sx: .05, sz: .95, ez: -2.0, ex: -.2, curl: 1.1, thumb: 1.2 }, a);
  P.headY += -.45 * a; P.headX += -.06 * a; P.mouth = Math.max(P.mouth, talkEnv(t) * a * (Math.sin(t * .9) > 0 ? 1 : .2)); P.brow += .3 * a;
}

// ---- interaction poses ----
function addType(P, t, a) {   // typing at the standing desk, glancing at the screen
  if (a <= 0) return;
  mixArm(P.arms.L, { sx: -1.0, sz: -.1, ex: -.75, ez: .2, hy: .2, curl: .35 + .35 * Math.max(0, Math.sin(t * 13)), thumb: .6 }, a);
  mixArm(P.arms.R, { sx: -1.0, sz: .1, ex: -.75, ez: -.2, hy: -.2, curl: .35 + .35 * Math.max(0, Math.sin(t * 13 + 1.9)), thumb: .6 }, a);
  P.headX += .2 * a; P.headY += .06 * Math.sin(t * .8) * a; P.smile = Math.max(P.smile, .6);
}
function addGuitar(P, t, a) { // left hand on the neck, right hand strumming over the sound hole
  if (a <= 0) return;
  mixArm(P.arms.L, { sx: -1.25, sz: -.55, ex: -1.25, ez: .55, hy: -.7, curl: .8, thumb: .9 }, a);
  mixArm(P.arms.R, { sx: -.55, sz: .2, ex: -1.05, ez: -.7 + .22 * Math.sin(t * 9), hy: .3, curl: .45, thumb: .8 }, a);
  P.headZ += .12 * Math.sin(t * 1.6) * a; P.headX += .08 * a; P.hipRoll += .03 * Math.sin(t * 1.6) * a;
  P.eyes = a > .5 && Math.sin(t * .7) > .2 ? "happy" : P.eyes; P.smile = Math.max(P.smile, 1);
}
function addSing(P, t, a) {   // mic to the mouth, other arm out wide, swaying
  if (a <= 0) return;
  mixArm(P.arms.R, { sx: -1.15, sz: .35, ex: -1.75, ez: -.45, hy: .4, curl: 1.15, thumb: 1.2 }, a);
  mixArm(P.arms.L, { sx: -.3, sz: -1.55 - .2 * Math.sin(t * 2.5), ex: -.35, ez: .1, hy: -1.4, curl: 0, thumb: .3 }, a);
  P.mouth = Math.max(P.mouth, (.45 + .55 * talkEnv(t * .8)) * a); P.headX += -.1 * a; P.hipRoll += .06 * Math.sin(t * 3) * a; P.twist += .08 * Math.sin(t * 1.5) * a;
  P.eyes = a > .5 && Math.sin(t * 1.1) > 0 ? "happy" : P.eyes; P.brow += .4 * a;
}
function addRead(P, t, a) {   // holding the book open, eyes down, a little nod
  if (a <= 0) return;
  mixArm(P.arms.L, { sx: -.95, sz: -.15, ex: -1.15, ez: .55, hy: .9, curl: .55, thumb: .4 }, a);
  mixArm(P.arms.R, { sx: -.95, sz: .15, ex: -1.15, ez: -.55, hy: -.9, curl: .55, thumb: .4 }, a);
  P.headX += (.22 + .03 * Math.sin(t * 1.2)) * a; P.brow += .25 * a;
}
function addPet(P, t, a) {    // reaching down to pet the capybara's head
  if (a <= 0) return;
  mixArm(P.arms.L, { sx: -1.15 + .14 * Math.sin(t * 4), sz: -.05, ex: -.15, ez: .1, hy: -1.2, curl: .1, thumb: .4 }, a);
  P.headX += .2 * a; P.lean += .08 * a; P.eyes = a > .5 ? "happy" : P.eyes; P.smile = Math.max(P.smile, 1);
}

function buildProps(E) {
  const world = new THREE.Group();   // follows Emma's position and scale, but not her turn
  const desk = buildDesk(); desk.position.set(0, 0, .3); world.add(desk);
  const cards = buildCards(); cards.scale.setScalar(1.4); cards.position.y = -.42; world.add(cards);
  const capy = buildCapy(); capy.scale.setScalar(1.5); capy.position.set(.56, 0, .24); capy.rotation.y = -Math.PI / 2 - .25; world.add(capy);
  const notes = buildNotes(); world.add(notes);
  const spot = buildSpot(); world.add(spot);
  const guitar = buildGuitar(); guitar.scale.setScalar(1.3); guitar.position.set(.05, .04, .21); guitar.rotation.set(-.1, -.12, .95); E.rig.chest.add(guitar);
  const book = buildBook(); book.scale.setScalar(1.25); book.position.set(0, .16, .28); book.rotation.x = -.75; E.rig.chest.add(book);
  const mic = buildMic(); mic.scale.setScalar(1.7); mic.position.set(0, -.06, .02); mic.rotation.x = -.35; E.rig.arms.R.hand.add(mic);
  const suitcase = buildSuitcase(); suitcase.position.set(.3, 0, .06); suitcase.rotation.y = -.35; world.add(suitcase);
  const piano = buildPiano(); piano.position.set(.34, 0, -.12); piano.rotation.y = Math.PI / 2; world.add(piano);
  const bench = buildBench(); bench.position.set(0, 0, .02); world.add(bench);
  const claude = buildClaude(); claude.scale.setScalar(1.25); world.add(claude);
  const camera = buildCamera(); camera.position.set(0, -.07, .02); E.rig.arms.R.hand.add(camera);
  const popcorn = buildPopcorn(); popcorn.position.set(-.06, .02, .24); E.rig.chest.add(popcorn);
  const all = { desk, cards, capy, notes, spot, guitar, book, mic, suitcase, piano, camera, popcorn, bench, claude };
  for (const o of Object.values(all)) { o.traverse(m => { if (m.isMesh) { m.castShadow = !m.material.transparent; m.receiveShadow = true; } }); o.userData.base = o.scale.x; o.visible = false; }
  return { world, all, amt: Object.fromEntries(Object.keys(all).map(k => [k, 0])) };
}
// pop each prop in with a little overshoot when its scene settles, shrink it away when Emma walks on
function updateProps(PR, want, t) {
  for (const [k, o] of Object.entries(PR.all)) {
    PR.amt[k] = approach(PR.amt[k], want.has(k) ? 1 : 0, .1);
    const a = PR.amt[k];
    o.visible = a > .01;
    if (!o.visible) continue;
    o.scale.setScalar(o.userData.base * Math.max(.001, easeBack(a)));
    if (o.userData.update) o.userData.update(t, a);
  }
}

// fourteen blocks: each scene owns its sky, set, ground, screens and the thing Emma does there
const PROJECTS = 'Some things I made: <a href="https://tesify.app/" target="_blank" rel="noopener">Tesify</a>, <a href="https://meetnow.vercel.app/" target="_blank" rel="noopener">Meetnow</a>, NovelBr and a rich text editor.';
const SCENES = [
  { env: "hills", slug: "EXT. Hills of Brazil, sunrise", line: "Hi, I'm Emma. Friends call me Leli. I love a good sunrise, so this film starts with one.",
    sky: ["#33406e", "#f7a56c"], haze: "#8a6a8e", mid: "#3d6b4a", ground: "#4f8a3c", night: 0, sea: 0,
    fact: { title: "Origin", chips: ["Brazilian-Italian", "Sunrise lover", "Emma · Leli", "@jecrs687"] } },
  { env: "airport", slug: "INT. Departures hall, morning", line: "Digital nomad: Brazil, then Italy, now Malta. Everything I need fits in one suitcase.",
    sky: ["#7fb6e8", "#e6f0f6"], haze: "#a9c3dc", mid: "#7a8aa0", ground: "#b9b6ae", night: 0, sea: 0,
    fact: { title: "Languages", bars: [["Português", 100], ["Italiano", 100], ["English", 100]], chips: ["learning 日本語", "learning 한국어"] } },
  { env: "city", slug: "EXT. The city, day", line: "By day I build for the web and for phones, from the front end down to the database.",
    sky: ["#5ba7e3", "#d3ecf8"], haze: "#8fb6d6", mid: "#5a6f8f", ground: "#7c7f8a", night: 0, sea: 0,
    fact: { title: "Everyday stack", bars: [["Next.js", 90], ["Node.js", 90], ["TypeScript", 90], ["React Native", 90], [".NET Core", 85], ["Python", 85], ["SQL", 85]] } },
  { env: "studio", slug: "INT. Home studio, afternoon", line: "Most days look like this: a laptop, a terminal and a coffee going cold.",
    sky: ["#6aa8de", "#f3e2c4"], haze: "#9ab3cf", mid: "#6b6f86", ground: "#a47c56", night: 0, sea: 0,
    fact: { title: "Small builds", chips: ["Border Creator", "Box-shadow generator", "Bin2Dec", "Calculator"] } },
  { env: "ailab", slug: "INT. The lab, pair-programming hour", line: "I usually work close to AI. Meet my pair programmer: Claude. From here on, it tags along.",
    sky: ["#3a4a7a", "#8a9ac8"], haze: "#5a6a9a", mid: "#3a4260", ground: "#4a4e62", night: .3, sea: 0,
    fact: { title: "How I work", chips: ["AI pair programming", "Claude by my side", "Prompt · review · ship", "Creative coder"] } },
  { env: "workshop", slug: "EXT. The workshop, golden hour", line: PROJECTS,
    sky: ["#4d77c4", "#ffe0b0"], haze: "#c89a9a", mid: "#6a4d5e", ground: "#8c6e58", night: 0, sea: 0,
    fact: { title: "Projects", links: [["Tesify", "https://tesify.app/"], ["Meetnow", "https://meetnow.vercel.app/"]], chips: ["NovelBr", "Rich text editor"] } },
  { env: "park", slug: "EXT. Bandstand in the park, sunset", line: "Guitar on a park bench at sunset. Music is my favourite language.",
    sky: ["#5a3a7a", "#ff9a62"], haze: "#6b4a78", mid: "#34452f", ground: "#5d7a46", night: .2, sea: 0,
    fact: { title: "Music", chips: ["Guitar", "Piano", "J-pop", "K-pop", "Karaoke nights"] } },
  { env: "lounge", slug: "INT. Piano lounge, evening", line: "And when the night gets quiet, the piano.",
    sky: ["#2a2350", "#6a4a6a"], haze: "#3a3050", mid: "#2a2a30", ground: "#5a3a2a", night: .55, sea: 0,
    fact: { title: "Close to the metal", bars: [["C", 95], ["C++", 90], ["Assembly", 80], ["VHDL", 80]] } },
  { env: "karaoke", slug: "INT. Karaoke box, night", line: "J-pop, K-pop, anything with a key change. Hand me the mic.",
    sky: ["#1a1440", "#3a1f5c"], haze: "#2a1d48", mid: "#2b1a40", ground: "#2a1f3a", night: .85, sea: 0,
    fact: { title: "Always up for", chips: ["Karaoke", "J-pop", "K-pop", "Friends"] } },
  { env: "tokyo", slug: "EXT. Back street in Tokyo, night", line: "Anime and J-pop pulled me down a rabbit hole I never climbed out of. Selfie first.",
    sky: ["#14163a", "#47265a"], haze: "#2a2348", mid: "#1d1a2e", ground: "#34303f", night: .9, sea: 0,
    fact: { title: "Anime & J-pop", chips: ["Anime", "J-pop", "Learning 日本語", "ありがとう"] } },
  { env: "tvroom", slug: "INT. Living room, late night", line: "K-dramas, anime and far too much popcorn. Just one more episode.",
    sky: ["#1a1a3a", "#3a2a50"], haze: "#2a2448", mid: "#2a2238", ground: "#5a4a6a", night: .85, sea: 0,
    fact: { title: "Watchlist", chips: ["K-dramas", "Anime", "Learning 한국어", "One more episode"] } },
  { env: "books", slug: "INT. Corner bookshop, late evening", line: "Reading, writing, and learning Japanese and Korean one flashcard at a time. 一文字ずつ, 한 글자씩.",
    sky: ["#1d2450", "#5a4060"], haze: "#3a3050", mid: "#3a2a28", ground: "#6b4a34", night: .65, sea: 0,
    fact: { title: "Reading & writing", links: [["Articles on DEV", "https://dev.to/jecrs687"], ["Medium", "https://medium.com/@jecrs687"]], chips: ["日本語", "한국어"] } },
  { env: "coast", slug: "EXT. Malta coast, dusk", line: "Every story needs a sidekick. Mine is a capybara with a yuzu on its head.",
    sky: ["#3b2c5e", "#f08a5d"], haze: "#6b4a78", mid: "#4a3b55", ground: "#c7ae84", night: .35, sea: 1,
    fact: { title: "Also in the cloud", bars: [["AWS", 60], ["Google Cloud", 60], ["MongoDB", 60], ["Flutter", 54]] } },
  { env: "sea", slug: "EXT. Swieqi, Malta, night", line: "Now I live by the sea in Malta. Loyal to my friends, and I love my sister Aurora.",
    sky: ["#101a3e", "#283668"], haze: "#1f2a52", mid: "#1b2140", ground: "#3a3a52", night: 1, sea: 1,
    fact: { title: "Based in", chips: ["Swieqi, Malta", "Digital nomad", "Creative coder", "Friends first"] } },
  { env: "rooftop", slug: "EXT. Rooftop, festa night", line: "That's the trailer. Let's make the full movie together.",
    sky: ["#060a1c", "#1a1d48"], haze: "#151a3c", mid: "#12162e", ground: "#2a2a40", night: 1, sea: 1 },
];
SCENES.forEach((s, i) => (s.slug = `Scene ${i + 1} · ${s.slug}`));
const N = SCENES.length;

// ---------- helpers ----------
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(",")})`; };
const mixArr = (a, b, t) => { const A = hex(a), B = hex(b); return A.map((v, i) => lerp(v, B[i], t)); };
const rgb = a => `rgb(${a.map(Math.round).join(",")})`;
const rgba = (a, al) => `rgba(${a.map(Math.round).join(",")},${al})`;
function keyed(keys, p) {
  for (let i = 0; i < keys.length - 1; i++) { const [p0, c0] = keys[i], [p1, c1] = keys[i + 1]; if (p <= p1) return mixArr(c0, c1, clamp((p - p0) / (p1 - p0), 0, 1)); }
  return hex(keys[keys.length - 1][1]);
}
function keyedN(keys, p) { for (let i = 0; i < keys.length - 1; i++) { const [p0, a] = keys[i], [p1, b] = keys[i + 1]; if (p <= p1) return lerp(a, b, clamp((p - p0) / (p1 - p0), 0, 1)); } return keys[keys.length - 1][1]; }
function rand(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
const centre = i => (i + .5) / N;
const keysOf = f => SCENES.map((s, i) => [centre(i), f(s)]);
const SKY_TOP = keysOf(s => s.sky[0]), SKY_BOT = keysOf(s => s.sky[1]), GROUND = keysOf(s => s.ground);
const NIGHT = keysOf(s => s.night);
const envIndex = env => SCENES.findIndex(s => s.env === env);

// ---------- canvas ----------
const cv = document.getElementById("world");
let ctx = cv.getContext("2d");
let W = 0, H = 0, DPR = 1, GROUND_Y = 0, stars = [];
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, LOW ? 1.25 : 2);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  GROUND_Y = H * 0.78;
  const r = rand(7); stars = Array.from({ length: 160 }, () => [r(), r() * .62, r() * 1.4 + .3, r() * 6]);
}
function items(seed, count, spread) { const r = rand(seed), out = []; for (let i = 0; i < count; i++) out.push({ u: i / count + r() * spread, a: r(), b: r(), c: r() }); return out; }
const CLOUDS = items(51, N * 2, .03);
const sceneOf = u => clamp(Math.floor(u * N), 0, N - 1);
function neon(text, x, y, size, color, t, flick = 0, font = "'Dela Gothic One', sans-serif") {
  ctx.save(); ctx.font = `${size}px ${font}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.shadowColor = color; ctx.shadowBlur = size * .6; ctx.fillStyle = color;
  ctx.globalAlpha *= flick ? .75 + .25 * Math.sin(t / 90 + flick) * Math.sin(t / 37) : 1;
  ctx.fillText(text, x, y); ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.globalAlpha *= .6; ctx.fillText(text, x, y); ctx.restore();
}
function glow(x, y, r, col, a = .5) { const g = ctx.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, col.replace("A", a)); g.addColorStop(1, col.replace("A", 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
function rrect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function cloudPath(x, y, s) {
  const p = new Path2D(), puffs = [[-1.3, .42], [-.6, .7], [.15, .9], [.85, .62], [1.4, .38]];
  p.moveTo(x - 1.75 * s, y);
  for (const [dx, r] of puffs) p.arc(x + dx * s, y - r * s * .55, r * s, Math.PI, 0);
  p.lineTo(x + 1.75 * s, y); p.closePath(); return p;
}
function cloud(x, y, s, lit, shade) {
  ctx.fillStyle = shade; ctx.fill(cloudPath(x, y + s * .12, s));
  ctx.fillStyle = lit; ctx.fill(cloudPath(x - s * .08, y, s * .94));
}

// ---------- interior sets: painted walls on a fast layer, so walking in feels like stepping into a room ----------
function drawSet(env, x0, x1, t) {
  const base = GROUND_Y, w = x1 - x0, T = t / 1000;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, w, base); ctx.clip();
  const grad = (a, b) => { const g = ctx.createLinearGradient(0, 0, 0, base); g.addColorStop(0, a); g.addColorStop(1, b); return g; };
  if (env === "airport") {
    ctx.fillStyle = grad("#eef1f4", "#d6dbe2"); ctx.fillRect(x0, 0, w, base);
    // tall glass wall onto the apron, a plane taking off on a loop
    const gx = x0 + w * .05, gy = H * .08, gw = w * .55, gh = base - gy - H * .12;
    const sky = ctx.createLinearGradient(0, gy, 0, gy + gh); sky.addColorStop(0, "#8cc4f0"); sky.addColorStop(1, "#eaf3f8"); ctx.fillStyle = sky; ctx.fillRect(gx, gy, gw, gh);
    ctx.fillStyle = "#b9c0c8"; ctx.fillRect(gx, gy + gh * .78, gw, gh * .22);
    const k = (T / 7) % 1, px = gx + gw * (-.1 + k * 1.3), py = gy + gh * (.75 - Math.max(0, k - .25) * .9);
    ctx.save(); ctx.translate(px, py); ctx.rotate(-Math.max(0, Math.min(.25, (k - .25) * 1.2))); ctx.fillStyle = "#f7f8fa";
    rrect(-46, -6, 92, 12, 6); ctx.fill(); ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(18, 22); ctx.lineTo(26, 22); ctx.lineTo(14, 0); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-38, -4); ctx.lineTo(-48, -22); ctx.lineTo(-40, -22); ctx.lineTo(-28, -4); ctx.fill(); ctx.fillStyle = "#e0484a"; ctx.fillRect(-48, -22, 8, 8); ctx.restore();
    ctx.strokeStyle = "#8a96a6"; ctx.lineWidth = 6; for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(gx + gw * i / 4, gy); ctx.lineTo(gx + gw * i / 4, gy + gh); ctx.stroke(); } ctx.strokeRect(gx, gy, gw, gh);
    // split-flap departures board
    const bx = x0 + w * .64, by = H * .1, bw = Math.min(W * .3, 320), bh = H * .3;
    ctx.fillStyle = "#16181d"; rrect(bx, by, bw, bh, 8); ctx.fill();
    ctx.fillStyle = "#ffcf3a"; ctx.font = "13px 'IBM Plex Mono', monospace"; ctx.textAlign = "left"; ctx.fillText("DEPARTURES · PARTENZE · PARTIDAS", bx + 14, by + 22);
    const rows = [["SÃO PAULO", "GRU", "DEPARTED"], ["ROMA", "FCO", "LANDED"], ["MALTA", "MLA", "BOARDING"], ["TOKYO", "HND", "SOON"], ["SEOUL", "ICN", "SOON"]];
    rows.forEach(([city, code, st], i) => {
      const ry = by + 50 + i * (bh - 60) / rows.length;
      const flip = Math.floor(T * 6 + i * 3) % 18 === 0;
      ctx.fillStyle = "#24272e"; ctx.fillRect(bx + 10, ry - 14, bw - 20, 20);
      ctx.fillStyle = flip ? "#999" : "#f2f2f2"; ctx.fillText(city.padEnd(10), bx + 16, ry);
      ctx.fillStyle = "#9fb4c8"; ctx.fillText(code, bx + bw * .55, ry);
      ctx.fillStyle = st === "BOARDING" ? (Math.sin(T * 6) > 0 ? "#5fe08d" : "#2f7a4a") : st === "SOON" ? "#ffcf3a" : "#8a8f99"; ctx.fillText(st, bx + bw * .7, ry);
    });
    // clock and gate sign
    const cx = bx + bw / 2, cy = by + bh + 50; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy, 24, 0, 7); ctx.fill(); ctx.strokeStyle = "#2b2f38"; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(T / 3) * 16, cy + Math.sin(T / 3) * 16); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(T / 36) * 10, cy + Math.sin(T / 36) * 10); ctx.stroke();
    neon("Bem-vindo · Benvenuti · Merħba", x0 + w * .3, H * .05, 16, "#2f6fb0", t, 0, "'IBM Plex Mono', monospace");
    for (let k = 0; k < 6; k++) { const cx = x0 + w * .08 + k * 46; ctx.fillStyle = "#2f6fb0"; rrect(cx, base - 58, 40, 30, 6); ctx.fill(); ctx.fillStyle = "#24589a"; ctx.fillRect(cx, base - 30, 40, 8); ctx.fillStyle = "#555"; ctx.fillRect(cx + 18, base - 22, 4, 22); }
    for (const fx of [.5, .97]) { const px = x0 + w * fx; ctx.fillStyle = "#c46a3f"; ctx.fillRect(px - 16, base - 40, 32, 40); ctx.fillStyle = "#4f8a4a"; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(px + (k - 2.5) * 7, base - 66, 6, 26, (k - 2.5) * .3, 0, 7); ctx.fill(); } }
    ctx.fillStyle = "#ffcf3a"; rrect(x0 + w * .64, base - H * .26, 130, 34, 4); ctx.fill(); ctx.fillStyle = "#16181d"; ctx.font = "16px 'Dela Gothic One', sans-serif"; ctx.fillText("GATE 7  →", x0 + w * .64 + 12, base - H * .26 + 23);
  } else if (env === "ailab") {
    ctx.fillStyle = grad("#232a44", "#2f3756"); ctx.fillRect(x0, 0, w, base);
    ctx.strokeStyle = "rgba(140,170,255,.07)"; ctx.lineWidth = 1; for (let x = x0; x < x1; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, base); ctx.stroke(); } for (let y = 0; y < base; y += 40) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
    // the wall screen: a chat with Claude on the left, a terminal with tests on the right
    const sx = x0 + w * .5, sy = H * .1, sw = Math.min(W * .44, 480), sh = H * .36;
    ctx.fillStyle = "#0f1220"; rrect(sx - 10, sy - 10, sw + 20, sh + 20, 14); ctx.fill();
    ctx.fillStyle = "#f4efe6"; rrect(sx, sy, sw * .58, sh, 8); ctx.fill();
    ctx.fillStyle = "#d97757"; ctx.font = "13px 'IBM Plex Mono', monospace"; ctx.textAlign = "left"; ctx.fillText("✳ Claude", sx + 14, sy + 22);
    const msgs = [["me", "can we ship the new scene today?"], ["ai", "Yes. Tests first, then we ship."], ["me", "deal. you write, I review"], ["ai", "On it. 3 files changed ✓"]];
    const shown = 1 + Math.floor((T * .6) % (msgs.length + 1));
    msgs.slice(0, Math.min(shown, msgs.length)).forEach(([who, m], i) => {
      const my = sy + 40 + i * (sh - 52) / 4, bw = Math.min(sw * .5, 14 + m.length * 7.2), bx = who === "me" ? sx + sw * .58 - bw - 12 : sx + 12;
      ctx.fillStyle = who === "me" ? "#3a4a8a" : "#ead9c8"; rrect(bx, my, bw, 26, 10); ctx.fill();
      ctx.fillStyle = who === "me" ? "#fff" : "#3a2a20"; ctx.font = "12px 'Zen Kaku Gothic New', sans-serif"; ctx.fillText(m, bx + 8, my + 17);
    });
    const tx = sx + sw * .6, tw = sw * .4; ctx.fillStyle = "#0b0e18"; rrect(tx, sy, tw, sh, 8); ctx.fill();
    ctx.font = "12px 'IBM Plex Mono', monospace"; const lines = ["$ pnpm test", "✓ scene.spec.ts", "✓ hair.spec.ts", "✓ props.spec.ts", "42 passed", "$ git push"];
    lines.slice(0, 1 + Math.floor((T * 1.2) % 7)).forEach((l, i) => { ctx.fillStyle = l.startsWith("✓") || l.includes("passed") ? "#5fe08d" : "#cfd6ff"; ctx.fillText(l, tx + 10, sy + 24 + i * 20); });
    glow(sx + sw / 2, sy + sh / 2, sw * .8, "rgba(120,150,255,A)", .16);
    // server rack with blinking lights, a plant, a "think · build · ship" neon
    const rx = x0 + w * .16; ctx.fillStyle = "#151827"; ctx.fillRect(rx, base - H * .46, 70, H * .46);
    for (let i = 0; i < 12; i++) { ctx.fillStyle = "#22263a"; ctx.fillRect(rx + 6, base - H * .44 + i * H * .034, 58, H * .026); ctx.fillStyle = Math.sin(T * (3 + i) + i) > .3 ? "#5fe08d" : "#2a5a3a"; ctx.fillRect(rx + 52, base - H * .44 + i * H * .034 + 4, 5, 4); ctx.fillStyle = Math.sin(T * (2 + i * .7)) > .6 ? "#ffb04a" : "#4a3a20"; ctx.fillRect(rx + 44, base - H * .44 + i * H * .034 + 4, 5, 4); }
    neon("think · build · ship", x0 + w * .3, H * .1, 20, "#d97757", t, 5);
    ctx.fillStyle = "#c46a3f"; ctx.fillRect(x0 + w * .86, base - 50, 34, 50); ctx.fillStyle = "#4f8a4a"; for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.ellipse(x0 + w * .86 + 17 + (k - 3) * 7, base - 70 - Math.abs(k - 3) * -5, 6, 26, (k - 3) * .3, 0, 7); ctx.fill(); }
  } else if (env === "studio") {
    ctx.fillStyle = grad("#efe2cc", "#d9c4a4"); ctx.fillRect(x0, 0, w, base);
    ctx.fillStyle = "#c9ae88"; ctx.fillRect(x0, base - H * .14, w, H * .14);
    ctx.fillStyle = "rgba(0,0,0,.06)"; for (let x = x0; x < x1; x += 34) ctx.fillRect(x, base - H * .14, 2, H * .14);
    const wx = x0 + w * .58, wy = H * .14, ww = Math.min(W * .34, 340), wh = H * .36;
    const sg = ctx.createLinearGradient(0, wy, 0, wy + wh); sg.addColorStop(0, "#7cb4e6"); sg.addColorStop(1, "#f6dcb4"); ctx.fillStyle = sg; ctx.fillRect(wx, wy, ww, wh);
    ctx.fillStyle = "#8a93ab"; for (let i = 0; i < 9; i++) { const bh = wh * (.25 + ((i * 37) % 10) / 22); ctx.fillRect(wx + i * ww / 9, wy + wh - bh, ww / 9 - 4, bh); }
    ctx.fillStyle = "rgba(255,255,255,.8)"; cloud(wx + ww * ((T / 40) % 1), wy + 30, 14, "#ffffff", "#e8eef6");
    ctx.strokeStyle = "#f7f1e6"; ctx.lineWidth = 8; ctx.strokeRect(wx, wy, ww, wh); ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.stroke();
    const sx = x0 + w * .45, sy = H * .34;
    ctx.fillStyle = "#8a5f3c"; ctx.fillRect(sx, sy, 200, 10);
    ["#d9623f", "#2f6f8f", "#e3b23c", "#5b8c5a", "#7a5a9a"].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(sx + 10 + i * 16, sy - 40 - (i % 2) * 8, 13, 40 + (i % 2) * 8); });
    ctx.fillStyle = "#c46a3f"; ctx.fillRect(sx + 120, sy - 24, 30, 24); ctx.fillStyle = "#4f8a4a";
    for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.ellipse(sx + 135 + (k - 2) * 8, sy - 34 + Math.abs(k - 2) * 4, 6, 16, (k - 2) * .4, 0, 7); ctx.fill(); }
    const px = x0 + w * .22; ctx.fillStyle = "#2b2f3a"; ctx.fillRect(px, H * .1, 110, 140); ctx.fillStyle = "#f2c14e"; ctx.font = "32px 'Dela Gothic One', sans-serif"; ctx.textAlign = "center"; ctx.fillText("</>", px + 55, H * .1 + 80);
    neon("ship it", x0 + w * .78, H * .58, 26, "#ff6fa8", t, 2);
    { const cx = x0 + w * .42, cy = H * .14; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, 7); ctx.fill(); ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(T / 2) * 15, cy + Math.sin(T / 2) * 15); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(T / 24) * 9, cy + Math.sin(T / 24) * 9); ctx.stroke(); }
    ["#ffe066", "#ff9ec4", "#9fe0ff", "#b6f29a"].forEach((c, i) => { ctx.save(); ctx.translate(x0 + w * .22 + 130 + (i % 2) * 34, H * .14 + Math.floor(i / 2) * 36); ctx.rotate((i - 1.5) * .08); ctx.fillStyle = c; ctx.fillRect(0, 0, 28, 28); ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fillRect(4, 8, 18, 2); ctx.fillRect(4, 14, 14, 2); ctx.restore(); });
    { const hx = x0 + w * .72, hy = H * .3; ctx.strokeStyle = "#2b2f3a"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(hx, hy, 18, Math.PI, 0); ctx.stroke(); ctx.fillStyle = "#2b2f3a"; ctx.fillRect(hx - 23, hy - 2, 10, 18); ctx.fillRect(hx + 13, hy - 2, 10, 18); }
    const lx = x0 + w * .5; ctx.strokeStyle = "#3a3a3a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H * .1); ctx.stroke();
    ctx.fillStyle = "#2f3440"; ctx.beginPath(); ctx.moveTo(lx - 26, H * .1 + 22); ctx.lineTo(lx + 26, H * .1 + 22); ctx.lineTo(lx + 12, H * .1); ctx.lineTo(lx - 12, H * .1); ctx.fill();
    glow(lx, H * .1 + 30, 160, "rgba(255,228,170,A)", .45);
  } else if (env === "lounge") {
    ctx.fillStyle = grad("#1f3a36", "#14282a"); ctx.fillRect(x0, 0, w, base);
    ctx.fillStyle = "#4a2e1e"; ctx.fillRect(x0, base - H * .2, w, H * .2); ctx.fillStyle = "rgba(255,220,160,.08)"; for (let x = x0; x < x1; x += 60) ctx.fillRect(x, base - H * .2, 2, H * .2);
    // curtained window onto the night
    const wx = x0 + w * .58, wy = H * .1, ww = Math.min(W * .26, 260), wh = H * .38;
    ctx.fillStyle = "#16204a"; ctx.fillRect(wx, wy, ww, wh); ctx.fillStyle = "#f4c86a"; for (let i = 0; i < 16; i++) ctx.fillRect(wx + (i * 41) % ww, wy + wh * .55 + (i * 17) % (wh * .4), 4, 5);
    ctx.fillStyle = "#7a1f2a"; for (const s of [-1, 1]) { ctx.beginPath(); const cx = s < 0 ? wx - 10 : wx + ww + 10; ctx.moveTo(cx, wy - 12); ctx.quadraticCurveTo(cx + s * -40, wy + wh * .5, cx + s * -10, wy + wh + 10); ctx.lineTo(cx + s * 26, wy + wh + 10); ctx.lineTo(cx + s * 26, wy - 12); ctx.fill(); }
    // framed paintings
    [[.14, "#d98a4a"], [.3, "#5a8ac8"]].forEach(([f, c], i) => { const fx = x0 + w * f, fy = H * .16; ctx.fillStyle = "#c9a35a"; ctx.fillRect(fx - 6, fy - 6, 112, 92); ctx.fillStyle = c; ctx.fillRect(fx, fy, 100, 80); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.arc(fx + 30 + i * 30, fy + 34, 18, 0, 7); ctx.fill(); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(fx, fy + 56, 100, 24); });
    // chandelier
    const cx = x0 + w * .45; ctx.strokeStyle = "#c9a35a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H * .08); ctx.stroke();
    glow(cx, H * .1, 200, "rgba(255,210,140,A)", .45);
    for (let i = 0; i < 5; i++) { const a = i / 4 * Math.PI, lx = cx + Math.cos(a) * 40, ly = H * .1 + Math.sin(a) * 10; ctx.fillStyle = "#ffe2a0"; ctx.beginPath(); ctx.arc(lx, ly, 5, 0, 7); ctx.fill(); }
    neon("♪ live tonight", x0 + w * .3, H * .5, 22, "#ffd27a", t, 3);
    { const bx = x0 + w * .83, by = H * .3; ctx.fillStyle = "#3a2418"; ctx.fillRect(bx - 70, by, 140, 6); ctx.fillRect(bx - 70, by + 60, 140, 6);
      for (let k = 0; k < 9; k++) { const c = ["#2f7a4a", "#8a2a2a", "#d9b35a", "#5a3a8a"][k % 4]; ctx.fillStyle = c; ctx.fillRect(bx - 64 + k * 15, by - 30, 9, 30); ctx.fillRect(bx - 62 + k * 15, by - 38, 5, 8); ctx.fillStyle = "rgba(255,255,255,.3)"; ctx.fillRect(bx - 62 + k * 15, by - 26, 2, 18); }
      glow(bx, by + 30, 90, "rgba(255,190,110,A)", .25); }
    for (const fx of [.12, .38]) { const tx = x0 + w * fx, ty = base - 40; ctx.fillStyle = "#2a1a12"; ctx.fillRect(tx - 3, ty, 6, 40); ctx.beginPath(); ctx.ellipse(tx, ty, 34, 8, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#f2e6d0"; ctx.fillRect(tx - 3, ty - 18, 6, 14); glow(tx, ty - 22, 26, "rgba(255,200,120,A)", .8); ctx.fillStyle = "#ffd27a"; ctx.beginPath(); ctx.ellipse(tx, ty - 22 + Math.sin(T * 12 + fx * 9), 2.5, 5, 0, 0, 7); ctx.fill(); }
  } else if (env === "karaoke") {
    ctx.fillStyle = grad("#1c1236", "#3a1b52"); ctx.fillRect(x0, 0, w, base);
    ctx.strokeStyle = "rgba(255,255,255,.05)"; ctx.lineWidth = 1; for (let x = x0; x < x1; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 40, base); ctx.stroke(); }
    const sx = x0 + w * .55, sy = H * .13, sw = Math.min(W * .3, 300), sh = H * .24;
    ctx.fillStyle = "#0d0b1a"; ctx.fillRect(sx - 8, sy - 8, sw + 16, sh + 16); const sgr = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh); sgr.addColorStop(0, "#3a2a7a"); sgr.addColorStop(1, "#b0408a"); ctx.fillStyle = sgr; ctx.fillRect(sx, sy, sw, sh);
    for (let i = 0; i < 12; i++) { ctx.fillStyle = `rgba(255,255,255,${.1 + .1 * Math.sin(T * 3 + i)})`; ctx.beginPath(); ctx.arc(sx + (i * 53 + T * 30) % sw, sy + 20 + (i * 29) % (sh * .4), 2 + i % 3, 0, 7); ctx.fill(); }
    const prog = (T / 3) % 1; ctx.font = "16px 'Zen Kaku Gothic New', sans-serif"; ctx.textAlign = "left";
    ["♪ きみの こえが きこえる", "♪ 너의 목소리가 들려"].forEach((l, i) => { const lyY = sy + sh * .62 + i * 24; ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillText(l, sx + 18, lyY); if (i === 0) { ctx.save(); ctx.beginPath(); ctx.rect(sx + 18, lyY - 16, (sw - 36) * prog, 22); ctx.clip(); ctx.fillStyle = "#ffe066"; ctx.fillText(l, sx + 18, lyY); ctx.restore(); } });
    neon("カラオケ", x0 + w * .22, H * .16, 40, "#ff4fa3", t, 1);
    neon("노래방", x0 + w * .3, H * .3, 34, "#3fe0ff", t, 4);
    for (let i = 0; i < 26; i++) { const a = T * .7 + i * .9, dx = x0 + ((i * 97 + Math.sin(a) * 120) % w + w) % w, dy = H * (.06 + ((i * 53) % 60) / 100); ctx.fillStyle = ["rgba(255,90,180,.35)", "rgba(80,220,255,.35)", "rgba(255,230,90,.35)"][i % 3]; ctx.beginPath(); ctx.arc(dx, dy, 4 + (i % 3), 0, 7); ctx.fill(); }
    const db = x0 + w * .42; ctx.strokeStyle = "#888"; ctx.beginPath(); ctx.moveTo(db, 0); ctx.lineTo(db, H * .06); ctx.stroke(); // disco ball
    const dg = ctx.createRadialGradient(db - 6, H * .08 - 6, 2, db, H * .08, 18); dg.addColorStop(0, "#fff"); dg.addColorStop(1, "#7a7a90"); ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(db, H * .08, 18, 0, 7); ctx.fill();
    { const sx2 = x0 + w * .7, sy2 = base; ctx.fillStyle = "#6a2a6a"; rrect(sx2 - 90, sy2 - 70, 180, 50, 14); ctx.fill(); rrect(sx2 - 100, sy2 - 40, 200, 40, 10); ctx.fill();
      ctx.fillStyle = "#1c1428"; ctx.fillRect(sx2 - 50, sy2 - 26, 100, 8); ctx.fillStyle = "#ffcf3a"; ctx.beginPath(); ctx.ellipse(sx2 - 30, sy2 - 34, 7, 9, .4, 0, 7); ctx.fill(); ctx.fillStyle = "#3fe0ff"; ctx.beginPath(); ctx.ellipse(sx2 - 16, sy2 - 34, 7, 9, -.4, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(255,140,200,.7)"; ctx.fillRect(sx2 + 18, sy2 - 44, 10, 18); ctx.fillStyle = "rgba(140,230,255,.7)"; ctx.fillRect(sx2 + 34, sy2 - 42, 10, 16); }
    for (const fx of [.06, .9]) { const kx = x0 + w * fx; ctx.fillStyle = "#121018"; ctx.fillRect(kx, base - H * .3, 60, H * .3); ctx.fillStyle = "#2b2838"; const pulse = 1 + .08 * Math.max(0, Math.sin(T * 8)); ctx.beginPath(); ctx.arc(kx + 30, base - H * .2, 20 * pulse, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(kx + 30, base - H * .08, 14, 0, 7); ctx.fill(); }
  } else if (env === "tvroom") {
    ctx.fillStyle = grad("#2a2550", "#3c2f5a"); ctx.fillRect(x0, 0, w, base);
    // fairy lights garland
    ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.lineWidth = 1; ctx.beginPath(); for (let x = x0; x < x1; x += 8) ctx.lineTo(x, H * .06 + Math.sin((x - x0) / 60) * 14); ctx.stroke();
    for (let x = x0 + 10; x < x1; x += 30) { const y = H * .06 + Math.sin((x - x0) / 60) * 14 + 4; ctx.fillStyle = `rgba(255,${200 + (x % 50)},140,${.6 + .4 * Math.sin(T * 2 + x)})`; ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill(); }
    // the TV, playing an anime: sunset, falling sakura, a figure on a hill, subtitles
    const tx = x0 + w * .55, ty = H * .14, tw = Math.min(W * .34, 360), th = tw * .56;
    ctx.fillStyle = "#0b0b10"; rrect(tx - 10, ty - 10, tw + 20, th + 20, 10); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(tx, ty, tw, th); ctx.clip();
    const ag = ctx.createLinearGradient(0, ty, 0, ty + th); ag.addColorStop(0, "#ff9ab0"); ag.addColorStop(.6, "#ffc98a"); ag.addColorStop(1, "#7a5aa0"); ctx.fillStyle = ag; ctx.fillRect(tx, ty, tw, th);
    ctx.fillStyle = "#fff3c0"; ctx.beginPath(); ctx.arc(tx + tw * .7, ty + th * .55, th * .18, 0, 7); ctx.fill();
    ctx.fillStyle = "#4a3a6a"; ctx.beginPath(); ctx.moveTo(tx, ty + th); ctx.quadraticCurveTo(tx + tw * .4, ty + th * .62, tx + tw, ty + th * .8); ctx.lineTo(tx + tw, ty + th); ctx.fill();
    ctx.fillStyle = "#2a1f40"; ctx.fillRect(tx + tw * .38, ty + th * .6, 6, 26); ctx.beginPath(); ctx.arc(tx + tw * .38 + 3, ty + th * .58, 7, 0, 7); ctx.fill();
    for (let i = 0; i < 18; i++) { const k = (T * .15 + i / 18) % 1; ctx.fillStyle = "rgba(255,200,215,.9)"; ctx.beginPath(); ctx.ellipse(tx + ((i * 61 + T * 20) % tw), ty + k * th, 3, 2, i + T, 0, 7); ctx.fill(); }
    ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fillRect(tx, ty + th - 26, tw, 26); ctx.fillStyle = "#fff"; ctx.font = "13px 'Zen Kaku Gothic New', sans-serif"; ctx.textAlign = "center"; ctx.fillText(Math.sin(T * .5) > 0 ? "「また明日ね」 See you tomorrow" : "「다음 화 예고」 Next episode", tx + tw / 2, ty + th - 9);
    ctx.restore();
    glow(tx + tw / 2, ty + th / 2, tw * .9, "rgba(255,170,190,A)", .18);
    // manga shelf, a K-drama poster, a beanbag
    const sx = x0 + w * .14, sy = H * .22; ctx.fillStyle = "#5a3d2a"; for (let r = 0; r < 3; r++) ctx.fillRect(sx, sy + r * 52, 180, 6);
    const rr = rand(9); for (let r = 0; r < 3; r++) for (let x = sx + 4; x < sx + 176;) { const bw = 6 + rr() * 6; ctx.fillStyle = ["#e35a5a", "#f2f2f2", "#3a7ad0", "#f2c14e", "#222", "#ff8fd0"][Math.floor(rr() * 6)]; ctx.fillRect(x, sy + r * 52 - 40, bw, 40); x += bw + 1; }
    ctx.fillStyle = "#f4e6ef"; ctx.fillRect(x0 + w * .38, H * .12, 90, 130); ctx.fillStyle = "#e0507a"; ctx.font = "40px serif"; ctx.textAlign = "center"; ctx.fillText("♥", x0 + w * .38 + 45, H * .12 + 70); ctx.fillStyle = "#333"; ctx.font = "12px 'Zen Kaku Gothic New', sans-serif"; ctx.fillText("K-DRAMA · 드라마", x0 + w * .38 + 45, H * .12 + 110);
    ctx.fillStyle = "#e0a34a"; ctx.beginPath(); ctx.ellipse(x0 + w * .85, base - 26, 60, 34, 0, 0, 7); ctx.fill();
    { const lx = x0 + w * .95; ctx.fillStyle = "#2b2838"; ctx.fillRect(lx - 2, base - H * .42, 4, H * .42); ctx.fillStyle = "#f2dcb0"; ctx.beginPath(); ctx.moveTo(lx - 24, base - H * .42); ctx.lineTo(lx + 24, base - H * .42); ctx.lineTo(lx + 14, base - H * .48); ctx.lineTo(lx - 14, base - H * .48); ctx.fill(); glow(lx, base - H * .42, 120, "rgba(255,210,150,A)", .3); }
    ctx.fillStyle = "#2b2838"; rrect(x0 + w * .82, base - 22, 30, 12, 5); ctx.fill();
    ctx.fillStyle = "#c46a3f"; ctx.fillRect(x0 + w * .05, base - 44, 36, 44); ctx.fillStyle = "#4f8a4a"; for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.ellipse(x0 + w * .05 + 18 + (k - 3) * 8, base - 74, 7, 30, (k - 3) * .3, 0, 7); ctx.fill(); }
  } else if (env === "books") {
    ctx.fillStyle = "#3b2a22"; ctx.fillRect(x0, 0, w, base);
    const r = rand(5);
    for (let sh = 0; sh < 5; sh++) {
      const y = H * .08 + sh * H * .13;
      ctx.fillStyle = "#5a3d2a"; ctx.fillRect(x0, y + H * .1, w, 8);
      for (let x = x0 + 6; x < x1 - 12;) {
        const bw = 8 + r() * 12, bh = H * (.06 + r() * .04);
        if (x > x0 + w * .5 && x < x0 + w * .5 + Math.min(W * .28, 280) && sh < 3) { x += 14; continue; }
        ctx.fillStyle = ["#a8423a", "#3e6a8a", "#c99a3c", "#4f7a4a", "#7a4a7a", "#d8cbb0", "#2f3a5a"][Math.floor(r() * 7)];
        ctx.fillRect(x, y + H * .1 - bh, bw, bh); ctx.fillStyle = "rgba(255,255,255,.15)"; ctx.fillRect(x + 2, y + H * .1 - bh + 6, bw - 4, 2);
        x += bw + 1;
      }
    }
    const wx = x0 + w * .5, wy = H * .1, ww = Math.min(W * .28, 280), wh = H * .3;
    ctx.fillStyle = "#1a2350"; ctx.fillRect(wx, wy, ww, wh); ctx.fillStyle = "#f3eedb"; ctx.beginPath(); ctx.arc(wx + ww * .7, wy + wh * .3, 16, 0, 7); ctx.fill();
    for (let i = 0; i < 14; i++) { ctx.fillStyle = "rgba(220,230,255,.5)"; ctx.fillRect(wx + (i * 37) % ww, wy + ((i * 23 + T * 40) % wh), 1, 8); } // rain on the window
    ctx.strokeStyle = "#2a1c16"; ctx.lineWidth = 8; ctx.strokeRect(wx, wy, ww, wh);
    neon("BOOKS · 本 · 책", wx + ww / 2, wy + wh + 30, 22, "#ffd27a", t, 0);
    for (const fx of [.2, .82]) { const lx = x0 + w * fx, ly = H * .1; glow(lx, ly + 20, 200, "rgba(255,200,120,A)", .5); ctx.fillStyle = "#ffcf7a"; ctx.beginPath(); ctx.arc(lx, ly + 20, 9, 0, 7); ctx.fill(); }
    { const lx = x0 + w * .3; ctx.strokeStyle = "#8a5f3c"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(lx, base); ctx.lineTo(lx + 40, H * .08); ctx.moveTo(lx + 50, base); ctx.lineTo(lx + 90, H * .08); ctx.stroke(); ctx.lineWidth = 4; for (let k = 1; k < 9; k++) { const y = base - k * (base - H * .08) / 9, dx = 40 * (1 - (y - H * .08) / (base - H * .08)); ctx.beginPath(); ctx.moveTo(lx + dx, y); ctx.lineTo(lx + 50 + dx, y); ctx.stroke(); } }
    { const gx = x0 + w * .68, gy = base - 60; ctx.fillStyle = "#8a5f3c"; ctx.fillRect(gx - 3, gy, 6, 60); ctx.fillStyle = "#3e6a8a"; ctx.beginPath(); ctx.arc(gx, gy - 18, 22, 0, 7); ctx.fill(); ctx.fillStyle = "#6aa86a"; ctx.beginPath(); ctx.ellipse(gx - 6 + Math.sin(T) * 6, gy - 22, 10, 7, .5, 0, 7); ctx.fill(); ctx.strokeStyle = "#c9a35a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(gx, gy - 18, 26, -1.9, 1.9); ctx.stroke(); }
    ["あ", "한", "の", "글", "ア", "가"].forEach((ch, i) => { const k = (T * .08 + i / 6) % 1; ctx.globalAlpha = Math.sin(k * Math.PI) * .7; neon(ch, x0 + w * (.1 + i * .15) + Math.sin(T + i) * 20, base - k * base * .8, 22, "#ffd27a", t, 0, "'Zen Kaku Gothic New', sans-serif"); ctx.globalAlpha = 1; });
    ctx.fillStyle = "#e6d3a8"; ctx.save(); ctx.translate(x0 + w * .82, base - 30); ctx.rotate(-.1); ctx.fillRect(-40, -12, 80, 12); ctx.fillStyle = "#7a4a7a"; ctx.fillRect(-36, -26, 72, 14); ctx.fillStyle = "#3e6a8a"; ctx.fillRect(-30, -40, 64, 14); ctx.restore();
  }
  ctx.restore();
  ctx.fillStyle = env === "karaoke" || env === "tvroom" ? "#0d0a18" : env === "airport" ? "#9aa3ae" : "#3a271c";
  ctx.fillRect(x0 - 14, 0, 18, GROUND_Y); ctx.fillRect(x1 - 4, 0, 18, GROUND_Y);
}

// ---------- fireworks for the festa finale ----------
const FW = [];
function fireworks(t, k) {
  if (k <= 0) { FW.length = 0; return; }
  if (Math.random() < .07 * k) { const cx = W * (.15 + Math.random() * .7), cy = H * (.12 + Math.random() * .25), col = ["#ff6fa8", "#ffd27a", "#7fe6ff", "#b4ff8a", "#ff8a4a"][Math.floor(Math.random() * 5)]; for (let i = 0; i < 64; i++) { const a = i / 64 * TAU, sp = 1.8 + Math.random() * 1.6; FW.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, col }); } }
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = FW.length - 1; i >= 0; i--) { const f = FW[i]; f.x += f.vx; f.y += f.vy; f.vy += .025; f.vx *= .985; f.life -= .014; if (f.life <= 0) { FW.splice(i, 1); continue; } ctx.globalAlpha = f.life * k; ctx.strokeStyle = f.col; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x - f.vx * 4, f.y - f.vy * 4); ctx.stroke(); }
  ctx.restore(); ctx.globalAlpha = 1;
}

// ---------- the camera: a real perspective camera moving through the 3D world ----------
// Shot params: d distance · el elevation (rad, + looks down) · az orbit around Emma (0 = in front, ±π/2 = from the side
// of travel) · fy focus height on Emma · cx, cy where that focus sits on screen · r roll (dutch) · fov
// At a stop, scrolling keeps moving the camera through that scene's shot (push in, orbit, tilt).
// Between stops, every walk gets its own move: crane, low tracking, over-the-shoulder, head-on, aerial, handheld.
const FOV = 34;
const SHOT_DEF = { s: 1.2, fy: .6, cx: .4, cy: .54, r: 0, pitch: 0, orbit: 0, push: .22, rs: .015, ps: .06, os: .45 };
const SHOTS = {
  hills:    { s: 1.0, fy: .5, cx: .34, cy: .58, pitch: -.02, orbit: .1, push: .3, os: .35 },
  airport:  { s: 1.25, fy: .6, cx: .4, r: .02, pitch: .1, orbit: .4 },
  city:     { s: 1.1, fy: .72, cx: .38, cy: .5, r: -.03, pitch: -.12, orbit: -.3 },
  studio:   { s: 1.3, fy: .64, cx: .46, cy: .52, pitch: .2, orbit: .3 },
  ailab:    { s: 1.05, fy: .55, cx: .36, cy: .56, r: .02, pitch: .06, orbit: -.4, push: .16 },
  workshop: { s: .85, fy: .6, cx: .34, pitch: .02, orbit: .35 },
  park:     { s: 1.25, fy: .52, cx: .42, cy: .56, r: -.02, pitch: .12, orbit: -.4 },
  lounge:   { s: 1.3, fy: .6, cx: .4, r: .03, pitch: .14, orbit: .5 },
  karaoke:  { s: 1.35, fy: .72, cx: .44, cy: .52, r: -.04, rs: .03, pitch: -.12, orbit: .25 },
  tokyo:    { s: 1.15, fy: .66, cx: .42, r: .06, pitch: -.04, orbit: -.35 },
  tvroom:   { s: 1.3, fy: .66, cx: .42, pitch: .12, orbit: .4 },
  books:    { s: 1.25, fy: .66, cx: .42, pitch: .22, orbit: -.3 },
  coast:    { s: 1.1, fy: .5, cx: .38, pitch: .1, orbit: .55 },
  sea:      { s: 1.05, fy: .6, cx: .46, pitch: .02, orbit: -.15, os: .4 },
  rooftop:  { s: .95, fy: .5, cx: .5, cy: .6, pitch: -.1, orbit: 0, push: .2, os: .3 },
};
const P_KEYS = ["d", "el", "az", "fy", "cx", "cy", "r", "fov"];
function shotAt(i, hu) {
  const S = { ...SHOT_DEF, ...SHOTS[SCENES[i].env] }, u = clamp(hu, -1, 1), s = S.s + S.push * (u + 1) / 2;
  return { d: 5.4 / s, el: .1 + S.pitch + S.ps * u, az: S.orbit + S.os * u, fy: S.fy, cx: S.cx, cy: S.cy, r: S.r + S.rs * u, fov: FOV };
}
// one distinct move per walk, picked by which scene you're leaving
const WALK_MOVES = [
  w => ({ d: 8, el: .38 + .2 * Math.sin(w * Math.PI), az: .25, fy: .4, cx: .45, cy: .64, r: 0, fov: 40 }),                                  // crane up and over
  w => ({ d: 3.2, el: -.08, az: -.55 + w * .3, fy: .35, cx: .3, cy: .62, r: 0, fov: 42 }),                                                    // low ground-level tracking
  w => ({ d: 3.6, el: .2, az: -Math.PI / 2 - .35, fy: .75, cx: .38, cy: .55, r: .01, fov: 40 }),                                              // over the shoulder, looking ahead
  w => ({ d: 5, el: .12, az: Math.PI / 2 - .45, fy: .55, cx: .5, cy: .55, r: 0, fov: 30 }),                                                   // head-on: he walks toward camera
  w => ({ d: 14, el: .55, az: -.2 + w * .4, fy: .3, cx: .5, cy: .6, r: 0, fov: 30 }),                                                         // aerial wide
  w => ({ d: 3.4, el: .05, az: .6 + .15 * Math.sin(w * 9), fy: .6, cx: .4, cy: .54, r: .07 * Math.sin(w * 6), fov: 40 }),                     // handheld dutch side
  w => ({ d: 6, el: .3, az: .9 - w * 1.8, fy: .5, cx: .5, cy: .55, r: 0, fov: 34 }),                                                          // orbit sweep around him
];
const mixP = (a, b, u) => Object.fromEntries(P_KEYS.map(k => [k, lerp(a[k], b[k], u)]));
let CAMS = { a: 0, b: 0, w: 0, hu: 0, hold: true }, SHOT = null;
function currentShot() {
  if (CAMS.hold) return shotAt(CAMS.a, CAMS.hu);
  const w = CAMS.w, e = w * w * (3 - 2 * w), base = mixP(shotAt(CAMS.a, 1), shotAt(CAMS.b, -1), e);
  const move = WALK_MOVES[CAMS.a % WALK_MOVES.length](w), k = Math.sin(Math.PI * w) ** .6;
  return mixP(base, move, k);
}
const camTarget = new THREE.Vector3();
function placeCamera(cam, sh, X, EH) {
  const barT = document.querySelector(".bar.top").offsetHeight, barB = document.querySelector(".bar.bottom").offsetHeight;
  // on an upright phone: a wider lens, Emma centred, and kept below the fact card
  const tall = H > W;
  if (tall) sh = { ...sh, fov: sh.fov * 1.5, d: sh.d * .8, cx: .5 + (sh.cx - .5) * .25, cy: Math.max(sh.cy, .6) };
  const factB = tall && !factEl.hidden && factEl.style.opacity !== "0" ? factEl.offsetTop + factEl.offsetHeight : 0;
  const topF = (Math.max(barT, factB) + 10) / H, botF = 1 - (barB + 14) / H, avail = botF - topF;
  cam.fov = sh.fov; cam.aspect = W / H;
  let d = sh.d; const tanH = Math.tan(sh.fov * Math.PI / 360);
  const span = EH * 1.15 * Math.cos(Math.min(1, Math.abs(sh.el)) * .6);
  if (span / (2 * d * tanH) > avail) d = span / (2 * tanH * avail);
  const vis = 2 * d * tanH;
  const cy = clamp(sh.cy, topF + (1.12 - sh.fy) * EH / vis, botF - sh.fy * EH / vis);
  camTarget.set(X, sh.fy * EH, 0);
  cam.position.set(X + d * Math.sin(sh.az) * Math.cos(sh.el), Math.max(.12, camTarget.y + d * Math.sin(sh.el)), d * Math.cos(sh.az) * Math.cos(sh.el));
  cam.up.set(0, 1, 0); cam.lookAt(camTarget); cam.rotateZ(sh.r);
  cam.setViewOffset(W, H, (.5 - sh.cx) * W, (.5 - cy) * H, W, H);
  cam.updateProjectionMatrix();
}

// ---------- the sky: the only painted layer left, at infinity, turning with the camera ----------
function drawSky(p, t, sh) {
  const T = t / 1000, night = keyedN(NIGHT, p), cur = SCENES[sceneOf(p * .9999)].env;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, rgb(keyed(SKY_TOP, p))); g.addColorStop(.75, rgb(keyed(SKY_BOT, p))); g.addColorStop(1, rgb(keyed(SKY_BOT, p)));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // roll with the camera, slide with its orbit, rise and fall with its tilt
  const ox = -sh.az * W * .35, oy = sh.el * H * .6;
  ctx.translate(W / 2, H / 2); ctx.rotate(sh.r); ctx.scale(1.25, 1.25); ctx.translate(-W / 2 + ox, -H / 2 + oy);
  if (night > .3) for (const [x, y, s, ph] of stars) { ctx.globalAlpha = clamp((night - .3) / .5, 0, 1) * (.55 + .45 * Math.sin(t / 600 + ph)); ctx.fillStyle = "#fff6e0"; ctx.fillRect(((x * W * 1.6) % (W * 1.6)) - W * .3, y * H, s, s); }
  ctx.globalAlpha = 1;
  if (night < .6) {
    const sunP = clamp(p / .75, 0, 1), sx = lerp(W * .15, W * .9, sunP), sy = H * .62 - Math.sin(sunP * Math.PI) * H * .45 + night * H * .3, rad = Math.min(W, H) * .07;
    ctx.globalAlpha = 1 - night / .6; glow(sx, sy, rad * 4, "rgba(255,236,190,A)", .55);
    if (cur === "hills") { ctx.save(); ctx.globalCompositeOperation = "lighter"; for (let k = 0; k < 14; k++) { const a = k / 14 * TAU + T * .05; ctx.fillStyle = `rgba(255,214,150,${.05 + .03 * Math.sin(T + k)})`; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(a - .06) * W, sy + Math.sin(a - .06) * W); ctx.lineTo(sx + Math.cos(a + .06) * W, sy + Math.sin(a + .06) * W); ctx.fill(); } ctx.restore(); }
    ctx.fillStyle = mix("#fff1c8", "#ff8a4a", clamp(p / .7, 0, 1)); ctx.beginPath(); ctx.arc(sx, sy, rad, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
  }
  if (night > .5) {
    const k = clamp((night - .5) / .4, 0, 1), mx = W * .72, my = H * .2 + (1 - k) * H * .3, mr = Math.min(W, H) * .055;
    ctx.globalAlpha = k; glow(mx, my, mr * 5, "rgba(220,225,255,A)", .25);
    ctx.fillStyle = "#f3eedb"; ctx.beginPath(); ctx.arc(mx, my, mr, 0, 7); ctx.fill();
    ctx.fillStyle = rgb(keyed(SKY_TOP, p)); ctx.beginPath(); ctx.arc(mx + mr * .45, my - mr * .2, mr * .9, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
  }
  if (cur === "rooftop") fireworks(t, clamp((p - (N - 1) / N) * N * 2, 0, 1));
  const CL = W * N * .3, camCl = p * CL, sb = keyed(SKY_BOT, p);
  for (const c of CLOUDS) {
    const x = ((c.u * CL - camCl + W * .5 + T * (6 + c.a * 10)) % CL + CL) % CL - W * .1;
    if (x < -150 || x > W + 150) continue;
    cloud(x, H * (.08 + c.b * .2), 18 + c.c * 22, rgba(sb.map(v => lerp(v, 255, .65 - night * .45)), .85 - night * .55), rgba(sb.map(v => v * (.82 - night * .3)), .7 - night * .45));
  }
  if (cur === "hills" || cur === "coast" || cur === "park") for (let i = 0; i < 6; i++) {
    const bx = ((T * 30 + i * 140) % (W + 200)) - 100, by = H * (.18 + (i % 3) * .05) + Math.sin(T + i) * 8, f = Math.sin(T * 8 + i) * 5;
    ctx.strokeStyle = "rgba(30,20,40,.6)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx - 8, by - f); ctx.quadraticCurveTo(bx - 3, by - 3, bx, by); ctx.quadraticCurveTo(bx + 3, by - 3, bx + 8, by - f); ctx.stroke();
  }
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

// ---------- the 3D world: every scene is built from objects, so the camera can move through it ----------
// Scenes sit one after another along +x (L3 metres apart). Emma walks the line z = 0; the camera looks from +z.
const L3 = 16;
const stageX = i => STOPS[i] * N * L3;
const W3 = { updaters: [], walls: [], groups: [] };
const MC = new Map();
function mat3(color, o = {}) {
  const k = String(color) + JSON.stringify(o);
  if (!MC.has(k)) { const { basic, ...rest } = o; MC.set(k, basic ? new THREE.MeshBasicMaterial({ color, ...rest }) : new THREE.MeshStandardMaterial({ color, roughness: .8, flatShading: true, ...rest })); }
  return MC.get(k);
}
const mm = c => (typeof c === "string" || typeof c === "number") ? mat3(c) : c;
function put(g, geo, m, x, y, z, cast) { const o = new THREE.Mesh(geo, mm(m)); o.position.set(x, y, z); o.castShadow = cast ?? (z > -6 && Math.abs(x) < 8); o.receiveShadow = true; g.add(o); return o; }
const B3 = (g, w, h, d, c, x, y, z) => put(g, new THREE.BoxGeometry(w, h, d), c, x, y + h / 2, z);
const C3 = (g, rt, rb, h, c, x, y, z, seg = 12) => put(g, new THREE.CylinderGeometry(rt, rb, h, seg), c, x, y + h / 2, z);
const K3 = (g, r, h, c, x, y, z, seg = 8) => put(g, new THREE.ConeGeometry(r, h, seg), c, x, y + h / 2, z);
const S3 = (g, r, c, x, y, z, sx = 1, sy = 1, sz = 1, det = 1) => { const o = put(g, new THREE.IcosahedronGeometry(r, det), c, x, y, z); o.scale.set(sx, sy, sz); return o; };
const bulb = (g, x, y, z, col, r = .05) => put(g, new THREE.SphereGeometry(r, 8, 6), mat3(col, { basic: true }), x, y, z, false);
const GLOW_TEX = canvasTex(64, 64, (x) => { const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); });
function glow3(g, x, y, z, col, size, op = .7) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW_TEX, color: col, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending })); s.position.set(x, y, z); s.scale.set(size, size, 1); g.add(s); return s; }
function textTex(text, { w = 512, h = 128, bg = null, fg = "#fff", font = "'Dela Gothic One', sans-serif", size = 64, glow = 0, vertical = false, border = null } = {}) {
  return canvasTex(w, h, (x) => {
    if (bg) { x.fillStyle = bg; x.fillRect(0, 0, w, h); }
    if (border) { x.strokeStyle = border; x.lineWidth = 8; x.strokeRect(10, 10, w - 20, h - 20); }
    x.font = `${size}px ${font}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = fg;
    if (glow) { x.shadowColor = fg; x.shadowBlur = glow; }
    if (vertical) [...text].forEach((ch, i, a) => x.fillText(ch, w / 2, h / 2 + (i - (a.length - 1) / 2) * size * 1.05));
    else x.fillText(text, w / 2, h / 2 + size * .04);
  });
}
function plane(g, tex, w, h, x, y, z, { lit = false, ry = 0, double = true, transparent = true } = {}) {
  const m = lit ? new THREE.MeshStandardMaterial({ map: tex, transparent, side: double ? THREE.DoubleSide : THREE.FrontSide, roughness: .8 }) : new THREE.MeshBasicMaterial({ map: tex, transparent, side: double ? THREE.DoubleSide : THREE.FrontSide });
  const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); o.position.set(x, y, z); o.rotation.y = ry; g.add(o); return o;
}
function wire(g, a, b, sag, col = 0x222228, r = .012) {
  const mid = a.clone().lerp(b, .5); mid.y -= sag;
  return put(g, new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 16, r, 5, false), col, 0, 0, 0, false);
}
function bulbsAlong(g, a, b, sag, n, cols, r = .045) {
  const mid = a.clone().lerp(b, .5); mid.y -= sag; const c = new THREE.QuadraticBezierCurve3(a, mid, b);
  wire(g, a, b, sag, 0x333338, .008);
  const out = [];
  for (let k = 0; k <= n; k++) { const q = c.getPoint(k / n); out.push(bulb(g, q.x, q.y - .05, q.z, cols[k % cols.length], r)); }
  return out;
}
const upd = (i, fn) => W3.updaters.push({ i, fn });

// buildings: one shared window-grid texture, tiled per facade; windows glow at night
const BLD = (() => {
  const r = mulberry32(13);
  const map = canvasTex(256, 256, (x) => { x.fillStyle = "#ffffff"; x.fillRect(0, 0, 256, 256); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { x.fillStyle = "#8f9bb0"; x.fillRect(i * 64 + 14, j * 64 + 12, 36, 40); x.fillStyle = "#ffffff"; x.fillRect(i * 64 + 31, j * 64 + 12, 2, 40); } });
  const em = canvasTex(256, 256, (x) => { x.fillStyle = "#000"; x.fillRect(0, 0, 256, 256); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (r() > .45) { x.fillStyle = r() > .5 ? "#ffd9a0" : "#fff0d0"; x.fillRect(i * 64 + 14, j * 64 + 12, 36, 40); } }, false);
  return { map, em };
})();
function building(g, x, z, w, h, d, wall, night, glowCol = 0xffcf8a) {
  const rep = [Math.max(1, Math.round(w / 3)), Math.max(1, Math.round(h / 3.4))];
  const key = rep.join("x");
  if (!BLD[key]) BLD[key] = ["map", "em"].map(n => { const tx = BLD[n].clone(); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(...rep); tx.needsUpdate = true; return tx; });
  const [map, em] = BLD[key];
  const m = new THREE.MeshStandardMaterial({ color: wall, map, emissive: glowCol, emissiveMap: em, emissiveIntensity: .05 + night * 1.3, roughness: .85 });
  const o = put(g, new THREE.BoxGeometry(w, h, d), m, x, h / 2, z, false);
  B3(g, w + .2, .25, d + .2, wall, x, h, z);
  return o;
}
function palm(g, x, z, h, lean = .1) {
  const trunk = G(g, x, 0, z); trunk.rotation.z = lean;
  for (let k = 0; k < 6; k++) C3(trunk, .13 - k * .01, .15 - k * .01, h / 6 + .02, "#7a5a3a", 0, k * h / 6, 0, 7);
  const top = G(trunk, 0, h, 0);
  for (let k = 0; k < 8; k++) { const f = S3(top, .5, "#3f7a3a", Math.cos(k / 8 * TAU) * .7, -.15, Math.sin(k / 8 * TAU) * .7, 1.6, .12, .35); f.rotation.y = -k / 8 * TAU; f.rotation.z = -.35; }
  S3(top, .18, "#6a4a2a", 0, -.1, 0);
}
function roundTree(g, x, z, h, col = "#3f6a3a") {
  C3(g, .12, .18, h * .5, "#5a3e2a", x, 0, z, 7);
  S3(g, h * .32, col, x, h * .62, z, 1, .9, 1); S3(g, h * .24, col, x - h * .2, h * .52, z + .1, 1, .9, 1); S3(g, h * .22, col, x + h * .22, h * .55, z - .1, 1, .9, 1);
}
function lampPost(g, x, z, h, col, night, glowSize = 1.4) {
  C3(g, .05, .07, h, "#2a2d36", x, 0, z, 8); B3(g, .28, .14, .28, "#2a2d36", x, h, z);
  bulb(g, x, h - .04, z, col, .1); if (night > .15) glow3(g, x, h, z, col, glowSize, .5 + night * .4);
}
function ridge3(g, z, hgt, col, seed, width = L3 + 12) {
  const r = mulberry32(seed), s = new THREE.Shape(); s.moveTo(-width / 2, 0);
  const ph = r() * 10; for (let k = 0; k <= 40; k++) { const x = -width / 2 + k / 40 * width; s.lineTo(x, hgt * (.55 + .3 * Math.sin(x * .25 + ph) + .15 * Math.sin(x * .7 + ph * 2))); }
  s.lineTo(width / 2, 0); s.closePath();
  put(g, new THREE.ShapeGeometry(s), mat3(col, { basic: true }), 0, -.02, z, false);
}
function seaPlane(g, night) {
  put(g, new THREE.PlaneGeometry(L3 + 2, 150).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: night > .5 ? 0x18234a : 0x2f4f8a, roughness: .25, metalness: .3 }), 0, .02, -81, false);
}
function person(g, x, z, col) { const p = G(g, x, 0, z); C3(p, .12, .14, .55, col, 0, .45, 0, 8); S3(p, .12, "#e0b08a", 0, 1.12, 0); C3(p, .05, .05, .45, "#2a2d36", -.06, 0, 0, 6); C3(p, .05, .05, .45, "#2a2d36", .06, 0, 0, 6); return p; }
function car(g, col) { const c = new THREE.Group(); g.add(c); B3(c, 1.9, .5, .9, col, 0, .18, 0); B3(c, 1.1, .4, .82, col, -.1, .68, 0); B3(c, 1.0, .3, .84, mat3(0xbfdcff, { basic: true }), -.1, .72, 0); for (const [dx, dz] of [[-.6, .45], [.6, .45], [-.6, -.45], [.6, -.45]]) { const w = put(c, new THREE.CylinderGeometry(.18, .18, .12, 12).rotateX(Math.PI / 2), "#1a1a1e", dx, .18, dz); } bulb(c, .96, .4, .3, 0xfff2c0, .06); bulb(c, .96, .4, -.3, 0xfff2c0, .06); return c; }
function bike(g, x, z, col = "#2f6fb0", ry = 0) { const b = G(g, x, 0, z); b.rotation.y = ry; for (const dx of [-.42, .42]) { const w = put(b, new THREE.TorusGeometry(.3, .025, 6, 20), "#222", dx, .32, 0); } put(b, new THREE.CylinderGeometry(.02, .02, .8, 6).rotateZ(Math.PI / 2), col, 0, .52, 0); put(b, new THREE.CylinderGeometry(.02, .02, .5, 6).rotateZ(.6), col, -.2, .42, 0); B3(b, .2, .04, .08, "#222", -.15, .72, 0); return b; }
function crate(g, x, z, s = .6, col = "#a87a4a") { B3(g, s, s, s, col, x, 0, z); B3(g, s + .02, .06, s + .02, "#8a5f3a", x, s * .5, z); }
function cone3(g, x, z) { K3(g, .18, .55, "#f28a2a", x, 0, z, 10); C3(g, .13, .15, .08, "#ffffff", x, .22, z, 10); B3(g, .38, .04, .38, "#f28a2a", x, 0, z); }
function pot(g, x, z, s = 1) { C3(g, .2 * s, .15 * s, .35 * s, "#c46a3f", x, 0, z, 10); for (let k = 0; k < 7; k++) { const l = S3(g, .09 * s, "#4f8a4a", x + Math.cos(k) * .1 * s, .55 * s + (k % 3) * .08 * s, z + Math.sin(k) * .1 * s, .7, 2.2, .5); l.rotation.set(Math.cos(k * 2) * .5, k, Math.sin(k) * .5); } }
function floorLamp(g, x, z, col = 0xffd9a0, on = true) { C3(g, .15, .18, .04, "#2b2838", x, 0, z); C3(g, .02, .02, 1.6, "#2b2838", x, 0, z, 6); put(g, new THREE.CylinderGeometry(.16, .26, .3, 12, 1, true), mat3("#f2dcb0", { side: THREE.DoubleSide }), x, 1.6, z); if (on) { bulb(g, x, 1.52, z, col, .06); glow3(g, x, 1.5, z, col, 1.6, .55); } }
function armchair(g, x, z, col, ry = 0) { const a = G(g, x, 0, z); a.rotation.y = ry; B3(a, .9, .4, .8, col, 0, .1, 0); B3(a, .9, .6, .2, col, 0, .4, -.3); for (const s of [-.4, .4]) B3(a, .14, .35, .8, col, s, .4, 0); for (const [dx, dz] of [[-.38, -.32], [.38, -.32], [-.38, .32], [.38, .32]]) C3(a, .03, .03, .1, "#3a2a1a", dx, 0, dz, 6); }
function table(g, x, z, w = .8, h = .55, col = "#3a2a20") { B3(g, w, .05, w * .7, col, x, h, z); for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) B3(g, .05, h, .05, col, x + dx * (w / 2 - .05), 0, z + dz * (w * .35 - .05)); }
function rug(g, x, z, rx, rz, col) { const r = put(g, new THREE.CylinderGeometry(1, 1, .015, 32), col, x, .008, z, false); r.scale.set(rx, 1, rz); }

// interiors: the old painted walls become real 3D sets — a back wall, side returns, a floor — with furniture in front
const WALLTOP = { airport: "#eef1f4", studio: "#efe2cc", ailab: "#232a44", lounge: "#1f3a36", karaoke: "#1c1236", tvroom: "#2a2550", books: "#3b2a22" };
const FLOOR = { airport: "#cfd3d8", studio: "#b98a5c", ailab: "#3a3f55", lounge: "#5a3a2a", karaoke: "#2a1f3a", tvroom: "#5a4a6a", books: "#6b4a34" };
const WALL_PX = 3200, WALL_PY = 1400, WALL_M = WALL_PX * 1.24 / 400;   // painted at "Emma = 400px", so 1px = 3.1mm
function paintWall(env, c2, t) {
  const saved = [ctx, W, H, GROUND_Y];
  ctx = c2.getContext("2d"); W = WALL_PX; H = 1000; GROUND_Y = 780;
  const k = c2.width / WALL_PX; ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.fillStyle = WALLTOP[env]; ctx.fillRect(0, 0, WALL_PX, WALL_PY);
  ctx.translate(0, WALL_PY - 780);
  drawSet(env, 30, WALL_PX - 30, t);
  [ctx, W, H, GROUND_Y] = saved;
}
function room(g, env, i) {
  const c2 = document.createElement("canvas"); c2.width = LOW ? 1024 : 2048; c2.height = Math.round(c2.width * WALL_PY / WALL_PX);
  paintWall(env, c2, 0);
  const tex = new THREE.CanvasTexture(c2); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
  const hgt = WALL_M * WALL_PY / WALL_PX, wall = new THREE.Mesh(new THREE.PlaneGeometry(WALL_M, hgt), new THREE.MeshStandardMaterial({ map: tex, roughness: .9 }));
  wall.position.set(0, hgt / 2, -2.8); wall.receiveShadow = true; g.add(wall);
  W3.walls.push({ i, env, c2, tex });
  for (const s of [-1, 1]) { const side = put(g, new THREE.PlaneGeometry(2.3, hgt), new THREE.MeshStandardMaterial({ color: WALLTOP[env], roughness: .9, side: THREE.DoubleSide }), s * WALL_M / 2, hgt / 2, -1.65, false); side.rotation.y = Math.PI / 2; }
  const fl = put(g, new THREE.PlaneGeometry(WALL_M, 6.5).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: FLOOR[env], roughness: .7 }), 0, .01, .45, false);
  const seam = mat3(new THREE.Color(FLOOR[env]).multiplyScalar(.8).getHex());
  for (let k = -5; k <= 5; k++) B3(g, .015, .004, 6.5, seam, k * WALL_M / 11, .01, .45);
  B3(g, WALL_M, .12, .06, mat3(new THREE.Color(WALLTOP[env]).multiplyScalar(.7).getHex()), 0, 0, -2.76);   // skirting board
}

// ---------- the fifteen scenes ----------
const BUILD = {
  hills(g, c) {
    ridge3(g, -60, 14, "#7a5a86", 1); ridge3(g, -40, 9, "#5c6a6a", 2);
    [[-6.5, -5, 4.2], [-3, -9, 5], [4.5, -7.5, 4.6], [7.5, -12, 5.4], [-8, -14, 5], [9.5, -4.5, 3.8], [1, -15, 5.2]].forEach(([x, z, h], k) => palm(g, x, z, h, (k % 2 ? -1 : 1) * .12));
    [[-4.2, -3.6, "#f2a6c8"], [6.2, -3.2, "#f7d038"], [2.4, -11, "#f2a6c8"], [-9, -8, "#f7d038"]].forEach(([x, z, col]) => { C3(g, .1, .16, 1.8, "#5a3e2a", x, 0, z, 7); for (const [dx, dy, r] of [[0, 2.2, .8], [-.6, 1.9, .55], [.6, 1.95, .6], [0, 2.7, .5]]) S3(g, r, col, x + dx, dy, z, 1, .85, 1); });
    const house = G(g, 4.8, 0, -8.5); B3(house, 3.2, 2.2, 2.4, "#f2e6d0", 0, 0, 0); const roof = put(house, new THREE.ConeGeometry(2.5, 1.4, 4), "#c4553a", 0, 2.9, 0); roof.rotation.y = Math.PI / 4; roof.scale.set(1.05, 1, .8);
    B3(house, .5, .5, .05, "#3a6a9a", -.8, 1, 1.21); B3(house, .5, .5, .05, "#3a6a9a", .8, 1, 1.21); B3(house, .6, 1.1, .05, "#8a5a3a", 0, 0, 1.21);
    for (let k = 0; k < 9; k++) { B3(g, .08, .8, .08, "#8a6a4a", -8 + k * .7, 0, -2.6); } B3(g, 5.7, .06, .05, "#8a6a4a", -5.2, .55, -2.6); B3(g, 5.7, .06, .05, "#8a6a4a", -5.2, .3, -2.6);
    const r = mulberry32(3); for (let k = 0; k < 40; k++) { const x = (r() - .5) * 16, z = -1.5 - r() * 10; if (Math.abs(x) < 1.5 && z > -2) continue; K3(g, .08, .3, "#5f9a45", x, 0, z, 5); if (k % 3 === 0) bulb(g, x + .1, .32, z, ["#ffd27a", "#ff8fb0", "#ffffff"][k % 3], .05); }
    S3(g, .5, "#5a7a3a", -2.4, .3, -1.8, 1.3, .7, 1); S3(g, .4, "#4a6a30", -1.8, .25, -2.1, 1.2, .7, 1); S3(g, .45, "#8a8a92", 3, .2, -1.6, 1.3, .6, 1);
    C3(g, .04, .04, 1.2, "#6a4a2a", 2.2, 0, 1.6, 6); plane(g, textTex("BRASIL ☀", { w: 512, h: 160, bg: "#efe6d0", fg: "#3a2a1a", size: 72 }), .9, .28, 2.2, 1.1, 1.63);
  },
  airport(g, c) {
    room(g, "airport", c.i);
    for (const row of [-1.7]) for (let k = 0; k < 4; k++) { B3(g, .5, .08, .5, "#2f6fb0", -3.6 + k * .55, .42, row); B3(g, .5, .5, .08, "#2f6fb0", -3.6 + k * .55, .46, row - .24); C3(g, .03, .03, .42, "#777", -3.6 + k * .55, 0, row, 6); }
    const tr = G(g, 2.6, 0, -1.3); B3(tr, 1.0, .06, .55, "#7a8494", 0, .2, 0); B3(tr, .06, 1.0, .55, "#7a8494", .5, .2, 0); for (const [dx, dz] of [[-.4, -.25], [-.4, .25], [.4, -.25], [.4, .25]]) S3(tr, .06, "#222", dx, .08, dz); B3(tr, .55, .45, .45, "#3a6ab0", -.15, .26, 0); B3(tr, .4, .35, .4, "#e0a34a", -.2, .71, 0);
    C3(g, .04, .04, 1.9, "#2a2d33", 4.2, 0, -.9, 8); plane(g, textTex("GATE 7 →", { w: 512, h: 160, bg: "#ffcf3a", fg: "#16181d", size: 80 }), .9, .28, 4.2, 1.95, -.88);
    pot(g, -4.4, -2.2, 1.6); pot(g, 1.2, -2.3, 1.3);
    for (const x of [-4.6, 4.6]) C3(g, .2, .2, 4, "#d6dbe2", x, 0, -2.4, 16);
  },
  city(g, c) {
    ridge3(g, -70, 10, "#8fb6d6", 4);
    const r = mulberry32(5), cols = ["#6a7a98", "#8a90a8", "#5a6a88", "#9aa3b8", "#7a7090"];
    for (const [z, hmin, hmax] of [[-10, 5, 11], [-16, 8, 18], [-26, 12, 26]]) for (let x = -L3 / 2 - 2; x < L3 / 2 + 2;) { const w = 2 + r() * 3; building(g, x + w / 2, z, w, hmin + r() * (hmax - hmin), 3 + r() * 2, cols[Math.floor(r() * 5)], c.night); x += w + .3 + r() * .8; }
    put(g, new THREE.PlaneGeometry(L3 + 2, 3.6).rotateX(-Math.PI / 2), "#3a3c44", 0, .015, -3.1, false);
    for (let k = -8; k < 8; k += 1.6) B3(g, .8, .005, .1, "#e8e8e8", k, .02, -3.1);
    B3(g, L3 + 2, .08, 2.6, "#a9abb3", 0, 0, .1); B3(g, L3 + 2, .12, .15, "#8a8c94", 0, 0, -1.2);
    for (const x of [-3, 4]) { C3(g, .05, .05, 2.6, "#2a2d36", x, 0, -1.2, 8); B3(g, .25, .7, .2, "#2a2d36", x, 2.4, -1.2); const ls = ["#e0484a", "#f2c14e", "#5fe08d"].map((col, k) => bulb(g, x, 2.95 - k * .2, -1.08, 0x333333, .06)); upd(c.i, t => { const ph = Math.floor((t / 3 + x) % 3); ls.forEach((b, k) => b.material = mat3(k === ph ? ["#e0484a", "#f2c14e", "#5fe08d"][k] : "#3a3d46", { basic: true })); }); }
    lampPost(g, -6, -1.1, 3.2, 0xfff0d0, c.night); lampPost(g, 7, -1.1, 3.2, 0xfff0d0, c.night);
    const cars = [["#d9433a", -2.6, 1], ["#2f6fb0", -3.7, -1], ["#f2c14e", -2.6, 1.3]].map(([col, z, dir], k) => { const cr = car(g, col); cr.position.z = z; cr.rotation.y = dir > 0 ? 0 : Math.PI; return { cr, dir, k }; });
    upd(c.i, t => cars.forEach(({ cr, dir, k }) => { cr.position.x = ((t * 3.2 * dir + k * 7) % 20 + 20) % 20 - 10; }));
    const ppl = [["#7a4a7a", -.7], ["#3a6a4a", -.85], ["#c46a3f", -.6]].map(([col, z], k) => ({ p: person(g, 0, z, col), k }));
    upd(c.i, t => ppl.forEach(({ p, k }) => { const dir = k % 2 ? 1 : -1; p.position.x = ((t * .8 * dir + k * 5 + 3) % 16 + 16) % 16 - 8; p.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2; p.position.y = Math.abs(Math.sin(t * 6 + k)) * .04; }));
    C3(g, .1, .12, .45, "#d9433a", 1.6, 0, .9, 10); S3(g, .1, "#e04a40", 1.6, .48, .9); bike(g, -1.8, .8, "#2f6fb0", .2); C3(g, .2, .18, .6, "#3a6a4a", 3.2, 0, .9, 10);
  },
  studio(g, c) {
    room(g, "studio", c.i);
    rug(g, 0, .4, 1.6, 1.1, "#c46a5a"); rug(g, 0, .4, 1.2, .8, "#e0905a");
    const ch = G(g, -1.4, 0, -.6); ch.rotation.y = .6; B3(ch, .5, .08, .5, "#2b2f3a", 0, .45, 0); B3(ch, .5, .6, .08, "#2b2f3a", 0, .5, -.22); C3(ch, .03, .03, .45, "#555", 0, 0, 0, 6); for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; B3(ch, .3, .03, .04, "#333", Math.cos(a) * .15, .02, Math.sin(a) * .15).rotation.y = -a; }
    const cat = G(g, 1.9, 0, -.4); C3(cat, .35, .38, .1, "#7a5a9a", 0, 0, 0, 16); S3(cat, .2, "#f2a03a", 0, .2, 0, 1.3, .7, 1); S3(cat, .11, "#f2a03a", .2, .27, .05); K3(cat, .04, .08, "#f2a03a", .17, .36, .05, 4); K3(cat, .04, .08, "#f2a03a", .25, .36, .05, 4);
    upd(c.i, t => cat.children[1].scale.y = .7 + .04 * Math.sin(t * 2));
    floorLamp(g, 3.6, -1.6); pot(g, -3.8, -2, 1.4);
    for (let k = 0; k < 3; k++) B3(g, .5 - k * .06, .3, .4, ["#c99a3c", "#a87a4a", "#8a6a4a"][k], -2.8, k * .3, -2.2);
  },
  ailab(g, c) {
    room(g, "ailab", c.i);
    const m = G(g, -2.4, 0, -1.4); m.rotation.y = .4; table(m, 0, 0, 1.4, .75, "#2b2f3a"); B3(m, .9, .55, .05, "#0f1220", 0, .85, -.1); C3(m, .03, .03, .1, "#555", 0, .75, -.1, 6);
    const scr = document.createElement("canvas"); scr.width = 256; scr.height = 160; const sTex = new THREE.CanvasTexture(scr); sTex.encoding = THREE.sRGBEncoding;
    plane(m, sTex, .84, .5, 0, 1.125, -.07, { transparent: false });
    upd(c.i, t => { const x = scr.getContext("2d"); x.fillStyle = "#0b0e18"; x.fillRect(0, 0, 256, 160); x.font = "13px 'IBM Plex Mono', monospace"; for (let k = 0; k < 8; k++) { x.fillStyle = ["#c792ea", "#c3e88d", "#89ddff", "#f78c6c"][k % 4]; x.fillText("".padEnd(4 + ((k * 7 + Math.floor(t * 4)) % 20), "▇").slice(0, 18), 12, 20 + k * 17); } sTex.needsUpdate = true; });
    const st = G(g, 2.4, 0, -1.6); B3(st, .5, 1.5, .2, "#d97757", 0, 0, 0); plane(st, textTex("✳", { w: 128, h: 128, fg: "#fff", size: 96 }), .4, .4, 0, 1.0, .11); plane(st, textTex("Claude", { w: 256, h: 64, fg: "#fff", size: 36, font: "'IBM Plex Mono', monospace" }), .44, .11, 0, .55, .11);
    for (let k = 0; k < 3; k++) wire(g, new THREE.Vector3(-2.2 + k * .2, .02, -1.2), new THREE.Vector3(1.5 + k * .3, .02, -2.6), -.15, 0x5a6aa0, .02);
    pot(g, 3.8, -2.1, 1.4);
  },
  workshop(g, c) {
    ridge3(g, -60, 12, "#c89a9a", 6);
    const r = mulberry32(8); for (const [z, hmin, hmax] of [[-12, 6, 12], [-20, 9, 18]]) for (let x = -L3 / 2 - 2; x < L3 / 2 + 2;) { const w = 2.2 + r() * 2.6; building(g, x + w / 2, z, w, hmin + r() * (hmax - hmin), 3, ["#7a5a6a", "#8a6a6a", "#6a4d5e"][Math.floor(r() * 3)], .35, 0xffc070); x += w + .4 + r(); }
    [["Tesify", -3.6], ["Meetnow", 0], ["NovelBr", 3.6]].forEach(([name, x], k) => {
      const z = -4.2, y = 1.2 + (k % 2) * .4; C3(g, .06, .06, y, "#4a3a3a", x - .7, 0, z, 8); C3(g, .06, .06, y, "#4a3a3a", x + .7, 0, z, 8);
      B3(g, 2.3, 1.05, .12, "#2a1c33", x, y, z); plane(g, textTex(name, { w: 512, h: 220, fg: "#ffc861", size: 84, border: "#ffc861" }), 2.1, .9, x, y + .52, z + .07);
      const bs = []; for (let q = 0; q < 12; q++) bs.push(bulb(g, x - 1.05 + q * .19, y + 1.1, z + .07, 0xffe9a8, .035));
      upd(c.i, t => bs.forEach((b, q) => b.material = mat3(Math.sin(t * 5 + q) > 0 ? 0xffe9a8 : 0x6a5030, { basic: true })));
    });
    const cr = G(g, 7.5, 0, -10); for (let k = 0; k < 10; k++) B3(cr, .5, 1.1, .5, "#d9a63a", 0, k * 1.1, 0); B3(cr, 7, .35, .35, "#d9a63a", -2.5, 11, 0); B3(cr, .8, .8, .6, "#8a6a3a", 0, 11, 0);
    const hook = G(cr, -4, 11, 0); const cable = C3(hook, .015, .015, 4, "#222", 0, -4, 0, 4); B3(hook, .7, .4, .4, "#ffc861", 0, -4.4, 0);
    upd(c.i, t => { hook.rotation.z = Math.sin(t * .6) * .08; hook.position.x = -4 + Math.sin(t * .25) * 1.5; });
    crate(g, -5.2, -1.6); crate(g, -4.6, -1.9, .5); crate(g, -5, -1.7, .4); cone3(g, 2.2, -1.2); cone3(g, 2.8, -1.4); cone3(g, 3.3, -1.1); B3(g, .6, .3, .3, "#d9433a", 5.2, 0, -1.2);
    lampPost(g, -7, -1.4, 3.2, 0xffd9a0, .35);
  },
  park(g, c) {
    ridge3(g, -60, 12, "#6b4a78", 9); ridge3(g, -40, 7, "#4a5a48", 10);
    [[-7, -6, 3.2], [-3, -10, 3.8], [1.5, -12, 4.2], [8, -8, 3.6], [-9.5, -12, 4], [5, -14, 4.4], [-5.5, -15, 3.8], [9.5, -15, 4.6]].forEach(([x, z, h]) => roundTree(g, x, z, h, "#3f6a3a"));
    const gz = G(g, 5.2, 0, -5); C3(gz, 2, 2.1, .3, "#e8dcc4", 0, 0, 0, 6); for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; C3(gz, .07, .07, 2.4, "#f2ece0", Math.cos(a) * 1.8, .3, Math.sin(a) * 1.8, 8); } put(gz, new THREE.ConeGeometry(2.4, 1.2, 6), "#7a4a5a", 0, 3.3, 0); bulb(gz, 0, 3.95, 0, 0xffd27a, .12);
    for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + .5; bulb(gz, Math.cos(a) * 1.9, 2.6, Math.sin(a) * 1.9, 0xffd9a0, .06); }
    const pond = put(g, new THREE.CylinderGeometry(1, 1, .03, 32), new THREE.MeshStandardMaterial({ color: 0x6a9ac8, roughness: .15, metalness: .3 }), -4.4, .02, -4.2, false); pond.scale.set(2.2, 1, 1.1);
    const ducks = [0, 1, 2].map(k => { const d = G(g, 0, 0, 0); S3(d, .14, "#f7f3ea", 0, .1, 0, 1.3, .8, 1); S3(d, .08, "#f7f3ea", .14, .22, 0); K3(d, .03, .07, "#f2a03a", .24, .2, 0, 4).rotation.z = -Math.PI / 2; return d; });
    upd(c.i, t => ducks.forEach((d, k) => { const a = t * .3 + k * 2.1; d.position.set(-4.4 + Math.cos(a) * 1.5, 0, -4.2 + Math.sin(a) * .65); d.rotation.y = -a - Math.PI / 2; }));
    for (const x of [-7.5, 2.4, 8]) lampPost(g, x, -1.6, 3, 0xffd9a0, .5);
    for (let k = 0; k < 7; k++) bulb(g, -2.6 + k * .3, .25, -2.4, ["#ff6b6b", "#ffd166", "#f7a6c8"][k % 3], .07); B3(g, 2.3, .15, .5, "#6a4a2a", -1.7, 0, -2.4);
    S3(g, .14, "#f2f2f2", 2.3, .14, .9); C3(g, .18, .16, .55, "#2f5a3a", -3, 0, -.8, 10);
    const kite = G(g, 1.2, 6.5, -6); put(kite, new THREE.CircleGeometry(.5, 4), mat3("#ff6b6b", { side: THREE.DoubleSide }), 0, 0, 0, false).scale.set(.8, 1.2, 1);
    wire(g, new THREE.Vector3(1.2, 6.2, -6), new THREE.Vector3(3, .8, -3), 1.2, 0x333333, .006);
    upd(c.i, t => { kite.position.x = 1.2 + Math.sin(t * .7) * .5; kite.position.y = 6.5 + Math.sin(t * 1.1) * .3; kite.rotation.z = Math.sin(t) * .2; });
    const ffl = Array.from({ length: 18 }, (_, k) => glow3(g, 0, 0, 0, 0xfff08a, .25, .8));
    upd(c.i, t => ffl.forEach((f, k) => { f.position.set(-8 + (k * 1.1) % 16 + Math.sin(t * .5 + k) * .6, .6 + (k % 5) * .4 + Math.sin(t * 1.3 + k) * .2, -2 - (k % 4) * 1.5); f.material.opacity = .4 + .4 * Math.sin(t * 3 + k); }));
  },
  lounge(g, c) {
    room(g, "lounge", c.i);
    for (const x of [-2.3, -.9]) { C3(g, .04, .04, .9, "#d9b35a", x, 0, 1.5, 8); S3(g, .07, "#d9b35a", x, .95, 1.5); } wire(g, new THREE.Vector3(-2.3, .85, 1.5), new THREE.Vector3(-.9, .85, 1.5), .25, 0x8a1f2a, .03);
    armchair(g, -3.4, -1.4, "#7a1f2a", .5); armchair(g, 3.6, -1.6, "#7a1f2a", -.5);
    for (const [x, z] of [[-2.4, -1.9], [2.6, -2.1]]) { C3(g, .35, .35, .04, "#2a1a12", x, .6, z, 16); C3(g, .04, .04, .6, "#2a1a12", x, 0, z, 6); C3(g, .03, .03, .12, "#f2e6d0", x, .64, z, 8); bulb(g, x, .8, z, 0xffd27a, .025); glow3(g, x, .8, z, 0xffb060, .7, .8); }
    C3(g, .12, .08, .4, "#4a2a6a", 4.2, 0, -2.2, 10); for (let k = 0; k < 5; k++) S3(g, .06, "#f2a6c8", 4.2 + Math.cos(k) * .08, .5 + k % 2 * .06, -2.2 + Math.sin(k) * .08);
  },
  karaoke(g, c) {
    room(g, "karaoke", c.i);
    const so = G(g, 2.6, 0, -1.9); B3(so, 2.2, .4, .8, "#6a2a6a", 0, 0, 0); B3(so, 2.2, .6, .2, "#6a2a6a", 0, .4, -.3); for (const s of [-1.05, 1.05]) B3(so, .2, .55, .8, "#5a2058", s, .1, 0);
    table(g, 2.6, -.9, .9, .35, "#1c1428"); for (const [dx, col] of [[-.2, 0xff8cc8], [0, 0xffd27a], [.2, 0x8ce6ff]]) C3(g, .04, .035, .14, mat3(col, { basic: true, transparent: true, opacity: .8 }), 2.6 + dx, .4, -.9, 10);
    for (const x of [-4.2, 4.3]) { B3(g, .6, 1.3, .5, "#16141e", x, 0, -2.2); for (const [y, r] of [[1.0, .18], [.45, .13]]) { const sp = put(g, new THREE.CylinderGeometry(r, r, .05, 20).rotateX(Math.PI / 2), "#2b2838", x, y, -1.94); upd(c.i, t => sp.scale.setScalar(1 + .08 * Math.max(0, Math.sin(t * 8)))); } }
    const ball = put(g, new THREE.IcosahedronGeometry(.3, 1), new THREE.MeshStandardMaterial({ color: 0xdddde8, metalness: .9, roughness: .15, flatShading: true }), -.6, 3.4, -1.2, false); wire(g, new THREE.Vector3(-.6, 3.7, -1.2), new THREE.Vector3(-.6, 4.4, -1.2), 0, 0x888888, .01);
    const spots = [0xff5ab4, 0x50dcff, 0xffe65a].map(col => glow3(g, 0, 0, 0, col, .5, .5));
    upd(c.i, t => { ball.rotation.y = t * .8; spots.forEach((s, k) => { const a = t * .7 + k * 2.1; s.position.set(Math.cos(a) * 3.5, 1.5 + Math.sin(a * 1.3) * 1, -2.7); }); });
    C3(g, .02, .02, 1.3, "#2a2a30", -3, 0, -.5, 6); S3(g, .06, "#b8bcc6", -3, 1.34, -.5, 1, 1.3, 1);
  },
  tokyo(g, c) {
    const r = mulberry32(21), cols = ["#ff4fa3", "#3fe0ff", "#ffd27a", "#9dff7a"], words = ["ラーメン", "カフェ", "ゲーム", "本屋", "カラオケ", "居酒屋"];
    for (const [z, hmin, hmax] of [[-7, 5, 9], [-12, 7, 14], [-22, 10, 20]]) for (let x = -L3 / 2 - 2; x < L3 / 2 + 2;) {
      const w = 1.6 + r() * 1.8, h = hmin + r() * (hmax - hmin); building(g, x + w / 2, z, w, h, 2.5, ["#2a2838", "#1d1a2e", "#34304a"][Math.floor(r() * 3)], 1, 0xffe0b0);
      if (z === -7 || r() > .4) { const word = words[Math.floor(r() * words.length)], col = cols[Math.floor(r() * 4)]; const sh = word.length * .45 + .3; B3(g, .5, sh, .08, "#0d0c16", x + w - .3, h * .45, z + 1.3); plane(g, textTex(word, { w: 128, h: 128 * word.length * 1.1, fg: col, size: 96, glow: 24, vertical: true, font: "'Zen Kaku Gothic New', sans-serif" }), .5, sh - .1, x + w - .3, h * .45 + sh / 2, z + 1.35); glow3(g, x + w - .3, h * .45 + sh / 2, z + 1.5, new THREE.Color(col), sh * 1.2, .25); }
      x += w + .2;
    }
    const torii = G(g, -3.6, 0, -2.6); for (const s of [-1, 1]) C3(torii, .12, .14, 2.8, "#d9432f", s * 1.1, 0, 0, 10); B3(torii, 3.2, .2, .3, "#1a1416", 0, 2.85, 0); B3(torii, 2.8, .16, .24, "#d9432f", 0, 2.6, 0); B3(torii, 2.4, .12, .2, "#d9432f", 0, 2.1, 0);
    const st = G(g, 2.8, 0, -2.6); B3(st, 2, 1.1, 1, "#5a3a22", 0, 0, 0); B3(st, 2.3, .1, 1.3, "#1a1416", 0, 2, 0); for (const s of [-1, 1]) C3(st, .04, .04, .9, "#3a2a1a", s * .95, 1.1, .5, 6);
    plane(st, textTex("ラーメン", { w: 512, h: 128, bg: "#d9432f", fg: "#f7f3ea", size: 72, font: "'Zen Kaku Gothic New', sans-serif" }), 1.9, .45, 0, 1.75, .56); glow3(st, 0, 1.2, .8, 0xffbe6e, 2.2, .35);
    const steam = [0, 1, 2].map(k => glow3(st, 0, 0, 0, 0xffffff, .4, .3)); upd(c.i, t => steam.forEach((s, k) => { const q = (t * .4 + k / 3) % 1; s.position.set(-.3 + k * .3, 1.2 + q * 1.1, .3); s.material.opacity = .3 * (1 - q); s.scale.setScalar(.3 + q * .5); }));
    const tree = G(g, 6, 0, -4); C3(tree, .14, .2, 1.8, "#3a2a2a", 0, 0, 0, 8); for (const [dx, dy, rr] of [[0, 2.4, 1], [-.8, 2.1, .7], [.8, 2.1, .75], [-.3, 2.9, .6], [.4, 2.9, .6]]) S3(tree, rr, "#f7b6c8", dx, dy, 0, 1, .85, 1);
    const petalM = mat3("#ffc2d4", { side: THREE.DoubleSide }); const petals = Array.from({ length: 24 }, () => put(g, new THREE.PlaneGeometry(.06, .04), petalM, 0, 0, 0, false));
    upd(c.i, t => petals.forEach((pt, k) => { const q = (t * .12 + k / 24) % 1; pt.position.set(6 - 2.5 + ((k * 1.7) % 5) + Math.sin(t + k) * .4, 3.2 - q * 3.2, -4 + ((k * .7) % 3) - 1); pt.rotation.set(t + k, t * 1.3 + k, 0); }));
    for (const [x, col] of [[-1.3, "#e8e8f0"], [-.5, "#d9433a"]]) { B3(g, .7, 1.8, .6, col, x, 0, -2.6); plane(g, canvasTex(64, 96, (q) => { q.fillStyle = "#cfe8ff"; q.fillRect(0, 0, 64, 96); for (let a = 0; a < 3; a++) for (let b = 0; b < 4; b++) { q.fillStyle = ["#ff6b6b", "#ffd166", "#06d6a0", "#118ab2"][(a + b) % 4]; q.fillRect(6 + b * 14, 8 + a * 26, 10, 18); } }), .55, .8, x, 1.3, -2.29); glow3(g, x, 1.2, -2.1, 0xc8e6ff, 1.6, .25); }
    const jc = document.createElement("canvas"); jc.width = 320; jc.height = 192; const jt = new THREE.CanvasTexture(jc); jt.encoding = THREE.sRGBEncoding;
    B3(g, 3.6, 2.3, .2, "#0b0b12", .8, 4.6, -6.8); plane(g, jt, 3.3, 2, .8, 5.75, -6.68, { transparent: false }); C3(g, .1, .1, 4.6, "#0b0b12", .8, 0, -6.9, 8);
    upd(c.i, t => { const x = jc.getContext("2d"), gr = x.createLinearGradient(0, 0, 320, 192); gr.addColorStop(0, `hsl(${(t * 40) % 360},80%,60%)`); gr.addColorStop(1, `hsl(${(t * 40 + 120) % 360},80%,50%)`); x.fillStyle = gr; x.fillRect(0, 0, 320, 192); for (let k = 0; k < 9; k++) { const bh = 30 + 70 * Math.abs(Math.sin(t * 5 + k)); x.fillStyle = "rgba(255,255,255,.55)"; x.fillRect(20 + k * 32, 180 - bh, 22, bh); } x.font = "40px 'Dela Gothic One', sans-serif"; x.fillStyle = "#fff"; x.textAlign = "center"; x.fillText("J-POP ♪", 160, 52); jt.needsUpdate = true; });
    for (const x of [-7, 0.5, 7.5]) { C3(g, .1, .12, 6, "#3a3440", x, 0, -1.6, 8); B3(g, 1.2, .08, .08, "#3a3440", x, 5.6, -1.6); }
    for (const [a, b] of [[-7, .5], [.5, 7.5]]) { wire(g, new THREE.Vector3(a, 5.6, -1.6), new THREE.Vector3(b, 5.6, -1.6), .5); wire(g, new THREE.Vector3(a, 5.3, -1.6), new THREE.Vector3(b, 5.3, -1.6), .45); }
    bulbsAlong(g, new THREE.Vector3(-7, 3.4, -2), new THREE.Vector3(.5, 3.4, -2), .5, 10, [0xe0402a], .09).forEach(b => glow3(g, b.position.x, b.position.y, b.position.z, 0xff5a3c, .6, .45));
    bike(g, -2, .9, "#e8e0d0", -.3); C3(g, .04, .04, 2, "#2a2a30", 4.6, 0, .6, 6); plane(g, textTex("止まれ", { w: 256, h: 160, bg: "#2f6fb0", fg: "#fff", size: 72, font: "'Zen Kaku Gothic New', sans-serif" }), .6, .38, 4.6, 2.1, .62);
    const cat = G(g, 1.2, 0, -2); S3(cat, .16, "#14121c", 0, .15, 0, 1.4, .8, .9); S3(cat, .1, "#14121c", .2, .3, 0); K3(cat, .035, .08, "#14121c", .17, .4, 0, 4); K3(cat, .035, .08, "#14121c", .24, .4, 0, 4);
  },
  tvroom(g, c) {
    room(g, "tvroom", c.i);
    rug(g, 0, .4, 1.8, 1.1, "#6a5a8a"); S3(g, .55, "#e0a34a", 3.6, .35, -1.4, 1.3, .7, 1.1);
    table(g, -1.6, -.4, .9, .35, "#3a2a20"); B3(g, .45, .04, .45, "#e0a34a", -1.6, .4, -.4); B3(g, .22, .04, .14, "#2b2838", -1.4, .41, -.3);
    floorLamp(g, 4.5, -2.2, 0xffd2a0); pot(g, -4.2, -2.2, 1.5); S3(g, .14, "#f2a6c8", 1.6, .06, .9, 1.4, .4, .8); S3(g, .14, "#f2a6c8", 1.9, .06, .95, 1.4, .4, .8);
    const tvGlow = glow3(g, 1.6, 1.8, -2.4, 0xffaac0, 3.5, .25); upd(c.i, t => tvGlow.material.opacity = .2 + .08 * Math.sin(t * 3));
  },
  books(g, c) {
    room(g, "books", c.i);
    armchair(g, -2.6, -1.4, "#7a3a2a", .5); floorLamp(g, -3.6, -1.8, 0xffd27a);
    for (let k = 0; k < 6; k++) B3(g, .45 - (k % 2) * .05, .1, .32, ["#a8423a", "#3e6a8a", "#c99a3c", "#4f7a4a"][k % 4], 2.2 + (k % 2) * .03, k * .1, -1.6).rotation.y = (k - 3) * .08;
    const gl = G(g, 3.4, 0, -1.9); C3(gl, .03, .03, .9, "#8a5f3c", 0, 0, 0, 6); const globe = S3(gl, .22, "#3e6a8a", 0, 1.1, 0, 1, 1, 1, 2); upd(c.i, t => globe.rotation.y = t * .5);
    const lad = G(g, -1, 0, -2.5); lad.rotation.x = -.2; for (const s of [-.25, .25]) B3(lad, .05, 3.6, .05, "#8a5f3c", s, 0, 0); for (let k = 1; k < 10; k++) B3(lad, .5, .04, .04, "#8a5f3c", 0, k * .36, 0);
    table(g, 4.4, -.8, .6, .5, "#5a3d2a"); S3(g, .1, "#e8e0d0", 4.4, .62, -.8, 1.2, .9, 1);
  },
  coast(g, c) {
    seaPlane(g, c.night); ridge3(g, -80, 10, "#6b4a78", 12);
    const r = mulberry32(31); for (let x = -L3 / 2; x < L3 / 2;) { const w = 1.8 + r() * 1.4, h = 2 + r() * 2.2; if (x > -4.5 && x < 8) { x += 1; continue; } const hs = G(g, x + w / 2, 0, -5.5 - r() * 1.5); B3(hs, w, h, 2, ["#d4bc94", "#c9b08a", "#e0caa0"][Math.floor(r() * 3)], 0, 0, 0); B3(hs, .9, .7, .4, r() > .5 ? "#2f7a4a" : "#2f5f8a", 0, h * .55, 1.1); B3(hs, .5, .6, .05, "#2f5f8a", -w * .3, .2, 1.01); x += w + .15; }
    const lh = G(g, 6.4, 0, -9); C3(lh, .45, .7, 5, "#e8e0d0", 0, 0, 0, 14); C3(lh, .62, .66, .5, "#c8443a", 0, 1.2, 0, 14); C3(lh, .52, .56, .5, "#c8443a", 0, 3.2, 0, 14); C3(lh, .55, .55, .7, "#2a2a35", 0, 5, 0, 10); bulb(lh, 0, 5.4, 0, 0xfff0b4, .3); glow3(lh, 0, 5.4, 0, 0xfff0b4, 2.4, .8);
    const beam = put(lh, new THREE.ConeGeometry(1.2, 14, 16, 1, true).rotateZ(Math.PI / 2).translate(7, 0, 0), new THREE.MeshBasicMaterial({ color: 0xfff0b4, transparent: true, opacity: .12, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }), 0, 5.4, 0, false);
    upd(c.i, t => beam.rotation.y = t * .8);
    const boats = [[-2, -11, "#2a6fd0"], [2.5, -16, "#d9433a"], [-6, -20, "#f2c14e"], [4.5, -9, "#2a6fd0"]].map(([x, z, col]) => { const b = G(g, x, 0, z); B3(b, 2.2, .45, .8, col, 0, 0, 0); B3(b, 2.2, .1, .82, "#f2c14e", 0, .35, 0); B3(b, 2.2, .08, .82, "#d9433a", 0, .2, 0); K3(b, .2, .6, col, 1.15, .1, 0, 4).rotation.z = -1.2; C3(b, .03, .03, 1.2, "#3a2a1a", 0, .4, 0, 5); return b; });
    upd(c.i, t => boats.forEach((b, k) => { b.position.y = Math.sin(t * 1.5 + k) * .06; b.rotation.z = Math.sin(t + k) * .04; }));
    for (const [x, z, s] of [[-5.5, -2.2, 1], [-4.6, -2.6, .7], [3.4, -2.4, .8]]) S3(g, .6 * s, "#b39a76", x, .2, z, 1.4, .7, 1);
    C3(g, .03, .03, 2, "#e8e0d0", -3, 0, 1, 6); const um = put(g, new THREE.ConeGeometry(1.1, .45, 10), mat3("#e0484a", { side: THREE.DoubleSide }), -3, 2.1, 1);
    const dc = G(g, -2, 0, 1.4); dc.rotation.y = .4; B3(dc, .6, .05, 1.1, "#2f6fb0", 0, .3, 0).rotation.x = .25; for (const s of [-.28, .28]) B3(dc, .04, .3, 1, "#8a5a3a", s, 0, 0);
    S3(g, .08, "#e8a0b0", 1.8, .03, 1.2, 1, .5, 1); S3(g, .06, "#f2c14e", 2.1, .03, 1.4, 1, .5, 1);
  },
  sea(g, c) {
    seaPlane(g, c.night); ridge3(g, -90, 8, "#1f2a52", 14);
    const r = mulberry32(41); for (let x = -L3 / 2; x < L3 / 2;) { const w = 1.8 + r() * 1.6; if (x > 2 && x < 6.5) { x += 1; continue; } building(g, x + w / 2, -26 - r() * 4, w * 1.4, 3 + r() * 4, 3, ["#3c3a5a", "#57536e", "#4a4766"][Math.floor(r() * 3)], .9, 0xffce78); x += w + .15; }
    const ch = G(g, 4, 0, -24); B3(ch, 3, 3.2, 3, "#2a2f52", 0, 0, 0); const dome = put(ch, new THREE.SphereGeometry(1.3, 16, 10, 0, TAU, 0, Math.PI / 2), "#323a66", 0, 3.2, 0); C3(ch, .3, .3, .8, "#2a2f52", 0, 4.4, 0, 8); C3(ch, .04, .04, .6, "#d9b35a", 0, 5.2, 0, 4);
    for (const s of [-1.8, 1.8]) { B3(ch, .9, 4.5, .9, "#2a2f52", s, 0, .8); K3(ch, .65, 1, "#2a2f52", s, 4.5, .8, 4).rotation.y = Math.PI / 4; bulb(ch, s, 3.8, 1.26, 0xffce78, .12); }
    for (let k = -1; k <= 1; k++) bulb(ch, k * .6, 1.6, 1.52, 0xffce78, .14); glow3(ch, 0, 3, 1.6, 0xffce78, 4, .2);
    const boats = [[-6, -10], [-1, -14], [9, -9]].map(([x, z]) => { const b = G(g, x, 0, z); B3(b, 1.6, .35, .6, "#2a3050", 0, 0, 0); C3(b, .02, .02, 1.1, "#3a3a4a", 0, .35, 0, 4); bulb(b, 0, 1.45, 0, 0xffd27a, .07); glow3(b, 0, 1.45, 0, 0xffc878, 1.2, .8); return b; });
    upd(c.i, t => boats.forEach((b, k) => { b.position.y = Math.sin(t * 1.2 + k) * .05; }));
    B3(g, L3 + 2, .08, 4, "#4a4a5e", 0, 0, -1.4); for (let x = -7; x <= 7; x += 1) C3(g, .03, .03, .9, "#2a2d3a", x, 0, -3.3, 6); B3(g, L3, .05, .05, "#2a2d3a", 0, .9, -3.3);
    for (const x of [-4, 1.8]) { C3(g, .14, .17, .5, "#2a2d3a", x, 0, -2.6, 10); } lampPost(g, -6.5, -2.8, 3, 0xffce78, 1, 2); lampPost(g, 6.5, -2.8, 3, 0xffce78, 1, 2);
  },
  rooftop(g, c) {
    seaPlane(g, c.night);
    const r = mulberry32(51); for (let x = -L3 / 2 - 6; x < L3 / 2 + 6;) { const w = 3 + r() * 4; building(g, x + w / 2, -32 - r() * 10, w, 4 + r() * 8, 4, "#262a48", 1, 0xffce78); x += w + 1; }
    B3(g, L3 + 2, .3, 6, "#3a3a50", 0, -.3, -.5); for (let x = -7; x <= 7; x += .8) B3(g, .05, 1, .05, "#2a2d3a", x, 0, -3.2); B3(g, L3, .06, .08, "#2a2d3a", 0, 1, -3.2);
    for (const x of [-6, 0, 6]) C3(g, .04, .04, 3.2, "#2a2d3a", x, 0, -2.8, 6);
    bulbsAlong(g, new THREE.Vector3(-6, 3.1, -2.8), new THREE.Vector3(0, 3.1, -2.8), .7, 12, [0xffd27a, 0xffb4c8, 0xfff0b4]);
    bulbsAlong(g, new THREE.Vector3(0, 3.1, -2.8), new THREE.Vector3(6, 3.1, -2.8), .7, 12, [0xffd27a, 0xffb4c8, 0xfff0b4]);
    const tri = new THREE.Shape(); tri.moveTo(-.12, 0); tri.lineTo(.12, 0); tri.lineTo(0, -.26); tri.closePath(); const triG = new THREE.ShapeGeometry(tri);
    for (const [a, b] of [[-6, 0], [0, 6]]) { const A = new THREE.Vector3(a, 2.7, -2.6), Bv = new THREE.Vector3(b, 2.7, -2.6), M2 = A.clone().lerp(Bv, .5); M2.y -= .5; const cu = new THREE.QuadraticBezierCurve3(A, M2, Bv); wire(g, A, Bv, .5, 0x444444, .006); for (let k = 0; k < 14; k++) { const q = cu.getPoint(k / 13); const f = put(g, triG, mat3(["#e0484a", "#f7f3ea", "#f2c14e", "#2f6fb0"][k % 4], { basic: true, side: THREE.DoubleSide }), q.x, q.y, q.z, false); } }
    table(g, 3, -1.4, .7, .7, "#3a2a20"); for (const [dx, col] of [[-.15, 0xff8cc8], [0, 0xffd27a], [.15, 0x8ce6ff]]) C3(g, .035, .03, .15, mat3(col, { basic: true, transparent: true, opacity: .85 }), 3 + dx, .75, -1.4, 10);
    pot(g, -4, -2.2, 1.6); pot(g, 4.6, -2.3, 1.3); const chr = G(g, -2.6, 0, -1.6); B3(chr, .45, .05, .45, "#3a2a20", 0, .45, 0); B3(chr, .45, .5, .05, "#3a2a20", 0, .5, -.2); for (const [dx, dz] of [[-.2, -.2], [.2, -.2], [-.2, .2], [.2, .2]]) B3(chr, .04, .45, .04, "#3a2a20", dx, 0, dz);
    C3(g, .7, .7, 1.4, "#5a4a3a", -6, 0, -2.2, 12); K3(g, .75, .5, "#4a3a2a", -6, 1.4, -2.2, 12);
  },
};

async function buildWorld3D(stage) {
  const root = new THREE.Group(); stage.add(root);
  for (const [i, sc] of SCENES.entries()) {
    await new Promise(r => setTimeout(r, 0));
    window.filmLoad && window.filmLoad(.65 + .25 * (i + 1) / N);
    const g = new THREE.Group(); g.position.x = stageX(i); root.add(g);
    const night = sc.night, depth = sc.sea ? 26 : 140, zc = sc.sea ? 7 : -50;
    put(g, new THREE.PlaneGeometry(L3 + .2 + (i === 0 || i === N - 1 ? L3 : 0), depth).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: sc.ground, roughness: sc.env === "tokyo" ? .35 : .9, metalness: sc.env === "tokyo" ? .25 : 0 }), 0, 0, zc, false);
    BUILD[sc.env](g, { i, sc, night });
    W3.groups.push(g);
  }
  return root;
}
let wallTick = 0;
function updateWorld3D(t, si) {
  W3.groups.forEach((g, i) => (g.visible = Math.abs(i - si) <= 1));   // only draw the scenes around Emma
  for (const u of W3.updaters) if (Math.abs(u.i - si) <= 1) u.fn(t);
  if (++wallTick % 3) return;
  for (const w of W3.walls) if (w.i === si) { paintWall(w.env, w.c2, t * 1000); w.tex.needsUpdate = true; }
}

// ---------- actor + captions ----------
const track = document.getElementById("track");
// each scene's best framing, as film progress; the scroll holds there before Emma walks on
const STOPS = SCENES.map((s, i) => i === 0 ? 0 : i === N - 1 ? 1 : (i + .5) / N);
const HOLD = .62;                                    // share of each step's scroll spent standing still at a stop
const rawStop = i => i / (STOPS.length - 1);
function filmProgress(raw) {
  const K = STOPS.length - 1, seg = 1 / K, hw = seg * HOLD / 2;
  const i = clamp(Math.round(raw * K), 0, K), r0 = rawStop(i);
  if (Math.abs(raw - r0) <= hw) { CAMS = { a: i, b: i, w: 0, hu: (raw - r0) / hw, hold: true }; return STOPS[i]; } // inside a hold: the film doesn't move, the camera does
  const a = raw > r0 ? i : i - 1, b = a + 1;      // between stops: walk from one to the next, eased
  const u = clamp((raw - (rawStop(a) + hw)) / (seg - 2 * hw), 0, 1);
  CAMS = { a, b, w: u, hu: 0, hold: false };
  return lerp(STOPS[a], STOPS[b], u * u * (3 - 2 * u));
}
const dotsEl = document.getElementById("dots"), nextEl = document.getElementById("next");
const dotEls = STOPS.map(() => dotsEl.appendChild(document.createElement("b")));
// settle: when the scroll comes to rest, glide to a stop. Inside a hold it eases back to this scene's stop;
// past the hold it finishes the walk to the next stop in the direction you were scrolling.
let lastY = scrollY, lastDir = 1, settleT = 0, glide = null;
const maxScroll = () => track.offsetHeight - innerHeight;
function glideTo(y) {
  const from = scrollY, dist = Math.abs(y - from);
  if (dist < 2) return;
  const dur = reduce ? 0 : clamp(dist * .9, 450, 1500), t0 = performance.now();
  glide = { y };
  const step = now => {
    if (!glide) return;
    const u = dur ? clamp((now - t0) / dur, 0, 1) : 1, e = u < .5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
    scrollTo(0, from + (y - from) * e);
    if (u < 1) requestAnimationFrame(step); else glide = null;
  };
  requestAnimationFrame(step);
}
function settle() {
  const max = maxScroll(); if (max <= 0) return;
  const K = STOPS.length - 1, raw = clamp(scrollY / max, 0, 1), hw = (1 / K) * HOLD / 2, i0 = Math.round(raw * K);
  let i = i0;
  const off = Math.abs(raw - rawStop(i0));
  if (off <= hw * .85) return;
  if (off > hw) i = lastDir > 0 ? Math.ceil(raw * K - 1e-6) : Math.floor(raw * K + 1e-6);
  else { glideTo((rawStop(i0) + Math.sign(raw - rawStop(i0)) * hw * .8) * max); return; }
  glideTo(rawStop(clamp(i, 0, K)) * max);
}
addEventListener("scroll", () => {
  const d = scrollY - lastY; if (Math.abs(d) > .5) lastDir = Math.sign(d); lastY = scrollY;
  clearTimeout(settleT); if (!glide) settleT = setTimeout(settle, 170);
}, { passive: true });
for (const ev of ["wheel", "touchstart", "keydown", "mousedown"]) addEventListener(ev, () => { glide = null; }, { passive: true });
const sub = document.getElementById("sub"), line = document.getElementById("line");
const slug = document.getElementById("slug"), tc = document.getElementById("tc");
const titlecard = document.getElementById("titlecard"), endcard = document.getElementById("endcard");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// one scene, two views: the stage (orthographic, in screen pixels, y up = -screen y) and a reaction-cam portrait
const gl = new THREE.WebGLRenderer({ canvas: document.getElementById("gl"), alpha: true, antialias: !LOW, powerPreference: "high-performance" });
const glP = LOW ? null : new THREE.WebGLRenderer({ canvas: document.getElementById("portrait"), alpha: true, antialias: true });
for (const r of [gl, glP].filter(Boolean)) { r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.0; r.setClearColor(0x000000, 0); }
gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFSoftShadowMap;
const stage3 = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(FOV, 1, .05, 400);
const camP = new THREE.PerspectiveCamera(22, 1, .02, 60);
// diorama studio rig: warm key with soft shadows, cool fill, white rim, sky/ground bounce
const hemi = new THREE.HemisphereLight(0xe6ecff, 0x6b5a50, .85);
const key = new THREE.DirectionalLight(0xfff0dc, 2.3);
key.castShadow = true; key.shadow.mapSize.set(LOW ? 1024 : 2048, LOW ? 1024 : 2048); key.shadow.radius = 4; key.shadow.bias = -.0005; key.shadow.normalBias = .02;
const fill = new THREE.DirectionalLight(0xc8d6ff, .55);
const rim = new THREE.DirectionalLight(0xffffff, 1.4);
stage3.add(hemi, key, key.target, fill, rim);
window.filmLoad && window.filmLoad(.65);
const EMMA = buildEmma();
const RIG = new THREE.Group(); stage3.add(RIG);
RIG.add(EMMA.root);
const PROPS = buildProps(EMMA);
RIG.add(PROPS.world);
stage3.fog = new THREE.Fog(0xffffff, 22, 130);
EMMA.root.traverse(o => { if (o.isMesh && (o.material.transparent || o.material.isMeshBasicMaterial)) o.castShadow = false; });

// key and rim light per scene: warm dawn, white noon, lamp-lit studio, gold hour, sunset, neon magenta + cyan, bookshop amber, dusk, moonlight
// key and rim light per scene
const LIGHT = {
  hills: ["#ffc59a", "#ffd7b0"], airport: ["#f4f8ff", "#dfeeff"], city: ["#fff4e4", "#e6f0ff"], studio: ["#ffe6c4", "#cfe6ff"], workshop: ["#ffd6a0", "#ffbf86"],
  park: ["#ffab78", "#ffb070"], lounge: ["#ffcf8a", "#ff9a6a"], karaoke: ["#ff8fd0", "#5fe0ff"], tokyo: ["#ff9ac8", "#6fe6ff"], tvroom: ["#c8b8ff", "#ff9ab8"],
  books: ["#ffcf8a", "#ffd9a0"], ailab: ["#e6ecff", "#ff9a6a"], coast: ["#ffb48a", "#ff9f7a"], sea: ["#c4cdff", "#9fbcff"], rooftop: ["#ffd0e0", "#a9c4ff"],
};
const KEYC = keysOf(s => LIGHT[s.env][0]), RIMC = keysOf(s => LIGHT[s.env][1]);
const POSE_BY_ENV = {
  hills: { yaw: 0, wave: 1 },                                         // waves hello
  airport: { yaw: .35, pull: 1, props: ["suitcase"] },                // suitcase in hand, ready to go
  city: { yaw: .5, hips: 1 },                                         // hands on hips, three-quarter view
  studio: { yaw: .25, type: 1, props: ["desk"] },                     // typing at the standing desk
  workshop: { yaw: .3, talk: 1 },                                     // talks through the projects
  ailab: { yaw: -.35, pair: 1 },                                      // explains the plan to Claude
  park: { yaw: .1, sit: 1, guitar: 1, props: ["guitar", "notes", "bench"] }, // sits on the bench and plays guitar
  lounge: { yaw: 1.15, piano: 1, props: ["piano", "notes"] },          // plays the grand piano
  karaoke: { yaw: .1, sing: 1, props: ["mic", "spot", "notes"] },     // sings under a spotlight
  tokyo: { yaw: .1, selfie: 1, props: ["camera"] },                   // a selfie with a peace sign
  tvroom: { yaw: .15, popcorn: 1, props: ["popcorn"] },               // one more episode, with popcorn
  books: { yaw: .15, read: 1, props: ["book", "cards"] },             // reads, flashcards orbit
  coast: { yaw: .95, pet: 1, props: ["capy"] },                       // pets the capybara
  sea: { yaw: Math.PI, look: -.2 },                                   // looks out at the sea and the moon
  rooftop: { yaw: 0, joy: 1 },                                        // festa fireworks, both arms up
};
const SCENE_POSE = SCENES.map(s => POSE_BY_ENV[s.env]);

let target = 0, p = 0, lastP = 0, vel = 0, scene = 0, lastMove = -1e9;
let walkPh = 0, walkW = 0, rotY = 0, waveA = 0, hipsA = 0, talkA = 0, joyA = 0, lookA = 0, cheekA = 0, enteredAt = 0;
let sitA = 0, selfieA = 0, pairA = 0;
let typeA = 0, guitarA = 0, singA = 0, readA = 0, petA = 0, pullA = 0, pianoA = 0, popcornA = 0;

function resizeActor() {
  gl.setPixelRatio(DPR); gl.setSize(W, H, false);
  if (glP) { const pc = glP.domElement; glP.setPixelRatio(DPR); glP.setSize(pc.clientWidth, pc.clientHeight, false); }
}
let rawS = 0, endAt = 0, booted = false;
const ENTER_AFTER = 6, countEl = document.getElementById("count");
function enterSite() { location.href = "/app.html"; }
function rawProgress() { const max = track.offsetHeight - innerHeight; return max > 0 ? clamp(scrollY / max, 0, 1) : 0; }
const factEl = document.getElementById("fact");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
function renderFact(f) {
  if (!f) { factEl.hidden = true; return; }
  factEl.hidden = false; factEl.classList.remove("swap");
  let h = `<h3>${esc(f.title)}</h3>`;
  if (f.bars) h += f.bars.map(([n, v]) => `<div class="bar-row"><span>${esc(n)}</span><span class="track-bar"><i style="width:${v}%"></i></span><span class="pct">${v}</span></div>`).join("");
  const chips = [...(f.links || []).map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ↗</a>`), ...(f.chips || []).map(c => `<span>${esc(c)}</span>`)];
  if (chips.length) h += `<div class="chips">${chips.join("")}</div>`;
  factEl.innerHTML = h;
}
function setScene(i, t) {
  if (i === scene) return;
  scene = i; enteredAt = t;
  sub.classList.add("swap"); slug.style.opacity = 0; factEl.classList.add("swap");
  setTimeout(() => {
    const sc = SCENES[i];
    line.innerHTML = sc.line; slug.textContent = "Reel 1 · " + sc.slug;
    renderFact(sc.fact);
    sub.classList.remove("swap"); slug.style.opacity = 1;
  }, 250);
}
function timecode(p) {
  const f = Math.floor(p * 3 * 60 * 24); // a 3-minute reel at 24fps
  const pad = n => String(n).padStart(2, "0");
  return `00:${pad(Math.floor(f / 1440))}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`;
}
const approach = (v, to, k) => v + (to - v) * k;
const v3 = new THREE.Vector3(), d3 = new THREE.Vector3();
const toLin = (c, rgb) => c.setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255).convertSRGBToLinear();

function frame(now) {
  const t = now / 1000;
  const rawT = rawProgress();
  rawS += (rawT - rawS) * (reduce ? 1 : .12);
  if (Math.abs(rawT - rawS) < 1e-6) rawS = rawT;
  p = target = filmProgress(rawS);
  vel = p - lastP; lastP = p;
  if (Math.abs(vel) > 2e-5) lastMove = now;
  const moving = now - lastMove < 160;
  const si = sceneOf(p * .9999), SP = SCENE_POSE[si];
  setScene(si, t);

  // he walks in place while the world scrolls past, then steps to centre stage for the finale
  SHOT = currentShot();
  drawSky(p, now, SHOT);

  // pose state, eased like animation curves
  walkW = approach(walkW, moving ? 1 : 0, .18);
  walkPh += Math.min(Math.abs(vel) * N * L3 * 5.5, .5);
  const wantRot = moving ? (vel > 0 ? Math.PI / 2 : -Math.PI / 2) : SP.yaw;
  let dr = wantRot - rotY; dr = Math.atan2(Math.sin(dr), Math.cos(dr));
  rotY += dr * (reduce ? 1 : .14);
  const still = !moving;
  waveA = approach(waveA, SP.wave && still ? 1 : 0, .1);
  hipsA = approach(hipsA, SP.hips && still ? 1 : 0, .1);
  talkA = approach(talkA, SP.talk && still ? 1 : 0, .1);
  joyA = approach(joyA, SP.joy && still ? 1 : 0, .1);
  lookA = approach(lookA, SP.look && still ? 1 : 0, .06);
  typeA = approach(typeA, SP.type && still ? 1 : 0, .1); guitarA = approach(guitarA, SP.guitar && still ? 1 : 0, .1);
  singA = approach(singA, SP.sing && still ? 1 : 0, .1); readA = approach(readA, SP.read && still ? 1 : 0, .1); petA = approach(petA, SP.pet && still ? 1 : 0, .1);
  pullA = approach(pullA, SP.pull && still ? 1 : 0, .1); pianoA = approach(pianoA, SP.piano && still ? 1 : 0, .1); sitA = approach(sitA, SP.sit && still ? 1 : 0, .1); selfieA = approach(selfieA, SP.selfie && still ? 1 : 0, .1); pairA = approach(pairA, SP.pair && still ? 1 : 0, .1); popcornA = approach(popcornA, SP.popcorn && still ? 1 : 0, .1);
  const since = t - enteredAt; // a delighted hand-to-cheek double take as each new scene settles in
  cheekA = approach(cheekA, still && since > .25 && since < 1.3 && (SCENES[si].env === "city" || SCENES[si].env === "workshop") ? 1 : 0, .16);

  const P = basePose(t, reduce);
  P.rotY = rotY;
  const idle = 1 - walkW;
  addWalk(P, walkPh, walkW);
  addWave(P, t, waveA * idle, "R");
  addHips(P, hipsA * idle * (1 - cheekA));
  addTalk(P, t, talkA * idle * (1 - cheekA), "L");
  addCheek(P, cheekA * idle, "R");
  addJoy(P, t, joyA * idle);
  addType(P, t, typeA * idle); addGuitar(P, t, guitarA * idle); addSing(P, t, singA * idle); addRead(P, t, readA * idle); addPet(P, t, petA * idle);
  addPull(P, t, pullA * idle); addPiano(P, t, pianoA * idle); addSit(P, sitA * idle); addSelfie(P, t, selfieA * idle); addPair(P, t, pairA * idle); addPopcorn(P, t, popcornA * idle);
  P.headX += (SP.look || 0) * lookA;
  applyPose(EMMA, P);

  const X = p * N * L3;
  EMMA.root.position.set(0, 0, 0); RIG.position.set(X, 0, 0);
  const want = new Set(still ? SP.props || [] : []), aiAt = envIndex("ailab");
  if (p >= (aiAt + .35) / N) want.add("claude");
  const cl = PROPS.all.claude, inLab = SCENES[si].env === "ailab" && still;
  const cx = inLab ? -.56 : -.5 - walkW * .06, cy = inLab ? 1.04 : 1.06 + walkW * .04;
  cl.position.x = approach(cl.position.x, cx, .06); cl.position.y = approach(cl.position.y, cy, .06); cl.position.z = .14;
  cl.rotation.y = approach(cl.rotation.y, inLab ? .35 : .15, .06);
  updateProps(PROPS, want, t);

  // light him with the scene's sky: warm dawn, white noon, gold hour, moonlit night
  toLin(key.color, keyed(KEYC, p)); toLin(rim.color, keyed(RIMC, p));
  toLin(hemi.color, keyed(SKY_TOP, p).map(v => lerp(v, 235, .55))); toLin(hemi.groundColor, keyed(GROUND, p));
  const night = keyedN(NIGHT, p);
  key.intensity = lerp(2.3, 1.25, night); rim.intensity = lerp(1.3, 2.6, night); hemi.intensity = lerp(.85, .6, night);
  key.target.position.set(X, .6, 0); key.position.set(X - 4, 8, 6);
  const sc = key.shadow.camera; sc.left = -7; sc.right = 7; sc.top = 7; sc.bottom = -7; sc.near = .5; sc.far = 30; sc.updateProjectionMatrix();
  fill.position.set(X + 6, 3, 6); fill.target = key.target;
  rim.position.set(X + 2.5, 5, -7); rim.target = key.target;
  toLin(stage3.fog.color, keyed(SKY_BOT, p));
  if (PROPS.all.camera.visible) { RIG.updateMatrixWorld(true); EMMA.rig.F.getWorldPosition(v3); PROPS.all.camera.lookAt(v3); }
  placeCamera(cam, SHOT, X, EMMA.height);
  updateWorld3D(t, si);
  gl.render(stage3, cam);
  if (!booted) { booted = true; window.filmReady && window.filmReady(); }

  // reaction cam: always finds his face, wherever he is turned (desktop only)
  if (glP) {
    EMMA.rig.F.getWorldPosition(v3); EMMA.rig.F.getWorldDirection(d3);
    d3.y = 0; d3.normalize();
    camP.position.copy(v3).addScaledVector(d3, 1.15); camP.position.y += .03;
    camP.lookAt(v3.x, v3.y - .03, v3.z);
    glP.render(stage3, camP);
  }

  tc.textContent = timecode(p);
  titlecard.style.opacity = clamp(1 - p / .05, 0, 1);
  titlecard.style.transform = `translateY(${-p * 600}px)`;
  endcard.classList.toggle("on", p > 1 - .7 / N);
  factEl.style.opacity = p > 1 - .9 / N ? 0 : "";
  const atStop = STOPS.findIndex(s => Math.abs(s - p) < .004);
  dotEls.forEach((d, i) => d.classList.toggle("on", i === si));
  nextEl.classList.toggle("on", atStop >= 0 && atStop < STOPS.length - 1 && now - lastMove > 1400);
  if (atStop === STOPS.length - 1 && !moving) {
    endAt = endAt || now;
    const left = Math.ceil(ENTER_AFTER - (now - endAt) / 1000);
    if (left <= 0) return enterSite();
    countEl.textContent = `Opening the website in ${left}…`;
  } else { endAt = 0; countEl.textContent = ""; }
  requestAnimationFrame(frame);
}

addEventListener("resize", () => { resize(); resizeActor(); });
resize(); resizeActor(); renderFact(SCENES[0].fact); line.innerHTML = SCENES[0].line; slug.textContent = "Reel 1 · " + SCENES[0].slug;
buildWorld3D(stage3).then(() => requestAnimationFrame(frame));

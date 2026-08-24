/**
 * Deterministic SVG "film still" renderer.
 * Produces atmospheric, cinematic placeholder frames with no external assets.
 */

/* ------------------------------------------------------------------ random */

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRandom(seedString) {
  const rand = mulberry32(hashString(seedString));
  return {
    next: rand,
    range: (min, max) => min + rand() * (max - min),
    int: (min, max) => Math.floor(min + rand() * (max - min + 1)),
    pick: (arr) => arr[Math.floor(rand() * arr.length)],
    chance: (p) => rand() < p,
  };
}

/* ----------------------------------------------------------------- palette */

export const PALETTES = {
  tealOrange: { deep: '#04080b', mid: '#0c2027', low: '#173a42', accent: '#e08a4c', glow: '#f3b678' },
  amberNoir: { deep: '#050403', mid: '#16110a', low: '#382a16', accent: '#d9a34a', glow: '#f0cf90' },
  monsoon: { deep: '#03060a', mid: '#091520', low: '#163040', accent: '#7fa3bd', glow: '#cfe2ef' },
  desert: { deep: '#0a0704', mid: '#1d1208', low: '#4b2d12', accent: '#e8a95c', glow: '#ffd9a0' },
  neon: { deep: '#03030a', mid: '#0b0a1f', low: '#241a45', accent: '#ff6fbe', glow: '#5ee0f0' },
  forest: { deep: '#02050a', mid: '#08130f', low: '#153021', accent: '#8fae72', glow: '#d8e6c2' },
  studio: { deep: '#040404', mid: '#101010', low: '#252525', accent: '#d8d2c6', glow: '#ffffff' },
  crimson: { deep: '#07030a', mid: '#1a0810', low: '#3f101d', accent: '#d8506a', glow: '#ffb3c0' },
  ice: { deep: '#03060a', mid: '#0a1420', low: '#1b3346', accent: '#9fc4d8', glow: '#e8f5ff' },
  sepia: { deep: '#0a0806', mid: '#1b140d', low: '#45331f', accent: '#c9a15e', glow: '#f0dcb4' },
  indigo: { deep: '#03040c', mid: '#0a0e22', low: '#1a2350', accent: '#8f9ff0', glow: '#dfe4ff' },
  ember: { deep: '#080402', mid: '#1c0d05', low: '#4a1d09', accent: '#ff8a3d', glow: '#ffd0a0' },
};

export const PALETTE_KEYS = Object.keys(PALETTES);

/* ------------------------------------------------------------------ shapes */

const fmt = (n) => Math.round(n * 100) / 100;

function smoothRidge(points, close, w, h) {
  let d = 'M ' + fmt(points[0][0]) + ' ' + fmt(points[0][1]);
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const cx = (x0 + x1) / 2;
    d += ' C ' + fmt(cx) + ' ' + fmt(y0) + ' ' + fmt(cx) + ' ' + fmt(y1) + ' ' + fmt(x1) + ' ' + fmt(y1);
  }
  if (close) d += ' L ' + fmt(w) + ' ' + fmt(h) + ' L 0 ' + fmt(h) + ' Z';
  return d;
}

const rect = (x, y, w, h, attrs) =>
  '<rect x="' + fmt(x) + '" y="' + fmt(y) + '" width="' + fmt(w) + '" height="' + fmt(h) + '"' + (attrs || '') + '/>';

const circle = (cx, cy, r, attrs) =>
  '<circle cx="' + fmt(cx) + '" cy="' + fmt(cy) + '" r="' + fmt(r) + '"' + (attrs || '') + '/>';

const ellipse = (cx, cy, rx, ry, attrs) =>
  '<ellipse cx="' + fmt(cx) + '" cy="' + fmt(cy) + '" rx="' + fmt(rx) + '" ry="' + fmt(ry) + '"' + (attrs || '') + '/>';

/* ------------------------------------------------------------------ motifs */

const motifs = {
  skyline(w, h, p, r) {
    let out = '';
    const horizon = h * 0.72;
    out += rect(0, horizon - h * 0.3, w, h * 0.32, ' fill="url(#haze)" opacity="0.55"');
    for (let layer = 0; layer < 3; layer += 1) {
      const t = layer / 2;
      const baseY = horizon - h * 0.06 + layer * h * 0.06;
      const color = layer === 2 ? p.deep : layer === 1 ? p.mid : p.low;
      const opacity = 0.55 + layer * 0.2;
      let x = -w * 0.05;
      let blocks = '';
      while (x < w * 1.05) {
        const bw = r.range(w * 0.02, w * 0.09);
        const bh = r.range(h * 0.08, h * 0.34) * (1 - t * 0.25);
        const y = baseY - bh;
        blocks += rect(x, y, bw, bh + h * 0.3);
        if (r.chance(0.35)) {
          const aw = bw * r.range(0.06, 0.14);
          blocks += rect(x + bw / 2 - aw / 2, y - h * r.range(0.02, 0.07), aw, h * 0.08);
        }
        x += bw + r.range(w * 0.004, w * 0.02);
      }
      out += '<g fill="' + color + '" opacity="' + fmt(opacity) + '">' + blocks + '</g>';
      if (layer === 0) {
        let wins = '';
        for (let i = 0; i < 150; i += 1) {
          wins += rect(
            r.range(0, w),
            r.range(baseY - h * 0.3, baseY - h * 0.02),
            w * 0.0035,
            h * 0.008,
            ' opacity="' + fmt(r.range(0.1, 0.75)) + '"',
          );
        }
        out += '<g fill="' + p.glow + '">' + wins + '</g>';
      }
    }
    return out;
  },

  mountains(w, h, p, r) {
    let out = rect(0, h * 0.35, w, h * 0.4, ' fill="url(#haze)" opacity="0.5"');
    const colors = [p.mid, p.low, p.mid, p.deep];
    for (let layer = 0; layer < 4; layer += 1) {
      const baseY = h * (0.5 + layer * 0.09);
      const amp = h * (0.2 - layer * 0.035);
      const pts = [];
      const steps = 7 + layer;
      for (let i = 0; i <= steps; i += 1) {
        pts.push([(w * i) / steps, baseY - Math.abs(r.range(-amp, amp))]);
      }
      out +=
        '<path d="' + smoothRidge(pts, true, w, h) + '" fill="' + colors[layer] +
        '" opacity="' + fmt(0.45 + layer * 0.17) + '"/>';
    }
    return out;
  },

  dunes(w, h, p, r) {
    let out = '';
    const colors = [p.low, p.mid, p.mid, p.deep];
    for (let layer = 0; layer < 4; layer += 1) {
      const baseY = h * (0.55 + layer * 0.11);
      const pts = [];
      for (let i = 0; i <= 4; i += 1) {
        pts.push([(w * i) / 4, baseY + r.range(-h * 0.08, h * 0.05)]);
      }
      out +=
        '<path d="' + smoothRidge(pts, true, w, h) + '" fill="' + colors[layer] +
        '" opacity="' + fmt(0.5 + layer * 0.15) + '"/>';
    }
    return out;
  },

  sea(w, h, p, r) {
    const horizon = h * 0.58;
    let out = rect(0, horizon, w, h - horizon, ' fill="url(#water)"');
    out += circle(w * r.range(0.25, 0.75), horizon - h * 0.04, h * 0.045, ' fill="' + p.glow + '" opacity="0.75"');
    let streaks = '';
    for (let i = 0; i < 60; i += 1) {
      const y = horizon + Math.pow(r.next(), 1.6) * (h - horizon);
      const len = r.range(w * 0.01, w * 0.13) * ((y - horizon) / (h - horizon) + 0.2);
      streaks += rect(r.range(0, w), y, len, h * 0.0022, ' opacity="' + fmt(r.range(0.05, 0.4)) + '"');
    }
    out += '<g fill="' + p.glow + '">' + streaks + '</g>';
    return out;
  },

  forest(w, h, p, r) {
    let out = rect(0, 0, w, h, ' fill="url(#haze)" opacity="0.35"');
    const colors = [p.deep, p.mid, p.low];
    for (let layer = 0; layer < 3; layer += 1) {
      let trunks = '';
      const count = 7 + layer * 5;
      for (let i = 0; i < count; i += 1) {
        const tw = r.range(w * 0.006, w * 0.03) * (1 + (2 - layer) * 0.4);
        trunks += rect(r.range(-w * 0.05, w * 1.05), r.range(-h * 0.1, 0), tw, h * r.range(0.75, 1.15));
      }
      out += '<g fill="' + colors[2 - layer] + '" opacity="' + fmt(0.35 + layer * 0.25) + '">' + trunks + '</g>';
    }
    let canopy = '';
    for (let i = 0; i < 16; i += 1) {
      canopy += ellipse(
        r.range(0, w),
        r.range(-h * 0.05, h * 0.22),
        r.range(w * 0.05, w * 0.16),
        r.range(h * 0.05, h * 0.14),
      );
    }
    out += '<g fill="' + p.deep + '" opacity="0.75">' + canopy + '</g>';
    out += rect(0, h * 0.86, w, h * 0.14, ' fill="' + p.deep + '" opacity="0.9"');
    return out;
  },

  rain(w, h, p, r) {
    let out = rect(0, h * 0.66, w, h * 0.34, ' fill="' + p.deep + '" opacity="0.85"');
    let lines = '';
    for (let i = 0; i < 240; i += 1) {
      const x = r.range(-w * 0.1, w * 1.1);
      const y = r.range(-h * 0.1, h);
      const len = r.range(h * 0.03, h * 0.12);
      lines +=
        '<line x1="' + fmt(x) + '" y1="' + fmt(y) + '" x2="' + fmt(x - len * 0.22) +
        '" y2="' + fmt(y + len) + '" opacity="' + fmt(r.range(0.06, 0.34)) + '"/>';
    }
    out += '<g stroke="' + p.glow + '" stroke-width="' + fmt(w * 0.0012) + '">' + lines + '</g>';
    let refl = '';
    for (let i = 0; i < 26; i += 1) {
      refl += rect(
        r.range(0, w),
        r.range(h * 0.68, h),
        r.range(w * 0.02, w * 0.12),
        h * 0.004,
        ' opacity="' + fmt(r.range(0.08, 0.35)) + '"',
      );
    }
    out += '<g fill="' + p.accent + '">' + refl + '</g>';
    return out;
  },

  neon(w, h, p, r) {
    let out = motifs.skyline(w, h, p, r);
    for (let i = 0; i < 9; i += 1) {
      const x = r.range(w * 0.04, w * 0.9);
      const y = r.range(h * 0.28, h * 0.66);
      const sw = r.range(w * 0.03, w * 0.13);
      const sh = r.range(h * 0.008, h * 0.05);
      const c = r.chance(0.5) ? p.accent : p.glow;
      out += rect(x, y, sw, sh, ' rx="' + fmt(sh * 0.2) + '" fill="' + c + '" opacity="' + fmt(r.range(0.35, 0.9)) + '"');
      out += rect(x - sw * 0.15, y - sh * 0.6, sw * 1.3, sh * 2.2, ' rx="' + fmt(sh) + '" fill="' + c + '" opacity="0.14"');
    }
    out += rect(0, h * 0.78, w, h * 0.22, ' fill="' + p.deep + '" opacity="0.6"');
    return out;
  },

  interior(w, h, p, r) {
    const wx = w * r.range(0.52, 0.68);
    const wy = h * 0.16;
    const ww = w * 0.24;
    const wh = h * 0.44;
    let out = rect(0, 0, w, h, ' fill="' + p.mid + '" opacity="0.5"');
    out += rect(wx, wy, ww, wh, ' fill="url(#shaft)" opacity="0.95"');
    out +=
      '<polygon points="' + fmt(wx) + ',' + fmt(wy) + ' ' + fmt(wx + ww) + ',' + fmt(wy) + ' ' +
      fmt(wx + ww * 2.1) + ',' + fmt(h) + ' ' + fmt(wx - ww * 1.2) + ',' + fmt(h) +
      '" fill="' + p.glow + '" opacity="0.09"/>';
    out += '<g stroke="' + p.deep + '" stroke-width="' + fmt(w * 0.004) + '" opacity="0.8">';
    out +=
      '<line x1="' + fmt(wx + ww / 2) + '" y1="' + fmt(wy) + '" x2="' + fmt(wx + ww / 2) +
      '" y2="' + fmt(wy + wh) + '"/>';
    out +=
      '<line x1="' + fmt(wx) + '" y1="' + fmt(wy + wh / 2) + '" x2="' + fmt(wx + ww) +
      '" y2="' + fmt(wy + wh / 2) + '"/></g>';
    out += rect(0, h * 0.78, w, h * 0.22, ' fill="' + p.deep + '" opacity="0.75"');
    const sx = w * r.range(0.2, 0.34);
    out += '<g fill="' + p.deep + '" opacity="0.92">' + circle(sx, h * 0.5, h * 0.075);
    out +=
      '<path d="M ' + fmt(sx - h * 0.16) + ' ' + fmt(h) + ' C ' + fmt(sx - h * 0.14) + ' ' + fmt(h * 0.64) +
      ' ' + fmt(sx + h * 0.14) + ' ' + fmt(h * 0.64) + ' ' + fmt(sx + h * 0.16) + ' ' + fmt(h) + ' Z"/></g>';
    return out;
  },

  portrait(w, h, p, r) {
    const cx = w * r.range(0.4, 0.6);
    const headR = Math.min(w, h) * r.range(0.15, 0.19);
    const headY = h * 0.4;
    let bokeh = '';
    for (let i = 0; i < 22; i += 1) {
      bokeh += circle(
        r.range(0, w),
        r.range(0, h * 0.85),
        r.range(w * 0.01, w * 0.05),
        ' opacity="' + fmt(r.range(0.05, 0.3)) + '"',
      );
    }
    let out = '<g fill="' + p.glow + '">' + bokeh + '</g>';
    out += circle(cx, headY, headR * 1.7, ' fill="url(#rim)" opacity="0.6"');
    out += '<g fill="' + p.deep + '" opacity="0.96">';
    out += ellipse(cx, headY, headR * 0.86, headR);
    out +=
      '<path d="M ' + fmt(cx - headR * 2.5) + ' ' + fmt(h) + ' C ' + fmt(cx - headR * 2.2) + ' ' +
      fmt(headY + headR * 1.3) + ' ' + fmt(cx + headR * 2.2) + ' ' + fmt(headY + headR * 1.3) + ' ' +
      fmt(cx + headR * 2.5) + ' ' + fmt(h) + ' Z"/></g>';
    out +=
      '<path d="M ' + fmt(cx - headR * 0.86) + ' ' + fmt(headY) + ' A ' + fmt(headR * 0.86) + ' ' +
      fmt(headR) + ' 0 0 1 ' + fmt(cx) + ' ' + fmt(headY - headR) + '" fill="none" stroke="' + p.accent +
      '" stroke-width="' + fmt(headR * 0.07) + '" opacity="0.55"/>';
    return out;
  },

  studio(w, h, p, r) {
    let out = rect(0, 0, w, h, ' fill="url(#soft)"');
    const stands = r.int(2, 3);
    for (let i = 0; i < stands; i += 1) {
      const x = w * (0.12 + i * 0.32) + r.range(-w * 0.04, w * 0.04);
      const boxW = w * r.range(0.07, 0.12);
      const boxH = boxW * 1.4;
      const topY = h * r.range(0.1, 0.26);
      out += rect(x, topY, boxW, boxH, ' rx="' + fmt(boxW * 0.06) + '" fill="' + p.deep + '" opacity="0.9"');
      out += rect(
        x + boxW * 0.08,
        topY + boxH * 0.06,
        boxW * 0.84,
        boxH * 0.88,
        ' fill="' + p.glow + '" opacity="' + fmt(r.range(0.1, 0.3)) + '"',
      );
      out += rect(x + boxW * 0.46, topY + boxH, w * 0.005, h - topY - boxH, ' fill="' + p.deep + '" opacity="0.85"');
    }
    out += rect(0, h * 0.82, w, h * 0.18, ' fill="' + p.deep + '" opacity="0.55"');
    return out;
  },

  road(w, h, p, r) {
    const horizon = h * 0.56;
    const vx = w * r.range(0.4, 0.6);
    let out = rect(0, horizon, w, h - horizon, ' fill="' + p.deep + '" opacity="0.9"');
    out +=
      '<polygon points="' + fmt(vx - w * 0.02) + ',' + fmt(horizon) + ' ' + fmt(vx + w * 0.02) + ',' + fmt(horizon) +
      ' ' + fmt(w * 1.1) + ',' + fmt(h) + ' ' + fmt(-w * 0.1) + ',' + fmt(h) + '" fill="' + p.mid + '" opacity="0.9"/>';
    let dashes = '';
    let y = horizon + h * 0.02;
    let step = h * 0.012;
    while (y < h) {
      const t = (y - horizon) / (h - horizon);
      dashes += rect(
        vx - w * 0.004 - t * w * 0.006,
        y,
        w * 0.008 + t * w * 0.014,
        step * 0.6,
        ' opacity="' + fmt(0.2 + t * 0.5) + '"',
      );
      y += step;
      step *= 1.28;
    }
    out += '<g fill="' + p.glow + '">' + dashes + '</g>';
    out += circle(vx, horizon, h * 0.14, ' fill="' + p.accent + '" opacity="0.22"');
    for (let i = 0; i < 7; i += 1) {
      const side = r.chance(0.5) ? -1 : 1;
      const t = r.range(0.06, 1);
      const px = vx + side * (w * 0.06 + t * w * 0.55);
      const ph = h * (0.08 + t * 0.3);
      out += rect(px, horizon - ph, w * 0.003 + t * w * 0.004, ph + h * 0.05, ' fill="' + p.deep + '" opacity="0.85"');
    }
    return out;
  },

  crowd(w, h, p, r) {
    let out = rect(0, 0, w, h, ' fill="url(#haze)" opacity="0.4"');
    const colors = [p.low, p.mid, p.deep];
    for (let layer = 0; layer < 3; layer += 1) {
      let heads = '';
      const count = 6 + layer * 6;
      const baseY = h * (0.72 + layer * 0.12);
      const rr = Math.min(w, h) * (0.075 - layer * 0.015);
      for (let i = 0; i < count; i += 1) {
        const x = r.range(-w * 0.05, w * 1.05);
        const y = baseY + r.range(-h * 0.03, h * 0.03);
        heads += circle(x, y, rr);
        heads += ellipse(x, y + rr * 2.4, rr * 1.7, rr * 2);
      }
      out += '<g fill="' + colors[layer] + '" opacity="' + fmt(0.55 + layer * 0.18) + '">' + heads + '</g>';
    }
    return out;
  },
};

export const MOTIF_KEYS = Object.keys(motifs);

/* ------------------------------------------------------------------ render */

export function renderStill(options) {
  const {
    id,
    width = 1920,
    height = 1080,
    palette = 'tealOrange',
    motif = 'skyline',
    letterbox = false,
    flare = true,
    grain = true,
    vignette = 0.9,
  } = options;

  const p = PALETTES[palette] || PALETTES.tealOrange;
  const r = makeRandom(id + ':' + palette + ':' + motif);
  const w = width;
  const h = height;
  const sunX = r.range(0.18, 0.82);
  const sunY = r.range(0.14, 0.42);

  const defs = [
    '<defs>',
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">',
    '<stop offset="0%" stop-color="' + p.deep + '"/>',
    '<stop offset="42%" stop-color="' + p.mid + '"/>',
    '<stop offset="78%" stop-color="' + p.low + '"/>',
    '<stop offset="100%" stop-color="' + p.deep + '"/>',
    '</linearGradient>',
    '<radialGradient id="sun" cx="' + fmt(sunX * 100) + '%" cy="' + fmt(sunY * 100) + '%" r="62%">',
    '<stop offset="0%" stop-color="' + p.glow + '" stop-opacity="0.72"/>',
    '<stop offset="34%" stop-color="' + p.accent + '" stop-opacity="0.28"/>',
    '<stop offset="100%" stop-color="' + p.accent + '" stop-opacity="0"/>',
    '</radialGradient>',
    '<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">',
    '<stop offset="0%" stop-color="' + p.accent + '" stop-opacity="0.16"/>',
    '<stop offset="100%" stop-color="' + p.glow + '" stop-opacity="0"/>',
    '</linearGradient>',
    '<linearGradient id="water" x1="0" y1="0" x2="0" y2="1">',
    '<stop offset="0%" stop-color="' + p.low + '"/>',
    '<stop offset="100%" stop-color="' + p.deep + '"/>',
    '</linearGradient>',
    '<linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">',
    '<stop offset="0%" stop-color="' + p.glow + '" stop-opacity="0.85"/>',
    '<stop offset="100%" stop-color="' + p.accent + '" stop-opacity="0.35"/>',
    '</linearGradient>',
    '<linearGradient id="soft" x1="0" y1="0" x2="1" y2="1">',
    '<stop offset="0%" stop-color="' + p.mid + '"/>',
    '<stop offset="60%" stop-color="' + p.deep + '"/>',
    '<stop offset="100%" stop-color="#000000"/>',
    '</linearGradient>',
    '<radialGradient id="rim" cx="50%" cy="50%" r="50%">',
    '<stop offset="60%" stop-color="' + p.accent + '" stop-opacity="0.34"/>',
    '<stop offset="100%" stop-color="' + p.accent + '" stop-opacity="0"/>',
    '</radialGradient>',
    '<radialGradient id="vig" cx="50%" cy="46%" r="72%">',
    '<stop offset="45%" stop-color="#000000" stop-opacity="0"/>',
    '<stop offset="100%" stop-color="#000000" stop-opacity="' + fmt(vignette) + '"/>',
    '</radialGradient>',
    '<linearGradient id="flareG" x1="0" y1="0" x2="1" y2="0">',
    '<stop offset="0%" stop-color="' + p.glow + '" stop-opacity="0"/>',
    '<stop offset="50%" stop-color="' + p.glow + '" stop-opacity="0.5"/>',
    '<stop offset="100%" stop-color="' + p.glow + '" stop-opacity="0"/>',
    '</linearGradient>',
    '<pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">',
    '<rect x="0" y="0" width="4" height="1" fill="#ffffff" opacity="0.035"/>',
    '</pattern>',
    '<pattern id="dust" width="7" height="7" patternUnits="userSpaceOnUse">',
    '<rect x="0" y="0" width="1" height="1" fill="#ffffff" opacity="0.07"/>',
    '<rect x="4" y="3" width="1" height="1" fill="#000000" opacity="0.09"/>',
    '<rect x="2" y="5" width="1" height="1" fill="#ffffff" opacity="0.045"/>',
    '</pattern>',
    '</defs>',
  ].join('');

  const body = motifs[motif] ? motifs[motif](w, h, p, r) : motifs.skyline(w, h, p, r);

  let extra = '';
  if (flare) {
    const fy = h * sunY;
    extra += ellipse(w * sunX, fy, w * 0.55, h * 0.006, ' fill="url(#flareG)" opacity="0.5"');
    extra += circle(w * sunX, fy, h * 0.02, ' fill="' + p.glow + '" opacity="0.35"');
  }

  const bars = letterbox
    ? rect(0, 0, w, h * 0.085, ' fill="#000"') + rect(0, h * 0.915, w, h * 0.085, ' fill="#000"')
    : '';

  const grainLayer = grain
    ? rect(0, 0, w, h, ' fill="url(#dust)"') + rect(0, 0, w, h, ' fill="url(#scan)"')
    : '';

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h +
      '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Cinematic placeholder frame">',
    defs,
    rect(0, 0, w, h, ' fill="url(#sky)"'),
    rect(0, 0, w, h, ' fill="url(#sun)"'),
    body,
    extra,
    rect(0, 0, w, h, ' fill="' + p.accent + '" opacity="0.05" style="mix-blend-mode:overlay"'),
    grainLayer,
    rect(0, 0, w, h, ' fill="url(#vig)"'),
    bars,
    '</svg>',
  ].join('\n');
}

/* ------------------------------------------------------------- client logo */

export function renderLogo(name, id) {
  const r = makeRandom('logo:' + id);
  const w = 420;
  const h = 120;
  const label = String(name).toUpperCase();
  const glyph = label.replace(/[^A-Z]/g, '').slice(0, 2) || 'PP';
  const shape = r.int(0, 3);
  const marks = [
    '<circle cx="46" cy="60" r="26" fill="none" stroke="#ffffff" stroke-width="3"/><circle cx="46" cy="60" r="9" fill="#ffffff"/>',
    '<rect x="22" y="36" width="48" height="48" fill="none" stroke="#ffffff" stroke-width="3"/><path d="M22 84 L70 36" stroke="#ffffff" stroke-width="3" fill="none"/>',
    '<path d="M46 30 L70 60 L46 90 L22 60 Z" fill="none" stroke="#ffffff" stroke-width="3"/>',
    '<path d="M24 84 L46 32 L68 84" fill="none" stroke="#ffffff" stroke-width="3"/><line x1="33" y1="66" x2="59" y2="66" stroke="#ffffff" stroke-width="3"/>',
  ];
  const safe = label.slice(0, 22).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h +
      '" role="img" aria-label="' + safe + '">',
    '<g>' + marks[shape] + '</g>',
    '<text x="92" y="56" font-family="Inter, Helvetica, Arial, sans-serif" font-size="27" font-weight="600" letter-spacing="4" fill="#ffffff">' +
      glyph + '</text>',
    '<text x="92" y="82" font-family="Inter, Helvetica, Arial, sans-serif" font-size="15" font-weight="400" letter-spacing="5.5" fill="#ffffff" opacity="0.72">' +
      safe + '</text>',
    '</svg>',
  ].join('\n');
}

const DEFAULT_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://cors-anywhere.herokuapp.com/",
  "https://thingproxy.freeboard.io/fetch/",
  "https://api.codetabs.com/v1/proxy?quest=",
  "https://proxy.cors.sh/",
  "https://corsproxy.io/?",
];

// Helper: iterative decode of percent-encoded strings (max 3 passes)
function iterativeDecode(s) {
  let decoded = s;
  for (let i = 0; i < 3; i++) {
    if (decoded.includes('%3A') || decoded.includes('%2F') || decoded.includes('%3A%2F')) {
      const prev = decoded;
      try {
        decoded = decodeURIComponent(decoded);
      } catch (err) {
        break;
      }
      if (decoded === prev) break;
    } else {
      break;
    }
  }
  return decoded;
}

// Extract first http(s) URL deterministically without regex
function extractFirstUrl(s) {
  if (!s) return null;
  const schemes = ['https://', 'http://'];
  for (const scheme of schemes) {
    const idx = s.indexOf(scheme);
    if (idx !== -1) {
      let endIdx = s.length;
      const seps = ['"', "'", ' ', ')', ',', '\n'];
      for (const sep of seps) {
        const si = s.indexOf(sep, idx);
        if (si !== -1) endIdx = Math.min(endIdx, si);
      }
      return s.slice(idx, endIdx);
    }
  }
  return null;
}

function unwrapDevtoUrl(candidate) {
  try {
    const url = new URL(candidate);
    const host = url.hostname || '';
    const path = url.pathname || '';
    if (host.endsWith('dev.to') && path.includes('/dynamic/image')) {
      const segments = path.split('/');
      const last = segments[segments.length - 1];
      if (last) {
        let orig = decodeURIComponent(last);
        orig = decodeURIComponent(orig);
        return orig;
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

function unwrapMediumUrl(candidate) {
  try {
    const url = new URL(candidate);
    const host = url.hostname || '';
    const path = url.pathname || '';
    // cover miro.medium.com and other medium subdomains
    if (host.endsWith('medium.com')) {
      const segments = path.split('/');
      const last = segments[segments.length - 1];
      if (last) {
        const cand = decodeURIComponent(last);
        return 'https://miro.medium.com/' + cand;
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

function unwrapSubstackUrl(candidate) {
  try {
    const url = new URL(candidate);
    const host = url.hostname || '';
    const path = url.pathname || '';
    if (host.endsWith('substack.com') || host.endsWith('substackcdn.com') || host.includes('substack')) {
      const segments = path.split('/');
      const last = segments[segments.length - 1];
      if (last) {
        const orig = decodeURIComponent(last);
        if (orig.startsWith('http')) return orig;
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function isImageAccessible(candidate, timeout = 5000) {
  if (!candidate) return false;
  try {
    // Use HEAD first
    const headResp = await fetch(candidate, { method: 'HEAD', cache: 'no-store' });
    if (headResp.ok) {
      const ct = headResp.headers.get('Content-Type') || '';
      if (ct.startsWith('image/')) return true;
    }
  } catch (e) {
    // ignore and try GET fallback
  }

  try {
    // GET small range
    const getResp = await fetch(candidate, { method: 'GET', headers: { Range: 'bytes=0-0' }, cache: 'no-store' });
    if (getResp.ok) {
      const ct = getResp.headers.get('Content-Type') || '';
      return ct.startsWith('image/');
    }
  } catch (e) {
    return false;
  }
  return false;
}

// Main exported function
export async function fetchThumbnailFromPage(pageUrl, proxies = DEFAULT_PROXIES) {
  // Try proxies sequentially (keeps load light). We could parallelize with Promise.any if needed.
  for (const proxy of proxies) {
    try {
      const resp = await fetch(proxy + pageUrl, { cache: 'no-store' });
      if (!resp.ok) continue;
      const text = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      // Prefer og:image, fallback to twitter:image or link rel=image_src
      const og = doc.querySelector('meta[property="og:image"]') || doc.querySelector('meta[name="twitter:image"]') || doc.querySelector('link[rel="image_src"]');
      const raw = og ? (og.getAttribute('content') || og.getAttribute('href')) : null;
      if (!raw) continue;

      let decoded = iterativeDecode(raw);

      // remove known proxy prefixes
      for (const p of proxies) {
        if (decoded.startsWith(p)) decoded = decoded.slice(p.length);
      }

      // extract URL candidate
      let candidate = extractFirstUrl(decoded);

      // handle protocol-relative
      if (!candidate && decoded.startsWith('//')) candidate = 'https:' + decoded;
      if (!candidate) candidate = decoded;

      // site-specific unwraps based on candidate host
      try {
        const u = new URL(candidate);
        const host = (u.hostname || '').toLowerCase();
        // dev.to
        if (host.endsWith('dev.to')) {
          const dev = unwrapDevtoUrl(candidate);
          if (dev && await isImageAccessible(dev)) return dev;
        }
        // medium
        if (host.endsWith('medium.com')) {
          const med = unwrapMediumUrl(candidate);
          if (med && await isImageAccessible(med)) return med;
        }
        // substack
        if (host.endsWith('substack.com') || host.endsWith('substackcdn.com') || host.includes('substack')) {
          const sub = unwrapSubstackUrl(candidate);
          if (sub && await isImageAccessible(sub)) return sub;
        }
      } catch (e) {
        // candidate may not be a full URL; proceed
      }

      // if candidate accessible, return it
      if (await isImageAccessible(candidate)) return candidate;

      // fallback to decoded raw
      if (decoded && await isImageAccessible(decoded)) return decoded;
    } catch (err) {
      // try next proxy
      continue;
    }
  }
  return null;
}

export default fetchThumbnailFromPage;

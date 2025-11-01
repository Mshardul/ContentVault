import json
import random
import urllib.parse
import requests
from bs4 import BeautifulSoup
from time import sleep
from urllib.parse import urlparse


PROXY_URLS = [
    "https://api.allorigins.win/raw?url=",
    "https://cors-anywhere.herokuapp.com/",
    "https://thingproxy.freeboard.io/fetch/",
    "https://api.codetabs.com/v1/proxy?quest=",
    "https://proxy.cors.sh/",
    "https://corsproxy.io/?",
    "https://api.allorigins.dev/raw?url=",
    "https://cors.isomorphic-git.org/get?url=",
    "https://crossorigin.me/",
]

INPUT_FILE_NAME = '../../data/tech_articles.json'
OUTPUT_FILE_NAME = '../../data/tech_articles_updated.json'

def load_json(file):
    # Load input JSON file
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        return data

def fetch_thumbnail(url):
    proxies = PROXY_URLS[:]
    random.shuffle(proxies)

    for proxy in proxies:
        try:
            response = requests.get(proxy + url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            og_image = soup.find('meta', property='og:image')
            if og_image and og_image.get('content'):
                raw = og_image['content']

                # Try to iteratively unquote nested percent-encoding (max 3 passes)
                decoded = raw
                for _ in range(3):
                    if '%3A' in decoded or '%2F' in decoded or '%3A%2F' in decoded:
                        prev = decoded
                        decoded = urllib.parse.unquote(decoded)
                        if decoded == prev:
                            break
                    else:
                        break

                # Remove any known proxy prefixes that might have been injected
                for p in PROXY_URLS:
                    if decoded.startswith(p):
                        decoded = decoded[len(p):]


                # Helper: extract first http(s) URL from a string without regex
                def _extract_first_url(s):
                    for scheme in ('https://', 'http://'):
                        idx = s.find(scheme)
                        if idx != -1:
                            end_idx = len(s)
                            # terminate on common delimiters
                            for sep in ('"', "'", ' ', ')', ',', '\\n'):
                                sep_idx = s.find(sep, idx)
                                if sep_idx != -1:
                                    end_idx = min(end_idx, sep_idx)
                            return s[idx:end_idx]
                    return None

                clean_url = _extract_first_url(decoded)

                # dev.to specific unwrapping: dev.to dynamic images embed the original URL
                def _unwrap_devto_url(candidate):
                    try:
                        parsed = urlparse(candidate)
                        host = parsed.netloc or ''
                        path = parsed.path or ''
                        if 'dev.to' in host and '/dynamic/image' in path:
                            # The original URL is usually the last path segment, percent-encoded
                            last_segment = path.split('/')[-1]
                            if last_segment:
                                orig = urllib.parse.unquote(last_segment)
                                # Unquote again if nested
                                orig = urllib.parse.unquote(orig)
                                return orig
                    except Exception:
                        return None
                    return None

                # Medium specific unwrapping: try to get a cleaner miro.medium.com path
                def _unwrap_medium_url(candidate):
                    try:
                        parsed = urlparse(candidate)
                        host = parsed.netloc or ''
                        path = parsed.path or ''
                        if 'miro.medium.com' in host or 'medium.com' in host:
                            # many medium image URLs include sizing prefixes like /max/ or /fit/
                            last_segment = path.split('/')[-1]
                            if last_segment:
                                cand = urllib.parse.unquote(last_segment)
                                return 'https://miro.medium.com/' + cand
                    except Exception:
                        return None
                    return None

                # Substack specific unwrapping: extract embedded original after /image/fetch/
                def _unwrap_substack_url(candidate):
                    try:
                        parsed = urlparse(candidate)
                        host = parsed.netloc or ''
                        path = parsed.path or ''
                        if 'substack' in host or 'substackcdn.com' in host or 'substackcdn' in host:
                            # often the original URL is the last path segment, percent-encoded
                            last_segment = path.split('/')[-1]
                            if last_segment:
                                orig = urllib.parse.unquote(last_segment)
                                if orig.startswith('http'):
                                    return orig
                    except Exception:
                        return None
                    return None

                # Accessibility check: prefer canonical if accessible
                def _is_image_accessible(candidate, referer=None, timeout=5):
                    if not candidate:
                        return False
                    headers = {'User-Agent': 'ContentVault/1.0'}
                    if referer:
                        headers['Referer'] = referer
                    try:
                        r = requests.head(candidate, allow_redirects=True, headers=headers, timeout=timeout)
                        if r.status_code >= 400:
                            # Some servers don't support HEAD properly; try a small GET as fallback
                            raise Exception('HEAD failed')
                        ct = r.headers.get('Content-Type', '')
                        if ct and ct.startswith('image/'):
                            return True
                        # If Content-Type missing or not image, try GET fallback
                        raise Exception('Not image via HEAD')
                    except Exception:
                        # Fallback: try GET with Range to minimize data transfer
                        try:
                            headers['Range'] = 'bytes=0-0'
                            r2 = requests.get(candidate, allow_redirects=True, headers=headers, timeout=timeout)
                            if r2.status_code >= 400:
                                return False
                            ct2 = r2.headers.get('Content-Type', '')
                            return ct2.startswith('image/')
                        except Exception:
                            return False

                # If we have a candidate URL, parse host once and call site-specific unwraps only when applicable
                if clean_url:
                    parsed_candidate = urlparse(clean_url)
                    candidate_host = (parsed_candidate.netloc or '').lower()

                    # dev.to
                    if candidate_host.endswith('dev.to'):
                        devto_canonical = _unwrap_devto_url(clean_url)
                        if devto_canonical and _is_image_accessible(devto_canonical, referer=url):
                            return devto_canonical

                    # medium (covers miro.medium.com and other medium subdomains)
                    if candidate_host.endswith('medium.com'):
                        medium_canonical = _unwrap_medium_url(clean_url)
                        if medium_canonical and _is_image_accessible(medium_canonical, referer=url):
                            return medium_canonical

                    # substack
                    if candidate_host.endswith('substack.com') or candidate_host.endswith('substackcdn.com'):
                        substack_canonical = _unwrap_substack_url(clean_url)
                        if substack_canonical and _is_image_accessible(substack_canonical, referer=url):
                            return substack_canonical

                    # If canonical not accessible, return the clean/transformed URL if accessible
                    if _is_image_accessible(clean_url, referer=url):
                        return clean_url

                # Handle protocol-relative URLs like //example.com/image.jpg
                if decoded.startswith('//'):
                    proto_url = 'https:' + decoded
                    if _is_image_accessible(proto_url, referer=url):
                        return proto_url

                # As a fallback, return the decoded value (might still be usable)
                return decoded
        except Exception as e:
            continue
    return None
    
def save_json(file, data):
    # Save updated JSON file
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    # articles for which thumbnails were successfully fetched
    success_thumbnails = {}

    # load json file
    articles_data = load_json(INPUT_FILE_NAME)
    n = len(articles_data)
    print(f"[progress] Loaded {n} articles from {INPUT_FILE_NAME}")

    # retrieve thumbnails for entries without thumbnails
    for ind, article_data in enumerate(articles_data):
        url = article_data.get('url', '')
        if not article_data.get('thumbnails'):
            thumbnail_url = fetch_thumbnail(url)
            if thumbnail_url:
                print(url, thumbnail_url)
                success_thumbnails[article_data['url']] = thumbnail_url
                article_data['thumbnails'] = thumbnail_url
                sleep(1)  # To avoid hitting the server too quickly
                
            else:
                print(url, "-"*20)
        print(f"[progress] Process: {ind}/{n}")
    
    # Save the successfully fetched thumbnails
    save_json(OUTPUT_FILE_NAME, articles_data)

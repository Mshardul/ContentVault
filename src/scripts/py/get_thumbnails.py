import json
import random
import requests
from bs4 import BeautifulSoup
from time import sleep


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
                # decode url and remove proxy prefixes
                decoded_url = urllib.parse.unquote(og_image['content'])
                for p in PROXY_URLS:
                    if decoded_url.startswith(p):
                        decoded_url = decoded_url[len(p):]
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

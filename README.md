# ContentVault

ContentVault is a simple and efficient content curation app, designed to help users explore a wide variety of online articles, blogs, posts, courses, and other valuable resources. Users can browse by tags, view articles by multiple tags, and search articles based on tags. ContentVault is static, storing its content within the app, and requires no database integration.

## Features

- **Homepage**: View a list of all available articles.
- **Tag Page**: Browse articles by individual tags.
- **Multi-Tag Page**: Compare articles by selecting multiple tags, showing both union (all articles with any of the selected tags) and intersection (articles containing all selected tags).
- **Search & Filter**: Quickly filter content based on tags.
- **About Us**: Learn about the project and its developers.

## Pages

- **Home Page**: Displays a list of all articles.
- **Tag Page**: Lists articles for a specific tag when a user clicks on a tag.
- **Multi-Tags Page**: Divides the page into two sections:
  - Left: Union of selected tags.
  - Right: Intersection of selected tags.
  - Each section shows a preview of articles, with a "Show More" button that leads to a full list of articles.
- **About Us Page**: Provides project details, purpose, and information about the developers.

## Header

- **Logo** (left-aligned): Links to the homepage.
- **Search Button** (right-aligned): Opens a multi-select dropdown to filter articles by tags.
- **About Us Button** (right-aligned): Links to the About Us page.

## User Actions

- Click on a tag to open the Tag Page for that tag.
- Click on an article title to open the full article in a new tab.
- Use the Search button in the header to select one or more tags and filter articles.

## Data Structure

Articles are stored in a static JSON file within the app, with each article containing the following fields:

```json
{
  "title": "Title of the Article",
  "url": "https://example.com/article",
  "tags": ["tag1", "tag2"],
  "authors": ["Author1", "Author2"],
  "publication": "Publication Name",
  "publish_date": "YYYY-MM-DD",
  "read": true
}
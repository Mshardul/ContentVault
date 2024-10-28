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
```

## Components

### Core Components
- Header: Contains the logo and the search button.
  - Logo: Clickable, redirects to the homepage.
  - Search: Multi-select dropdown to filter by tags with a search button.
- Footer: links to About, Contact, and possibly a copyright notice.
- ArticleCard: A component to display individual article information (title, tags, publication, authors, read status).
  - Props:
    - title, url, tags, authors, publication, read
- TagList: A component to display tags for an article. Clickable tags to redirect to tag-specific pages.

### Page Components
- HomePage: Displays all articles with basic filters.
  - Contains a list of ArticleCard components.
  - Header with search and tag filtering options.
- TagListPage: Shows a list of all tags.
  - Each tag is clickable and redirects to its corresponding content page (TagContentPage).
  - Could display the count of articles for each tag.
- TagContentPage: Displays articles for a single tag.
  - Header includes the tag name and count of articles.
  - Contains a list of ArticleCard components filtered by the selected tag.
- MultiTagContentPage: Divided layout with two sections:
  - Left: Union of selected tags.
  - Right: Intersection of selected tags.
  - Each section has:
    - Top articles with a “See All Union” / “See All Intersection” button.
- AboutPage: A static page describing the app and its purpose.
- SearchResultPage: Displays articles based on selected tags.
  - Triggered by the search button in the header.
  - Shows articles matching the selected tag criteria.
  
### Supporting Components
- SearchDropdown: Multi-select dropdown for tags.
  - Includes a “search” button to apply the selected tags.
- UnionIntersectionButtons: Buttons for selecting the union or intersection views in MultiTagPage.
- AuthorList: Renders a list of authors for each article.
- PublicationLabel: Displays the publication source if available.
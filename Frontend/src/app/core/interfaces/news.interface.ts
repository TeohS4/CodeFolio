export class NewsArticle {
  constructor(
    public source: { id: string | null; name: string },
    public author: string | null,
    public title: string,
    public description: string,
    public url: string,
    public urlToImage: string,
    public publishedAt: string,
    public content: string
  ) {}
}

export class Bookmark extends NewsArticle {
  constructor(
    source: { id: string | null; name: string },
    author: string | null,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,
    content: string,
    public addedAt: string // extra field
  ) {
    super(source, author, title, description, url, urlToImage, publishedAt, content);
  }
}
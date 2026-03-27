import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PAGES_IMPORTS } from '../../pages.imports';
import { NewsArticle } from '../../../core/interfaces/news.interface';
import { NewsService } from '../../../core/services/news-service/news-service';
import { BookmarkService } from '../../../core/services/bookmark-service/bookmark-service';
import { AlertService } from '../../../core/services/alert-service/alert';
import { HttpService } from '../../../core/services/http-service/http';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [...PAGES_IMPORTS],
  templateUrl: './news.html',
  styleUrl: './news.scss',
})
export class NewsComponent implements OnInit {

  articles: NewsArticle[] = [];
  page = 1;
  pageSize = 8;
  loading = false;

  selectedCategory = '';
  searchQuery = '';

  categories = [
    'business', 'entertainment', 'general',
    'health', 'science', 'sports', 'technology'
  ];

  bookmarkedUrls: Set<string> = new Set();

  constructor(
    private newsService: NewsService,
    private bookmarkService: BookmarkService,
    private cdr: ChangeDetectorRef,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.loadNews();
    this.loadBookmarks();
  }

  loadNews(reset: boolean = false) {
    if (this.loading) return;

    this.loading = true;

    if (reset) {
      this.page = 1;
      this.articles = [];
    }

    this.newsService.getNews(
      this.page,
      this.pageSize,
      this.selectedCategory,
      this.searchQuery
    ).subscribe({
      next: (res) => {
        this.articles = [...this.articles, ...res.articles];
        this.page++;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.cdr.detectChanges();
    this.loadNews(true);
  }

  search() {
    this.loadNews(true);
  }

  loadBookmarks() {
    this.bookmarkService.getBookmarks().subscribe(bookmarks => {
      this.bookmarkedUrls = new Set(bookmarks.map(b => b.url));
      this.cdr.detectChanges();
    });
  }

  toggleBookmark(news: NewsArticle) {
    const isBookmarked = this.bookmarkedUrls.has(news.url);

    if (isBookmarked) {
      this.bookmarkService.deleteBookmark(news.url).subscribe({
        next: () => {
          this.bookmarkedUrls.delete(news.url);
          this.alert.success('Removed!', 'Removed from bookmarks.');
          this.cdr.detectChanges();
        },
        error: () => this.alert.error('Error', 'Could not remove bookmark')
      });
    } else {
      // Map the article to your backend's expected structure
      const payload = {
        title: news.title,
        description: news.description,
        url: news.url,
        urlToImage: news.urlToImage,
        sourceName: news.source?.name ?? 'Unknown',
        publishedAt: news.publishedAt
      };

      this.bookmarkService.addBookmark(payload).subscribe({
        next: () => {
          this.bookmarkedUrls.add(news.url);
          this.alert.success('Added!', 'Added to bookmarks.');
          this.cdr.detectChanges();
        },
        error: () => this.alert.error('Error', 'Could not save bookmark')
      });
    }
  }
}
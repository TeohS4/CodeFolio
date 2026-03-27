import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PAGES_IMPORTS } from '../../pages.imports';
import { NewsArticle } from '../../../core/interfaces/news.interface';
import { AlertService } from '../../../core/services/alert-service/alert';
import { BookmarkService } from '../../../core/services/bookmark-service/bookmark-service';

@Component({
  selector: 'app-bookmark',
  standalone: true,
  imports: [...PAGES_IMPORTS],
  templateUrl: './bookmark.html',
  styleUrl: './bookmark.scss',
})
export class BookmarkComponent implements OnInit {
  bookmarks: NewsArticle[] = [];

  constructor(
    private bookmarkService: BookmarkService, // Injected the new service
    private alert: AlertService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadBookmarks();
  }

  loadBookmarks() {
    this.bookmarkService.getBookmarks().subscribe({
      next: (res) => {
        this.bookmarks = res;
        this.cdr.detectChanges();
      },
      error: () => this.alert.error('Error', 'Failed to load bookmarks')
    });
  }

  removeBookmark(news: NewsArticle) {
    if (!news.url) {
      this.alert.error('Error', 'News URL is missing');
      return;
    }

    this.bookmarkService.deleteBookmark(news.url).subscribe({
      next: () => {
        this.bookmarks = this.bookmarks.filter(b => b.url !== news.url);
        this.alert.success('Removed!', 'Bookmark removed successfully.');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.alert.error('Error', 'Failed to remove bookmark');
      }
    });
  }

  trackByFn(index: number, item: NewsArticle) {
    return item.url;
  }
}
/* eslint-disable id-length *//* eslint-disable consistent-return */
/* eslint-disable no-magic-numbers *//* eslint-disable no-undefined */
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { lastValueFrom } from 'rxjs';
import { Routes } from 'src/app/app.constants';
import { ArticleComponent } from 'src/app/components/article/article.component';
import { SearchBarComponent } from 'src/app/components/search-bar/search-bar.component';
import { ArticleService } from 'src/app/services/article/article.service';
import { FilterQuery } from 'src/app/types/utils';

const PAGE_LIMIT = 10;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ArticleComponent, SearchBarComponent, InfiniteScrollModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  filterQuery = signal<FilterQuery>({ query: '' });
  enableQuery = signal(false);
  articlesQuery = injectInfiniteQuery(() => ({
    queryKey: ['articles', this.filterQuery().query],
    queryFn: async({ pageParam }) => lastValueFrom(
      this.articleService.getArticles({ page: pageParam, size: PAGE_LIMIT }, this.filterQuery())
    ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.pagesCount - 1) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    enabled: this.enableQuery(),
    select: (data) => data.pages.map(({ results }) => results).flat()
  }));

  constructor(
    private route: Router,
    private articleService: ArticleService,
    private activateRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activateRouter.queryParams.subscribe(params => {
      // eslint-disable-next-line dot-notation
      const query = params['q'] || '';
      if (query !== this.filterQuery().query) {
        this.filterQuery.set({ query });
      }
      this.enableQuery.set(true);
    });
  }

  onSearch(searchQuery: string) {
    if (!searchQuery || !searchQuery.trim().length) {
      return;
    }
    if (searchQuery !== this.filterQuery().query) {
      this.filterQuery.set({ query: searchQuery.trim() });
    }
    this.setupQuery(this.filterQuery().query);
  }

  onClear() {
    this.filterQuery.set({ query: '' });
    this.setupQuery('');
  }

  setupQuery(query: string) {
    this.route.navigate([], {
      relativeTo: this.activateRouter,
      queryParams: { q: query },
      queryParamsHandling: 'merge'
    });
  }

  navigateToArticle(id: number) {
    this.route.navigate([`/${Routes.PREFIX}/${Routes.ARTICLE}`, id]);
  }
}

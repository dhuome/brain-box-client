/* eslint-disable consistent-return *//* eslint-disable no-undefined *//* eslint-disable no-magic-numbers */
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { lastValueFrom, tap } from 'rxjs';
import { Authorities, Routes } from 'src/app/app.constants';
import { TimeAgoPipe } from 'src/app/pipes/time-ago/time-ago.pipe';
import { ArticleService } from 'src/app/services/article/article.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Interaction } from 'src/app/types/article';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConfirmationPopupComponent } from 'src/app/components/confirmation-popup/confirmation-popup.component';
import { fadeInOut } from 'src/app/animations/fadeInOut';
import {
  injectInfiniteQuery,
  injectMutation,
  injectQuery,
  injectQueryClient
} from '@tanstack/angular-query-experimental';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

const PAGE_LIMIT = 10;

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, CommentFormComponent, InfiniteScrollModule, ConfirmationPopupComponent],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.css',
  animations: [fadeInOut]
})
export class ArticleDetailsComponent implements OnInit {
  authorities = Authorities;
  interaction = Interaction;

  selectedArticleId = signal<number>(0);
  isDeleteArticlePopupActive = signal<boolean>(false);
  isToggleArticleStatusPopupActive = signal<boolean>(false);

  queryClient = injectQueryClient();

  articleQuery = injectQuery(() => ({
    queryKey: ['article', this.selectedArticleId()],
    queryFn: async() => {
      try {
        return await lastValueFrom(this.articleService.getArticle(this.selectedArticleId()));
      } catch (error) {
        if (error instanceof HttpErrorResponse) {
          this.toastService.addHttpErrorToast(error.error);
          this.router.navigate([Routes.PREFIX]);
        }
        throw error;
      }
    },
    enabled: !!this.selectedArticleId()
  }));

  commentsQuery = injectInfiniteQuery(() => ({
    queryKey: ['comments'],
    queryFn: ({ pageParam }) => lastValueFrom(
      this.articleService.getComments({ page: pageParam, size: PAGE_LIMIT }, this.selectedArticleId())
    ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.pagesCount - 1) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    enabled: !!this.selectedArticleId(),
    select: (data) => data.pages.map(({ results }) => results).flat()
  }));

  likeArticleMutation = injectMutation(() => ({
    mutationFn: () => lastValueFrom(this.articleService.likeArticle(this.selectedArticleId()))
  }));

  dislikeArticleMutation = injectMutation(() => ({
    mutationFn: () => lastValueFrom(this.articleService.dislikeArticle(this.selectedArticleId()))
  }));

  deleteArticleMutation = injectMutation(() => ({
    mutationFn: () => lastValueFrom(this.articleService.deleteArticle(this.selectedArticleId()))
  }));

  enableArticleMutation = injectMutation(() => ({
    mutationFn: () => lastValueFrom(this.articleService.enableArticle(this.selectedArticleId()))
  }));

  disableArticleMutation = injectMutation(() => ({
    mutationFn: () => lastValueFrom(this.articleService.disableArticle(this.selectedArticleId()))
  }));


  constructor(
    private router: Router,
    public authService: AuthService,
    private toastService: ToastService,
    private articleService: ArticleService,
    private activateRouter: ActivatedRoute,
    public navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.activateRouter.params.pipe(
      tap(({ aid }) => {
        this.selectedArticleId.set(aid);
      })
    ).subscribe();
  }

  likeArticle() {
    this.likeArticleMutation.mutate(undefined, {
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['article'] });
      },
      onError: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.toastService.addHttpErrorToast(error.error);
        }
      }
    });
  }

  dislikeArticle() {
    this.dislikeArticleMutation.mutate(undefined, {
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['article'] });
      },
      onError: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.toastService.addHttpErrorToast(error.error);
        }
      }
    });
  }

  onDeleteArticle() {
    this.deleteArticleMutation.mutate(undefined, {
      onSuccess: () => {
        this.router.navigate([Routes.PREFIX]);
        this.toastService.addSuccessToast('Article deleted successfully! 🗑️');
      },
      onError: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.toastService.addHttpErrorToast(error.error);
        }
      }
    });
  }

  onEnableArticle() {
    this.enableArticleMutation.mutate(undefined, {
      onSuccess: () => {
        this.isToggleArticleStatusPopupActive.set(false);
        this.queryClient.invalidateQueries({ queryKey: ['article'] });
        this.toastService.addSuccessToast('Article has been successfully enabled! 🚀');
      },
      onError: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.toastService.addHttpErrorToast(error.error);
        }
      }
    });
  }

  onDisableArticle() {
    this.disableArticleMutation.mutate(undefined, {
      onSuccess: () => {
        this.isToggleArticleStatusPopupActive.set(false);
        this.queryClient.invalidateQueries({ queryKey: ['article'] });
        this.toastService.addSuccessToast('Article disabled successfully! 🚫');
      },
      onError: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.toastService.addHttpErrorToast(error.error);
        }
      }
    });
  }
}

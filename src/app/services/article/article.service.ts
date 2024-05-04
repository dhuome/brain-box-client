import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Endpoints } from 'src/app/app.constants';
import { ArticleResponse, CommentResponse, PostCommentRequest } from 'src/app/types/article';
import { FilterQuery, PaginatedResponse, PaginationQuery } from 'src/app/types/utils';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(private http: HttpClient) { }

  createArticle(createArticleRequest: FormData) {
    return this.http.post(Endpoints.ARTICLE, createArticleRequest);
  }

  getArticles(paginationQuery: PaginationQuery, searchQuery: FilterQuery) {
    const params = new HttpParams({ fromObject: { ...paginationQuery, ...searchQuery } });
    return this.http.get<PaginatedResponse<ArticleResponse>>(Endpoints.ARTICLE, { params }).pipe(map((data) => {
      const modifiedResponse = {
        ...data,
        // eslint-disable-next-line array-callback-return
        data: data.results.map((article) => {
          article.image.base64 = `data:${article.image.contentType};base64,${article.image.base64}`;
        })
      };
      return modifiedResponse;
    }));
  }

  getArticle(articleId: number) {
    return this.http.get<ArticleResponse>(Endpoints.MY_ARTICLE(articleId)).pipe(map((data) => {
      const modifiedResponse = {
        ...data,
        // eslint-disable-next-line array-callback-return
        data: data.image.base64 = `data:${data.image.contentType};base64,${data.image.base64}`
      };
      return modifiedResponse;
    }));
  }

  likeArticle(articleId: number) {
    return this.http.put(Endpoints.LIKE_ARTICLE(articleId), {});
  }

  dislikeArticle(articleId: number) {
    return this.http.put(Endpoints.DISLIKE_ARTICLE(articleId), {});
  }

  postComment(articleId: number, comment: PostCommentRequest) {
    return this.http.post(Endpoints.COMMENT(articleId), comment);
  }

  getComments(paginationQuery: PaginationQuery, articleId: number) {
    const params = new HttpParams({ fromObject: { ...paginationQuery } });
    return this.http.get<PaginatedResponse<CommentResponse>>(Endpoints.COMMENT(articleId), { params });
  }

  deleteArticle(articleId: number) {
    return this.http.delete(Endpoints.MY_ARTICLE(articleId));
  }

  disableArticle(articleId: number) {
    return this.http.put(Endpoints.DISABLE_ARTICLE(articleId), {});
  }

  enableArticle(articleId: number) {
    return this.http.put(Endpoints.ENABLE_ARTICLE(articleId), {});
  }
}

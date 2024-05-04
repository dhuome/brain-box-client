export enum Interaction {
  LIKE = 'LIKE', DISLIKE = 'DISLIKE'
}

export interface CreateArticleRequest {
  title: string;
  body: string;
}

export interface ImageResponse {
  base64: string;
  contentType: string;
  size: number;
  lastModified: string;
}

export interface ArticleResponse extends CreateArticleRequest {
  id: number;
  authorId: number;
  author: string;
  createdAt: string;
  numberOfLikes: number;
  numberOfDislikes: number;
  image: ImageResponse;
  isDisabled: boolean;
  interaction: Interaction | null;
}

export interface PostCommentRequest {
  comment: string;
}

export interface CommentResponse extends PostCommentRequest {
  author: string;
  createdAt: string;
}

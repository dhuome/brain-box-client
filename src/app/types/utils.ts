export enum ToastType {
  SUCCESS,
  ERROR,
  WARNING,
  INFO,
}

export interface InputError {
  message: string;
  type: string;
}

export interface ErrorResponse {
  errorMessages: string[];
}

export interface PaginationQuery {
  page: number;
  size: number;
}

export interface FilterQuery {
  query: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  currentPage: number;
  perPage: number;
  totalCount: number;
  pagesCount: number;
}

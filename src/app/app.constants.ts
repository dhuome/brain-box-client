export const Routes = {
  PREFIX: 'brain-box',
  TIMELINE: 'timeline',
  ARTICLE: 'article',
  MY_ARTICLE: 'article/:aid',
  WILDCARD: '**'
};

export const Validation = {
  REQUIRED: 'required',
  PATTERN: 'pattern',
  MIN_LENGTH: 'minlength',
  EMAIL: 'email'
};

export const Auth = {
  COOKIE_ACCESS_TOKEN: 'brainBoxAccessToken'
};

export const Regex = {
  NUMBERS: ('^[0-9]$'),
  PHONE_NUMBER: ('^5\\d{8}$')
};

export const Endpoints = {
  LOGIN: 'api/v1/auth/login',
  USER: 'api/v1/user',
  ARTICLE: 'api/v1/article',
  MY_ARTICLE: (articleId: number) => `api/v1/article/${articleId}`,
  LIKE_ARTICLE: (articleId: number) => `api/v1/article/${articleId}/like`,
  DISLIKE_ARTICLE: (articleId: number) => `api/v1/article/${articleId}/dislike`,
  COMMENT: (articleId: number) => `api/v1/article/${articleId}/comment`,
  DISABLE_ARTICLE: (articleId: number) => `api/v1/article/${articleId}/disable`,
  ENABLE_ARTICLE: (articleId: number) => `api/v1/article/${articleId}/enable`
};

export const Authorities = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

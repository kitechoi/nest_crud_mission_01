export interface FindAllArticleUseCaseRequest {
  page: number;
  limit: number;
  username?: string;
}
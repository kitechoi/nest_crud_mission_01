export interface UpdateArticleUseCaseRequest {
  id: number;
  title?: string;
  content?: string;
  password: string;
}
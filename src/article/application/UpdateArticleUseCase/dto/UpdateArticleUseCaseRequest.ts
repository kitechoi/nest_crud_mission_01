export interface UpdateArticleUseCaseRequest {
  id: number;
  title?: string;
  content?: string;
  userIdFromDB: number;
}
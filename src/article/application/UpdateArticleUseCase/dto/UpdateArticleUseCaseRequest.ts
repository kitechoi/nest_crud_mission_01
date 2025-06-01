export interface UpdateArticleUseCaseRequest {
  id: number;
  userIdFromDB: number;
  title?: string;
  content?: string;
}

export interface UpdateArticleUseCaseRequest {
  id: number;
  title?: string;
  content?: string;
  userId: string;
  userIdFromDB: number;
}
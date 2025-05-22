export interface CreateArticleUseCaseRequest {
  userId: string;
  title: string;
  content: string;
  userIdFromDB: number;
}

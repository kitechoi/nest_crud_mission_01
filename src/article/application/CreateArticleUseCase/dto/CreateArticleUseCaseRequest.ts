export interface CreateArticleUseCaseRequest {
  username: string;
  title: string;
  content: string;
  userIdFromDB: number;
}

export interface CreateArticleUseCaseRequest {
  userIdFromDB: number;
  username: string;
  title: string;
  content: string;
}

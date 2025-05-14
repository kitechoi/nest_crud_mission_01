import { Password } from '../../../domain/vo/Password';

export interface UpdateArticleUseCaseRequest {
  id: number;
  title?: string;
  content?: string;
  password: Password;
}
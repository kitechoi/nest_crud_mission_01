import { Password } from '../../../domain/vo/Password';

export interface CreateArticleUseCaseRequest {
  title: string;
  content: string;
  name: string;
  password: Password;
}

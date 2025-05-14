import { Password } from '../../../domain/vo/Password';

export interface DeleteArticleUseCaseRequest {
  id: number;
  password: Password;
}
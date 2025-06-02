import { CoreResponse } from 'src/shared/core/application/CoreResponse';
import { User } from 'src/user/domain/User';
import { Article } from 'src/article/domain/Article';

export interface FindAllArticleUseCaseResponse extends CoreResponse {
  articles: Article[];
  users: User[];
}

import { Article } from 'src/article/domain/Article';
import { CoreResponse } from 'src/shared/core/application/CoreResponse';

export interface FindAllArticleUseCaseResponse extends CoreResponse {
  articles: Article[];
}

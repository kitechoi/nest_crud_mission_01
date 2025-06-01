import { CoreResponse } from 'src/shared/core/application/CoreResponse';
import { Article } from 'src/article/domain/Article';

export interface FindAllArticleUseCaseResponse extends CoreResponse {
  articles: Article[];
}

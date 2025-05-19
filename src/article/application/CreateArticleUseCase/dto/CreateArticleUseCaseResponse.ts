import { CoreResponse } from 'src/shared/core/CoreResponse';
import { Article } from '../../../domain/Article';

export interface CreateArticleUseCaseResponse extends CoreResponse {
  article: Article;
}

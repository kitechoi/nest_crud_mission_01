import { CoreResponse } from 'src/shared/core/CoreResponse';
import { Article } from '../../../domain/Article';

export interface UpdateArticleUseCaseResponse extends CoreResponse {
  article: Article;
}

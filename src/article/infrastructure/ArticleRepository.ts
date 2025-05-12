import { ArticleEntity } from './entity/ArticleEntity';
import {Article} from '../domain/Article'

export interface ArticleRepository {
  save(article: Article): Promise<ArticleEntity>;
  findAll(): Promise<ArticleEntity[]>;
}

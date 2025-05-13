import { ArticleEntity } from './entity/ArticleEntity';
import {Article} from '../domain/Article'

export interface ArticleRepository {
  save(article: Article): Promise<ArticleEntity>;
  findAll(): Promise<Article[]>;
  findById(id: number): Promise<ArticleEntity | null>;
  delete(id: number): Promise<void>;
}

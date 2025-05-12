import { ArticleEntity } from './entity/ArticleEntity';
import {Article} from '../domain/Article'

export interface ArticleRepository {
  save(article: Article): Promise<ArticleEntity>;
  findAll(): Promise<ArticleEntity[]>;
  findById(id: number): Promise<ArticleEntity | null>;
  delete(id: number): Promise<void>;
  update(article: Article): Promise<void>;
}

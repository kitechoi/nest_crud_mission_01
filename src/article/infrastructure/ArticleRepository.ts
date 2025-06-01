import { Article } from '../domain/Article';

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');

export interface ArticleRepository {
  save(article: Article, userIdFromDB: number): Promise<Article>;
  findAll(limit: number, offset: number, username?: string): Promise<Article[]>;
  findById(id: number): Promise<Article | null>;
  delete(id: number): Promise<void>;
}

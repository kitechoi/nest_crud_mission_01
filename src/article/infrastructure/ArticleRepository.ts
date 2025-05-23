import { Article } from '../domain/Article';

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');

export interface ArticleRepository {
  save(article: Article, userIdFromDB: number): Promise<Article>;
  // saveTemp(article: Article, userIdFromDB: number): Promise<ArticleEntity>; => 반환타입이 엔티티
  findAll(limit: number, offset: number): Promise<Article[]>;
  findById(id: number): Promise<Article | null>;
  delete(id: number): Promise<void>;
}

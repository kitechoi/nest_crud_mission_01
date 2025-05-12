import { Article } from '../../domain/Article';
import { ArticleEntity } from '../entity/ArticleEntity';

export class ArticleRepositoryImplMapper {
  static toEntity(article: Article): ArticleEntity {
    const entity = new ArticleEntity();
    entity.title = article.title;
    entity.content = article.content;
    entity.name = article.name;
    entity.password = article.password;

    return entity;
  }

  static toDomain(entity: ArticleEntity): Article {
    return Article.retrieve({
      title: entity.title,
      content: entity.content,
      name: entity.name,
      password: '',
    });
  }
    static applyToEntity(article: Article, entity: ArticleEntity): void {
      entity.title = article.title;
      entity.content = article.content;
      entity.name = article.name;
      entity.password = article.password;
    }

}

import { Article } from '../../domain/Article';
import { ArticleEntity } from '../entity/ArticleEntity';
import { ArticleId } from '../../domain/vo/ArticleId';
import { Password } from '../../domain/vo/Password';

export class ArticleRepositoryImplMapper {
  static toEntity(article: Article): ArticleEntity {
    const entity = new ArticleEntity();
    if (article.id) {
      entity.id = article.id.getValue();
    }
    entity.title = article.title;
    entity.content = article.content;
    entity.name = article.name;
    entity.password = article.password.getValue();
    return entity;
  }

  static toDomain(entity: ArticleEntity): Article {
    return Article.retrieve({
      title: entity.title,
      content: entity.content,
      name: entity.name,
      password: new Password(entity.password),
    });
  }
}

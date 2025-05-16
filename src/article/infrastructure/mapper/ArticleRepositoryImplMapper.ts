import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/vo/ArticleId';
import { Password } from '../../domain/vo/Password';
import { ArticleEntity } from '../entity/ArticleEntity';

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
    return Article.create({
      id: ArticleId.from(entity.id),
      title: entity.title,
      content: entity.content,
      name: entity.name,
      password: Password.create(entity.password),
    });
  }
}

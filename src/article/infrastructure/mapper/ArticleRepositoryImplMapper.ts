import { InternalServerErrorException } from '@nestjs/common';
import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';
import { UserEntitiy } from 'src/user/infrastructure/entity/UserEntity';
import { Article } from '../../domain/Article';
import { ArticleEntity } from '../entity/ArticleEntity';

export class ArticleRepositoryImplMapper {
  static toEntity(article: Article, userIdFromDB: number): ArticleEntity {
    const entity = new ArticleEntity();

    if (article.id) {
      entity.id = article.id.toNumber();
    }
    
    entity.title = article.title;
    entity.content = article.content;

    const user = new UserEntitiy();
    
    user.id = Number(userIdFromDB);
    entity.user = user;

    return entity;
  }
  

  static toDomain(entity: ArticleEntity): Article {

    const articleResult = Article.create(
      {
        title: entity.title,
        content: entity.content,
        userId: entity.user.id,
      },
      UniqueEntityID.create(entity.id),
    );

    if (!articleResult.isSuccess) {
      throw new InternalServerErrorException(
        `Article 생성 실패: ${articleResult.error}`,
      );
    }

    return articleResult.value;
  }
}

import { InternalServerErrorException } from '@nestjs/common';
import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';
import { UserEntitiy } from 'src/user/infrastructure/entity/UserEntity';
import { Article } from '../../domain/Article';
import { ArticleEntity } from '../entity/ArticleEntity';

export class ArticleRepositoryImplMapper {
  static toDomain(entity: ArticleEntity): Article {
    const articleResult = Article.create(
      {
        title: entity.title,
        content: entity.content,
        userId: entity.user_id,
      },
      UniqueEntityID.create(entity.id),
    );

    if (!articleResult.isSuccess) {
      throw new InternalServerErrorException(
        `Failed to create article: ${articleResult.error}`,
      );
    }

    return articleResult.value;
  }
}

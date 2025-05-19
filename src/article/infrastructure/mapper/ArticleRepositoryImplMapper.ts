import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';
import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/vo/ArticleId';
import { Password } from '../../domain/vo/Password';
import { ArticleEntity } from '../entity/ArticleEntity';
import { InternalServerErrorException } from '@nestjs/common';

export class ArticleRepositoryImplMapper {
  static toEntity(article: Article): ArticleEntity {
    const entity = new ArticleEntity();
    if (article.id) {
      entity.id = article.id.toNumber();
    }
    entity.title = article.title;
    entity.content = article.content;
    entity.name = article.name;
    entity.password = article.password.getValue();
    return entity;
  }

  static toDomain(entity: ArticleEntity): Article {
    const idResult = ArticleId.create(entity.id);
    if (!idResult.isSuccess) {
      throw new InternalServerErrorException(
        `ArticleId 생성 실패: ${idResult.error}`,
      );
    }

    const pwResult = Password.create({ password: entity.password });
    if (!pwResult.isSuccess) {
      throw new InternalServerErrorException(
        `Password 생성 실패: ${pwResult.error}`,
      );
    }

    const articleResult = Article.create(
      {
        title: entity.title,
        content: entity.content,
        name: entity.name,
        password: pwResult.value,
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

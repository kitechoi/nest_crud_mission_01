import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';
import { Article } from '../../domain/Article';
import { Password } from '../../../user/domain/Password';
import { ArticleEntity } from '../entity/ArticleEntity';
import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/user/domain/User';
import { UserEntitiy } from 'src/user/infrastructure/entity/UserEntity';

export class ArticleRepositoryImplMapper {
  static toEntity(article: Article, userIdFromDB: number): ArticleEntity {
    const entity = new ArticleEntity();

    if (article.id) {
      entity.id = article.id.toNumber();
    }
    
    entity.title = article.title;
    entity.content = article.content;

    const user = new UserEntitiy(); // userrepo를 조회해야 할 것 같은데.
    
    user.id = Number(userIdFromDB);
    entity.user = user;

    return entity;
  }
  

  static toDomain(entity: ArticleEntity): Article {

    const articleResult = Article.create(
      {
        title: entity.title,
        content: entity.content,
        authorId: entity.user.user_id,
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

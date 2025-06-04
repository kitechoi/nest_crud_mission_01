import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleRepository } from '../ArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleEntity } from '../entity/ArticleEntity';
import { ArticleRepositoryImplMapper } from '../mapper/ArticleRepositoryImplMapper';
import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';
import { UserRepositoryImplMapper } from 'src/user/infrastructure/mapper/UserRepositoryImplMapper';
import { User } from 'src/user/domain/User';

@Injectable()
export class ArticleRepositoryImpl implements ArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleEntityRepository: Repository<ArticleEntity>,
  ) {}

  async save(article: Article, userIdFromDB: number): Promise<Article> {
    const isNewDomain = article.id.isNewIdentifier();

    if (isNewDomain) {
      const insertResult = await this.articleEntityRepository
        .createQueryBuilder()
        .insert()
        .into(ArticleEntity)
        .values({
          title: article.title,
          content: article.content,
          user_id: userIdFromDB,
        })
        .execute();

      const insertId = insertResult.raw.insertId;

      return Article.create(
        {
          title: article.title,
          content: article.content,
          userId: userIdFromDB,
        },
        UniqueEntityID.create(insertId),
      ).value;
    } else {
      await this.articleEntityRepository
        .createQueryBuilder()
        .update(ArticleEntity)
        .set({
          title: article.title,
          content: article.content,
        })
        .where('id = :id', { id: article.id.toNumber() })
        .execute();

      return article;
    }
  }

  async findAll(
    limit: number,
    offset: number,
    username?: string,
  ): Promise<{ articles: Article[]; users: User[] }> {
    const queryBuilder = this.articleEntityRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .orderBy('article.created_at', 'DESC')
      .take(limit)
      .skip(offset);

    if (username) {
      queryBuilder.where('user.username = :username', { username });
    }

    const entities = await queryBuilder.getMany();

    const articles = entities.map((entity) =>
      ArticleRepositoryImplMapper.toDomain(entity),
    );

    const users = entities.map((entity) => {
      return UserRepositoryImplMapper.toDomain(entity.user);
    });

    return { articles, users };
  }

  async findById(id: number): Promise<Article | null> {
    const entity = await this.articleEntityRepository
      .createQueryBuilder('article')
      .where('article.id = :id', { id })
      .getOne();

    return entity ? ArticleRepositoryImplMapper.toDomain(entity) : null;
  }

  async delete(id: number): Promise<void> {
    await this.articleEntityRepository.delete(id);
  }
}

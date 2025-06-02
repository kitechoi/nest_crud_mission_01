import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleRepository } from '../ArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleEntity } from '../entity/ArticleEntity';
import { ArticleRepositoryImplMapper } from '../mapper/ArticleRepositoryImplMapper';
import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';

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
        new UniqueEntityID(insertId),
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
    userId?: UniqueEntityID,
  ): Promise<Article[]> {
    const queryBuilder = this.articleEntityRepository
      .createQueryBuilder('article')
      .orderBy('article.created_at', 'DESC')
      .take(limit)
      .skip(offset);

    if (userId) {
      queryBuilder.where('article.user_id = :userId', {
        userId: userId.toNumber(),
      });
    }

    const entities = await queryBuilder.getMany();

    return entities.map((entity) =>
      ArticleRepositoryImplMapper.toDomain(entity),
    );
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

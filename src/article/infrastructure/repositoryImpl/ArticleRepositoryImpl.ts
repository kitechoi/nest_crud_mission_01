import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleRepository } from '../ArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleEntity } from '../entity/ArticleEntity';
import { ArticleRepositoryImplMapper } from '../mapper/ArticleRepositoryImplMapper';

@Injectable()
export class ArticleRepositoryImpl implements ArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleEntityRepository: Repository<ArticleEntity>,
  ) {}

  async save(article: Article, userIdFromDB: number): Promise<Article> {
    const entity = await this.articleEntityRepository.save(
      ArticleRepositoryImplMapper.toEntity(article, userIdFromDB),
    );
    // 트랜잭션 중첩될 때 어떻게
    // 두 개일 때
    // 바깥 트랜잭션, typeorm 트랜젹선 어떻게 관리.
    // 트랜잭션 격리 수준
    return ArticleRepositoryImplMapper.toDomain(entity);
  }

  // async saveTemp(article: Article, userIdFromDB: number): Promise<ArticleEntity> {
  //   const entity = await this.articleEntityRepository.save(
  //     ArticleRepositoryImplMapper.toEntity(article, userIdFromDB),
  //   );
  //   // return ArticleRepositoryImplMapper.toDomain(entity);
  //   return entity;
  // }

  async findAll(
    limit: number,
    offset: number,
    username?: string,
  ): Promise<Article[]> {
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

    return entities.map((entity) =>
      ArticleRepositoryImplMapper.toDomain(entity),
    );
  }

  async findById(id: number): Promise<Article | null> {
    const entity = await this.articleEntityRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .where('article.id = :id', { id })
      .getOne();

    return entity ? ArticleRepositoryImplMapper.toDomain(entity) : null;
  }

  async delete(id: number): Promise<void> {
    await this.articleEntityRepository.delete(id);
  }
}

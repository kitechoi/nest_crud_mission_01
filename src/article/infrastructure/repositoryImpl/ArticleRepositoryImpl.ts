import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../../domain/Article';
import { ArticleEntity } from '../entity/ArticleEntity';
import { ArticleRepository } from '../ArticleRepository';
import { ArticleRepositoryImplMapper } from '../mapper/ArticleRepositoryImplMapper';
import { UserEntitiy } from 'src/user/infrastructure/entity/UserEntity';

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
    return ArticleRepositoryImplMapper.toDomain(entity);
  }

  // async saveTemp(article: Article, userIdFromDB: number): Promise<ArticleEntity> {
  //   const entity = await this.articleEntityRepository.save(
  //     ArticleRepositoryImplMapper.toEntity(article, userIdFromDB),
  //   );
  //   // return ArticleRepositoryImplMapper.toDomain(entity);
  //   return entity;
  // }

  async findAll(limit: number, offset: number, username?: string): Promise<Article[]> {
    const tempEntities = await this.articleEntityRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .orderBy('article.created_at', 'DESC')
      .take(limit)
      .skip(offset);
      // .getMany();

      if (username) {
        tempEntities.where('user.username = :username', { username });
      }
      
      const entities = await tempEntities.getMany();

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

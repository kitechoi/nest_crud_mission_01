import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../../domain/Article';
import { ArticleEntity } from '../entity/ArticleEntity';
import { ArticleRepository } from '../ArticleRepository';
import { ArticleRepositoryImplMapper } from '../mapper/ArticleRepositoryImplMapper';

@Injectable()
export class ArticleRepositoryImpl implements ArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleEntityRepository: Repository<ArticleEntity>,
  ) {}

  async save(article: Article): Promise<Article> {
    const entity = await this.articleEntityRepository.save(
      ArticleRepositoryImplMapper.toEntity(article),
    );
    return ArticleRepositoryImplMapper.toDomain(entity);
  }

  async findAll(limit: number, offset: number): Promise<Article[]> {
    const entities = await this.articleEntityRepository
      .createQueryBuilder('article')
      .orderBy('article.created_at', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();

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

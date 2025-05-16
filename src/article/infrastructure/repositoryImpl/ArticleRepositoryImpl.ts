import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../entity/ArticleEntity';
import {ArticleRepository} from '../ArticleRepository'
import { Article } from '../../domain/Article';
import { ArticleRepositoryImplMapper } from '../mapper/ArticleRepositoryImplMapper';


@Injectable()
export class ArticleRepositoryImpl implements ArticleRepository{
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repo: Repository<ArticleEntity>,
  ) {}

  async save(article: Article): Promise<Article> {
    const entity = await this.repo.save(ArticleRepositoryImplMapper.toEntity(article));
    return ArticleRepositoryImplMapper.toDomain(entity);
  }


  async findAll(limit: number, offset: number): Promise<Article[]> {
    const entities = await this.repo.find({
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
    return entities.map((entity) => ArticleRepositoryImplMapper.toDomain(entity));
  }

  async findById(id: number): Promise<Article | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? ArticleRepositoryImplMapper.toDomain(entity) : null;
  }

  async delete(id: number): Promise<void> {
      await this.repo.delete(id);
    }
}

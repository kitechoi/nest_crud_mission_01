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

  async save(article: Article): Promise<ArticleEntity> {
    const entity = ArticleRepositoryImplMapper.toEntity(article);
    return await this.repo.save(entity);
  }


  async findAll(): Promise<Article[]> {
    const entities = await this.repo.find();
    return entities.map(entity => ArticleRepositoryImplMapper.toDomain(entity));
  }


  async findById(id: number): Promise<ArticleEntity | null> {
      return await this.repo.findOne({ where: { id } });
    }

  async delete(id: number): Promise<void> {
      await this.repo.delete(id);
    }
}

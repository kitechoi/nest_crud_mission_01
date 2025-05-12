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

  async findAll(): Promise<ArticleEntity[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<ArticleEntity | null> {
      return await this.repo.findOne({ where: { id } });
    }

  async delete(id: number): Promise<void> {
      await this.repo.delete(id);
    }

  async update(article: Article): Promise<void> {
    const entity = await this.repo.findOne({ where: { id: article.id } });
    if (!entity) throw new Error('수정할 글이 존재하지 않습니다.');

    ArticleRepositoryImplMapper.applyToEntity(article, entity);
    await this.repo.save(entity);
  }
}

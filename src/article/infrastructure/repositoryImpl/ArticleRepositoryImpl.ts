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
    return await this.repo.save(article);
  }

  async findAll(): Promise<ArticleEntity[]> {
    return this.repo.find();
  }
}


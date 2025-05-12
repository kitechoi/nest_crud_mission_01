import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Article } from '../../domain/Article';
import {ArticleRepository} from '../../infrastructure/ArticleRepository'
import {ArticleRepositoryImplMapper} from '../../infrastructure/mapper/ArticleRepositoryImplMapper'
import { FindAllArticleUseCaseResponse } from './dto/FindAllArticleUseCaseResponse';

@Injectable()
export class FindAllArticleUseCase {
  constructor(
      @Inject('ArticleRepository')
      @Inject('ArticleRepositoryImplMapper')
    private readonly articleRepository: ArticleRepository,
    private readonly articleRepositoryImplMapper: ArticleRepositoryImplMapper,
  ) {}

  async execute(): Promise<FindAllArticleUseCaseResponse[]> {
      const articles = await this.articleRepository.findAll();
      return articles.map(article => ArticleRepositoryImplMapper.toDomain(article))
    }
}
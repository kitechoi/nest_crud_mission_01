import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Article } from '../../domain/Article';
import {ArticleRepository} from '../../infrastructure/ArticleRepository'
import { FindAllArticleUseCaseResponse } from './dto/FindAllArticleUseCaseResponse';

@Injectable()
export class FindAllArticleUseCase {
  constructor(
      @Inject('ArticleRepository')
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(): Promise<FindAllArticleUseCaseResponse[]> {
      const articles = await this.articleRepository.findAll();
      console.log(articles);
      return articles;
    }
}
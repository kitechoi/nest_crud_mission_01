import { Injectable } from '@nestjs/common';
import { Article } from '../../domain/Article';
import { CreateArticleUseCaseRequest } from './dto/CreateArticleUseCaseRequest';

@Injectable()
export class CreateArticleUseCase {
  // infrastructure 사용 전
  private articles: Article[] = [];

  async execute(dto: CreateArticleUseCaseRequest): Promise<void> {
    const article = Article.create(dto);
    this.articles.push(article);
    console.log('누적 게시글 목록:', this.articles);
  }
}

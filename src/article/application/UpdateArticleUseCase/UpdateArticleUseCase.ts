import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Article } from '../../domain/Article';
import {ArticleRepository} from '../../infrastructure/ArticleRepository';
import { UpdateArticleUseCaseRequest } from './dto/UpdateArticleUseCaseRequest';
import { UpdateArticleUseCaseResponse } from './dto/UpdateArticleUseCaseResponse';
import { Password } from '../../domain/vo/Password';
import { ArticleId } from '../../domain/vo/ArticleId';

@Injectable()
export class UpdateArticleUseCase {
  constructor(
    @Inject('ArticleRepository')
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(request: UpdateArticleUseCaseRequest): Promise<UpdateArticleUseCaseResponse> {
    const article = await this.articleRepository.findById(request.id);

    if (!article) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    if (!article.password.equals(request.password)) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    const updated = Article.retrieve({
      id: article.id,
      title: typeof request.title !== 'undefined' ? request.title : article.title,
      content: typeof request.content !== 'undefined' ? request.content : article.content,
      name: article.name,
      password: article.password,
    });

    const savedArticle = await this.articleRepository.save(updated);

    return {
      article: savedArticle
    };
  }
}

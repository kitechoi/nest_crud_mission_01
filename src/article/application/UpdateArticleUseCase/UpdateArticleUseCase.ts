import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Article } from '../../domain/Article';
import {ArticleRepository} from '../../infrastructure/ArticleRepository'
import {ArticleRepositoryImplMapper} from '../../infrastructure/mapper/ArticleRepositoryImplMapper'

@Injectable()
export class UpdateArticleUseCase {
  constructor(
      @Inject('ArticleRepository')
      @Inject('ArticleRepositoryImplMapper')
    private readonly articleRepository: ArticleRepository,
    private readonly articleRepositoryImplMapper: ArticleRepositoryImplMapper,
  ) {}

  async execute(request: {id: number; content: string; password: string}): Promise<void> {
    const entity = await this.articleRepository.findById(request.id);
    if (!entity) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }
    const article = Article.retrieve(entity);


    if (article.password !== request.password) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    article.updateContent(request.content);
    await this.articleRepository.update(article);

  }
}

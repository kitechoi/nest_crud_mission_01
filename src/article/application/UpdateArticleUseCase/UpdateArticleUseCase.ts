import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Article } from '../../domain/Article';
import {ArticleRepository} from '../../infrastructure/ArticleRepository';
import { UpdateArticleUseCaseRequest } from './dto/UpdateArticleUseCaseRequest';

@Injectable()
export class UpdateArticleUseCase {
  constructor(
      @Inject('ArticleRepository')
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(request: UpdateArticleUseCaseRequest): Promise<void> {

    // 변경내용 유효성 검사 먼저

    const entity = await this.articleRepository.findById(request.id);

    // 게시글 권한 검사 함수 묶을 수 있다.
    if (!entity) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }
    if (entity.password !== request.password) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    const article = Article.create({
      title: typeof request.title !== 'undefined' ? request.title : entity.title,
      content: typeof request.content !== 'undefined' ? request.content : entity.content,
      name: entity.name,
      password: entity.password});

    const saved = await this.articleRepository.save(article);
          // createAt은 그대로여야 하는데...

    //
  }
}

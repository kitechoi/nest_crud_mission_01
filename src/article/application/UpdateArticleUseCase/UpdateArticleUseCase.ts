import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateArticleUseCaseRequest } from './dto/UpdateArticleUseCaseRequest';
import { UpdateArticleUseCaseResponse } from './dto/UpdateArticleUseCaseResponse';
import { Article } from '../../domain/Article';
import { Password } from '../../domain/vo/Password';
import { ArticleRepository, ARTICLE_REPOSITORY } from '../../infrastructure/ArticleRepository';

@Injectable()
export class UpdateArticleUseCase {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(request: UpdateArticleUseCaseRequest): Promise<UpdateArticleUseCaseResponse> {
    const article = await this.articleRepository.findById(request.id);

    if (!article) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    if (!article.password.equals(Password.create(request.password))) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    // 위에서 Password 일치 검사를 하면서 유효성 검사를 했는데, 아래 create에서 비밀번호 유효성 검사가 중복되고 있음

    const updated = Article.create({
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

import { Body, Controller, Post } from '@nestjs/common';
import { CreateArticleUseCase } from '../application/CreateArticleUseCase/CreateArticleUseCase';
import { CreateArticleUseCaseRequest } from '../application/CreateArticleUseCase/dto/CreateArticleUseCaseRequest';


@Controller('articles')
export class ArticleController {
  constructor(private readonly createArticleUseCase: CreateArticleUseCase) {}

  @Post()
  async create(@Body() dto: CreateArticleUseCaseRequest) {
    await this.createArticleUseCase.execute(dto);
    return { ok: true };
  }
}

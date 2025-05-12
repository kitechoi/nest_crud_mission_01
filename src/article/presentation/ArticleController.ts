import { Body, Controller, Post } from '@nestjs/common';
import { CreateArticleUseCase } from '../application/CreateArticleUseCase/CreateArticleUseCase';
import { CreateArticleUseCaseRequest } from '../application/CreateArticleUseCase/dto/CreateArticleUseCaseRequest';
import {ArticleControllerCreateArticleRequestBody} from './dto/ArticleControllerRequest'

@Controller('articles')
export class ArticleController {
  constructor(
      private readonly createArticleUseCase: CreateArticleUseCase,
      ) {}

  @Post()
  async createArticle(
      @Body() body: ArticleControllerCreateArticleRequestBody
  ) {
    await this.createArticleUseCase.execute(
    {
          title: body.title,
          content: body.content,
          name: body.name,
          password: body.password,
        });

    return {
        ok: true
        // http 성공 응답 코드 내려줘야 하고
        // 생성 객체도 내려줘야 함.
        };
  }
}

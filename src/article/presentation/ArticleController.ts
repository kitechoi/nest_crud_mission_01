import { Body, Controller, Get, Post, Delete, Put, Patch, Param, Query, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateArticleUseCase } from '../application/CreateArticleUseCase/CreateArticleUseCase';
import { CreateArticleUseCaseRequest } from '../application/CreateArticleUseCase/dto/CreateArticleUseCaseRequest';
import { ArticleControllerCreateArticleRequestBody, ArticleControllerDeleteArticleRequestBody, ArticleControllerUpdateArticleRequestBody, ArticleControllerDeleteArticleRequestParam, ArticleControllerUpdateArticleRequestParam, ArticleControllerFindAllArticleRequestQuery } from './dto/ArticleControllerRequest'
import { DeleteArticleUseCase } from '../application/DeleteArticleUseCase/DeleteArticleUseCase';
import { FindAllArticleUseCaseResponse } from '../application/FindAllArticleUseCase/dto/FindAllArticleUseCaseResponse';
import { UpdateArticleUseCaseResponse } from '../application/UpdateArticleUseCase/dto/UpdateArticleUseCaseResponse';
import { FindAllArticleUseCase } from '../application/FindAllArticleUseCase/FindAllArticleUseCase';
import { UpdateArticleUseCase } from '../application/UpdateArticleUseCase/UpdateArticleUseCase';
import { Password } from '../domain/vo/Password';

@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@Controller('articles')
export class ArticleController {
  constructor(
      private readonly createArticleUseCase: CreateArticleUseCase,
      private readonly deleteArticleUseCase: DeleteArticleUseCase,
      private readonly findAllArticleUseCase: FindAllArticleUseCase,
      private readonly updateArticleUseCase: UpdateArticleUseCase,
      ) {}

@Post()
  @HttpCode(HttpStatus.CREATED)
  async createArticle(
    @Body() body: ArticleControllerCreateArticleRequestBody,
  ) {
    const article = await this.createArticleUseCase.execute({
      title: body.title,
      content: body.content,
      name: body.name,
      password: Password.create(body.password),
    });

    return {
      statusCode: HttpStatus.CREATED,
      ok: true,
      result: article,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArticle(
    @Param() params: ArticleControllerDeleteArticleRequestParam,
    @Body() body: ArticleControllerDeleteArticleRequestBody,
  ): Promise<void> {
    await this.deleteArticleUseCase.execute({
      id: params.id,
      password: Password.create(body.password),
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getArticle(
    @Query() query: ArticleControllerFindAllArticleRequestQuery,
  ): Promise<{ statusCode: number; ok: true; result: FindAllArticleUseCaseResponse[] }> {
    const articles = await this.findAllArticleUseCase.execute({
      page: query.page,
      limit: query.limit,
    });

    return {
      statusCode: HttpStatus.OK,
      ok: true,
      result: articles,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateArticle(
    @Param() params: ArticleControllerUpdateArticleRequestParam,
    @Body() body: ArticleControllerUpdateArticleRequestBody,
  ): Promise<{ statusCode: number; ok: true; result: UpdateArticleUseCaseResponse }> {
    const updated = await this.updateArticleUseCase.execute({
      id: params.id,
      title: body.title,
      content: body.content,
      password: Password.create(body.password),
    });

    return {
      statusCode: HttpStatus.OK,
      ok: true,
      result: updated,
    };
  }
}

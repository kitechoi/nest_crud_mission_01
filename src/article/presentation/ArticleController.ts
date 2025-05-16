import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateArticleUseCase } from '../application/CreateArticleUseCase/CreateArticleUseCase';
import { DeleteArticleUseCase } from '../application/DeleteArticleUseCase/DeleteArticleUseCase';
import { FindAllArticleUseCase } from '../application/FindAllArticleUseCase/FindAllArticleUseCase';
import { UpdateArticleUseCase } from '../application/UpdateArticleUseCase/UpdateArticleUseCase';
import { FindAllArticleUseCaseResponse } from '../application/FindAllArticleUseCase/dto/FindAllArticleUseCaseResponse';
import { UpdateArticleUseCaseResponse } from '../application/UpdateArticleUseCase/dto/UpdateArticleUseCaseResponse';
import { CreateArticleUseCaseResponse } from '../application/CreateArticleUseCase/dto/CreateArticleUseCaseResponse';
import { ArticleControllerCreateArticleRequestBody, ArticleControllerDeleteArticleRequestBody, ArticleControllerDeleteArticleRequestParam, ArticleControllerFindAllArticleRequestQuery, ArticleControllerUpdateArticleRequestBody, ArticleControllerUpdateArticleRequestParam } from './dto/ArticleControllerRequest';
import { ArticleControllerUpdateArticleResponse } from './dto/ArticleControllerResponse';
import { ArticleId } from '../domain/vo/ArticleId';

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
  ): Promise<{ statusCode: number; ok: true; result: CreateArticleUseCaseResponse }> {
    const article = await this.createArticleUseCase.execute({
      title: body.title,
      content: body.content,
      name: body.name,
      password: body.password,
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
      password: body.password,
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
  ): Promise<{ statusCode: number; ok: true; result: ArticleControllerUpdateArticleResponse;}> {
    const updatedArticle = await this.updateArticleUseCase.execute({
      id: params.id,
      title: body.title,
      content: body.content,
      password: body.password,
    });

    return {
      statusCode: HttpStatus.OK,
      ok: true,
      result: {
        id: (updatedArticle.article.id as ArticleId).getValue(),
        title: updatedArticle.article.title,
        content: updatedArticle.article.content,
      },
    };
  }
}

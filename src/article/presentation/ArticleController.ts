import { Body, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateArticleUseCase } from '../application/CreateArticleUseCase/CreateArticleUseCase';
import { DeleteArticleUseCase } from '../application/DeleteArticleUseCase/DeleteArticleUseCase';
import { FindAllArticleUseCase } from '../application/FindAllArticleUseCase/FindAllArticleUseCase';
import { UpdateArticleUseCase } from '../application/UpdateArticleUseCase/UpdateArticleUseCase';
import { ArticleControllerCreateArticleRequestBody, ArticleControllerDeleteArticleRequestBody, ArticleControllerDeleteArticleRequestParam, ArticleControllerFindAllArticleRequestQuery, ArticleControllerUpdateArticleRequestBody, ArticleControllerUpdateArticleRequestParam } from './dto/ArticleControllerRequest';
import { ArticleControllerCreateArticleResponse, ArticleControllerUpdateArticleResponse, ArticleControllerFineAllArticleResponse } from './dto/ArticleControllerResponse';

@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly createArticleUseCase: CreateArticleUseCase,
    private readonly deleteArticleUseCase: DeleteArticleUseCase,
    private readonly findAllArticleUseCase: FindAllArticleUseCase,
    private readonly updateArticleUseCase: UpdateArticleUseCase,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArticle(
    @Body() body: ArticleControllerCreateArticleRequestBody,
  ): Promise<{ statusCode: number; ok: true; result: ArticleControllerCreateArticleResponse }> {
    try {
      const { ok, article } = await this.createArticleUseCase.execute({
        title: body.title,
        content: body.content,
        name: body.name,
        password: body.password,
      });
      if (!ok) {
        throw new InternalServerErrorException(); 
      } 

      return {
        statusCode: HttpStatus.CREATED,
        ok: true,
        result: {
          id: article.id!.getValue(),
          title: article.title,
          content: article.content,
          name: article.name,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArticle(
    @Param() params: ArticleControllerDeleteArticleRequestParam,
    @Body() body: ArticleControllerDeleteArticleRequestBody,
  ): Promise<void> {
    try {
      const { ok } = await this.deleteArticleUseCase.execute({
        id: params.id,
        password: body.password,
      });
      if (!ok) {
        throw new InternalServerErrorException();
      }

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getArticle(
    @Query() query: ArticleControllerFindAllArticleRequestQuery,
  ): Promise<{ statusCode: number; ok: true; result: ArticleControllerFineAllArticleResponse[] }> {
    try {
      const { ok, articles } = await this.findAllArticleUseCase.execute({
        page: query.page,
        limit: query.limit,
      });
      if (!ok) {
        throw new InternalServerErrorException();
      }

      const result = articles.map((article) => ({
        id: article.id!.getValue(),
        title: article.title,
        content: article.content,
      }));

      return {
        statusCode: HttpStatus.OK,
        ok: true,
        result: result,
      };

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateArticle(
    @Param() params: ArticleControllerUpdateArticleRequestParam,
    @Body() body: ArticleControllerUpdateArticleRequestBody,
  ): Promise<{ statusCode: number; ok: true; result: ArticleControllerUpdateArticleResponse; }> {
    try{
      const { ok, article } = await this.updateArticleUseCase.execute({
        id: params.id,
        title: body.title,
        content: body.content,
        password: body.password,
      });
      if (!ok) {
        throw new InternalServerErrorException();
      }

      return {
        statusCode: HttpStatus.OK,
        ok: true,
        result: {
          id: article.id!.getValue(),
          title: article.title,
          content: article.content,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

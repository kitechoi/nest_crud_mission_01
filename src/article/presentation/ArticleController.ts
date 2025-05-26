import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Logger,
  UseGuards,
  Req,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateArticleUseCase } from '../application/CreateArticleUseCase/CreateArticleUseCase';
import { DeleteArticleUseCase } from '../application/DeleteArticleUseCase/DeleteArticleUseCase';
import { FindAllArticleUseCase } from '../application/FindAllArticleUseCase/FindAllArticleUseCase';
import { UpdateArticleUseCase } from '../application/UpdateArticleUseCase/UpdateArticleUseCase';
import {
  ArticleControllerCreateArticleRequestBody,
  ArticleControllerDeleteArticleRequestBody,
  ArticleControllerDeleteArticleRequestParam,
  ArticleControllerFindAllArticleRequestQuery,
  ArticleControllerUpdateArticleRequestBody,
  ArticleControllerUpdateArticleRequestParam,
} from './dto/ArticleControllerRequest';
import {
  ArticleControllerCreateArticleResponse,
  ArticleControllerUpdateArticleResponse,
  ArticleControllerFineAllArticleResponse,
} from './dto/ArticleControllerResponse';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { Request } from 'express';
import { FindUserByIdUseCase } from 'src/user/application/FindUserByIdUseCase/FindUserByIdUseCase';

@Controller('articles')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);
  constructor(
    private readonly createArticleUseCase: CreateArticleUseCase,
    private readonly deleteArticleUseCase: DeleteArticleUseCase,
    private readonly findAllArticleUseCase: FindAllArticleUseCase,
    private readonly updateArticleUseCase: UpdateArticleUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArticle(
    @Req() request: Request,
    @Body() body: ArticleControllerCreateArticleRequestBody,
  ): Promise<{
    statusCode: number;
    ok: true;
    result: ArticleControllerCreateArticleResponse;
  }> {
    try {
      if (!request.user) {
        throw new UnauthorizedException();
      }
      const { username, userIdFromDB } = request.user;

      console.log('username: ', username, 'userIdFromDB: ', userIdFromDB);
      const { ok, article } = await this.createArticleUseCase.execute({
        username: username,
        title: body.title,
        content: body.content,
        userIdFromDB: userIdFromDB,
      });
      if (!ok) {
        throw new InternalServerErrorException();
      }
      console.log(article);
      return {
        statusCode: HttpStatus.CREATED,
        ok: true,
        result: {
          id: article.id.toNumber(),
          title: article.title,
          content: article.content,
          username: username, // 유저 문자 아이디
        },
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArticle(
    @Param() params: ArticleControllerDeleteArticleRequestParam,
    @Req() request: Request,
  ) {
    try {
      if (!request.user) {
        throw new UnauthorizedException();
      }
      const { username, userIdFromDB } = request.user;
      const { ok } = await this.deleteArticleUseCase.execute({
        id: Number(params.id),
        userIdFromDB: userIdFromDB,
      });
      if (!ok) {
        throw new InternalServerErrorException();
      }

      return;
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  // // TODO: 해당 사용자의 게시글만 모아볼 수 있도록 쿼리파라미터 수정
  // // result에 누가 쓴 글인지도 담겼으면 좋겠는데, article이 갖는 건 user PK라서 어떻게 username을 넘길 것인가.
  // @Get()
  // @HttpCode(HttpStatus.OK)
  // async getArticle(
  //   @Query() query: ArticleControllerFindAllArticleRequestQuery,
  // ): Promise<{
  //   statusCode: number;
  //   ok: true;
  //   result: ArticleControllerFineAllArticleResponse[];
  // }> {
  //   try {
  //     const { ok, articles } = await this.findAllArticleUseCase.execute({
  //       page: Number(query.page),
  //       limit: Number(query.limit),
  //       username: query.username,
  //     });
  //     if (!ok) {
  //       throw new InternalServerErrorException();
  //     }

  //     const result = articles.map((article) => ({
  //       id: article.id.toNumber(),
  //       title: article.title,
  //       content: article.content,
  //     }));

  //     return {
  //       statusCode: HttpStatus.OK,
  //       ok: true,
  //       result: result,
  //     };
  //   } catch (error) {
  //     this.logger.error(JSON.stringify(error));
  //     throw error;
  //   }
  // }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getArticle(
    @Query() query: ArticleControllerFindAllArticleRequestQuery,
  ): Promise<{
    statusCode: number;
    ok: true;
    result: ArticleControllerFineAllArticleResponse[];
  }> {
    try {
      const { ok, articles } = await this.findAllArticleUseCase.execute({
        page: Number(query.page),
        limit: Number(query.limit),
        username: query.username,
      });

      if (!ok) throw new InternalServerErrorException();

      const result = await Promise.all(
        articles.map(async (article) => {
          const { user } = await this.findUserByIdUseCase.execute({
            id: article.userId,
          });

          return {
            id: article.id.toNumber(),
            title: article.title,
            content: article.content,
            username: user.username,
            nickname: user.nickname,
          };
        }),
      );

      return {
        statusCode: HttpStatus.OK,
        ok: true,
        result,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateArticle(
    @Param() params: ArticleControllerUpdateArticleRequestParam,
    @Req() request: Request,
    @Body() body: ArticleControllerUpdateArticleRequestBody,
  ): Promise<{
    statusCode: number;
    ok: true;
    result: ArticleControllerUpdateArticleResponse;
  }> {
    try {
      if (!request.user) {
        throw new UnauthorizedException();
      }
      const { username, userIdFromDB } = request.user;
      const { ok, article } = await this.updateArticleUseCase.execute({
        id: Number(params.id),
        title: body.title,
        content: body.content,
        userIdFromDB: userIdFromDB,
      });
      if (!ok) {
        throw new InternalServerErrorException();
      }

      return {
        statusCode: HttpStatus.OK,
        ok: true,
        result: {
          id: article.id.toNumber(),
          title: article.title,
          content: article.content,
          username: username,
        },
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }
}

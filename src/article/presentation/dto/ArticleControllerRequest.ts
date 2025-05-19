import { Title, Content, Name, Password } from './validators/ValidatedFields';

export class ArticleControllerCreateArticleRequestBody {
  @Title()
  title: string;

  @Content()
  content: string;

  @Name()
  name: string;

  @Password()
  password: string;
}

export class ArticleControllerDeleteArticleRequestBody {
  @Password()
  password: string;
}


export class ArticleControllerUpdateArticleRequestBody {
  @Title()
  title?: string;

  @Content()
  content?: string;

  @Password()
  password: string;
}

export class ArticleControllerDeleteArticleRequestParam {
  id: string;
}

export class ArticleControllerUpdateArticleRequestParam {
  id: string;
}

export class ArticleControllerFindAllArticleRequestQuery {
  page: string;
  limit: string;
}
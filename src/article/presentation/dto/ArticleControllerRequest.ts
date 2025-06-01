export class ArticleControllerCreateArticleRequestBody {
  title: string;
  content: string;
}

export class ArticleControllerDeleteArticleRequestBody {
  password: string;
}

export class ArticleControllerUpdateArticleRequestBody {
  title?: string;
  content?: string;
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
  username?: string;
}

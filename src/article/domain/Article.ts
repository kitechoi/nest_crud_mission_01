
// 도메인 로직

export interface ArticleProps {
  title: string;
  content: string;
  password: string;
  createdAt: Date;
}

export class Article {
  private constructor(public readonly props: ArticleProps) {}

  static create(props: Omit<ArticleProps, 'createdAt'>): Article {
    return new Article({
      ...props,
      createdAt: new Date(),
    });
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get password(): string {
    return this.props.password;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}

// 비밀번호 검사 함수

// 게시글 수정
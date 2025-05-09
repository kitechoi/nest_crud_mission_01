
// 도메인 로직

export interface ArticleProps {
  title: string;
  content: string;
  name: string;
  password: string;
  createdAt: Date;
}

export class Article {
    // Aggregate 적용 가능
  private constructor(public readonly props: ArticleProps) {}

  static create(props: Omit<ArticleProps, 'createdAt'>): Article {
      // Result 패턴 적용 가능
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

  get name(): string {
      return this.props.name;
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
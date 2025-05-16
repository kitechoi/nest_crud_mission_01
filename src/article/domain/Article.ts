import { ArticleId } from './vo/ArticleId';
import { Password } from './vo/Password';

export interface ArticleProps {
  id?: ArticleId;
  title: string;
  content: string;
  name: string;
  password: Password;
}

export class Article {
  private constructor(private readonly props: ArticleProps) { }

  static create(props: ArticleProps): Article {
    if (!props.title || props.title.length > 50) {
      throw new Error('제목은 50자 이하로 입력해야 합니다.');
    }

    if (!props.content || props.content.length > 2000) {
      throw new Error('본문은 2000자 이하로 입력해야 합니다.');
    }

    if (!props.name || props.name.length > 20 || /\s/.test(props.name)) {
      throw new Error('작성자 이름은 20자 이하이며, 공백을 포함할 수 없습니다.');
    }

    return new Article(props);
  }

  get id(): ArticleId | undefined {
    return this.props.id;
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

  get password(): Password {
    return this.props.password;
  }
}

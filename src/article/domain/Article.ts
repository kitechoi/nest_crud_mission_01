import { ArticleId } from './vo/ArticleId';
// 도메인 로직

export interface ArticleProps {
  id?: ArticleId;
  title: string;
  content: string;
  name: string;
  password: string;
}

export class Article {
    // Aggregate 적용 가능
  private constructor(public readonly props: ArticleProps) {
      }

  static create( props: ArticleProps ): Article {

      // Result 패턴 적용 가능
    return new Article(props);
  }

  // DB에서 조회할 때
  static retrieve(props: ArticleProps): Article {
    return new Article(props);
  }

  // 본문 제약 검사
  validateContent(content: string) {
    if (!content || content.length === 0) {
      throw new Error('내용은 비워둘 수 없습니다.');
    }
    this.props.content = content;
  }

  get id(): ArticleId | undefined{
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

  get password(): string {
    return this.props.password;
  }

}

// 비밀번호 검사 함수

// 게시글 수정
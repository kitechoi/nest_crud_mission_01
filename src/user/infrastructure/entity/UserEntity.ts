import { ArticleEntity } from 'src/article/infrastructure/entity/ArticleEntity';
import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn,  } from 'typeorm';

@Entity('users')
export class UserEntitiy extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
  
  @Column()
  user_password: string;

  @Column()
  name: string;

  @OneToMany(() => ArticleEntity, (entity) => entity.user)
  @JoinColumn({ referencedColumnName: 'username' })
  article: ArticleEntity[];

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
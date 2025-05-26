import { ArticleEntity } from 'src/article/infrastructure/entity/ArticleEntity';
import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, Unique,  } from 'typeorm';

@Entity('users')
export class UserEntitiy extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  user_password: string;

  @Column()
  nickname: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
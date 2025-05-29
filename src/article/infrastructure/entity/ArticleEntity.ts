import { User } from 'src/user/domain/User';
import { UserEntitiy } from 'src/user/infrastructure/entity/UserEntity';
import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity('articles')
export class ArticleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntitiy)
  @JoinColumn({ name: 'user_id' })
  user: UserEntitiy;

  // @Column()
  // user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}

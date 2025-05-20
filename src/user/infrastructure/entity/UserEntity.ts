import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,  } from 'typeorm';


@Entity('users')
export class UserEntitiy extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;
  
  @Column()
  user_password: string;

  @Column()
  name: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
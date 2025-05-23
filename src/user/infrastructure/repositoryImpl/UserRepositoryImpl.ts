import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../UserRepository";
import { UserEntitiy } from "../entity/UserEntity";
import { Repository } from "typeorm";
import { User } from "src/user/domain/User";
import { UserRepositoryImplMapper } from "../mapper/UserRepositoryImplMapper";

export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntitiy)
    private readonly userEntityRepository: Repository<UserEntitiy>,
  ) {}

  // username (문자아이디로 찾는 함수)
  async findById(username: string): Promise<User | null> {
    const entity = await this.userEntityRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: username })
      .getOne();
      
    return entity ? UserRepositoryImplMapper.toDomain(entity) : null;
  }
  
}
import { User } from '../domain/User';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  // save(user: User): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
  // delete(id: number): Promise<void>;
}

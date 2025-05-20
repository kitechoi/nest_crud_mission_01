import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserUseCase {
  private readonly users = [
    {
      userId: 'yeun2001',
      userPassword: 'qwer1234',
      name: "연",
    },
    {
      userId: 'chevel',
      userPassword: 'qwer1234',
      name: "연이",
    },
  ];

  async findOne(userId: string): Promise<User | undefined> {
    return this.users.find((user) => user.userId === userId);
  }
}

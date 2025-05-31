import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FindUserByIdUseCase } from '../FindUserByIdUseCase/FindUserByIdUseCase';
import { CreateReissuedAccessTokenUseCaseRequest } from './dto/CreateReissuedAccessTokenUseCaseRequest';
import { CreateReissuedAccessTokenUseCaseResponse } from './dto/CreateReissuedAccessTokenUseCaseResponse';
import { UseCase } from 'src/shared/core/application/UseCase';

@Injectable()
export class CreateReissuedAccessTokenUseCase
  implements
    UseCase<
      CreateReissuedAccessTokenUseCaseRequest,
      CreateReissuedAccessTokenUseCaseResponse
    >
{
  constructor(private readonly findUserByIdUseCase: FindUserByIdUseCase) {}

  async execute(
    request: CreateReissuedAccessTokenUseCaseRequest,
  ): Promise<CreateReissuedAccessTokenUseCaseResponse> {
    const { ok, user } = await this.findUserByIdUseCase.execute({
      id: request.id,
    });

    if (!ok) {
      throw new InternalServerErrorException();
    }
    if (user === null) {
      throw new NotFoundException('User not found');
    }

    const accessToken = user.issueJWTAccessToken();

    return {
      ok: true,
      accessToken: accessToken,
    };
  }
}

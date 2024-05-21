import { AgentsEnum } from '../../../utils/enums/agents.enum';
import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  sub: string;

  username: string;

  role: string;

  organizationId: string
}

export class SignInResponseDto {
  fullName: string;

  accessToken: string;
}

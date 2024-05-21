export interface TokenDto {
  sub: string;

  username: string;

  role: string;

  organizationId: string
}

export interface SignInResponseDto {
  fullName: string;

  accessToken: string;
}
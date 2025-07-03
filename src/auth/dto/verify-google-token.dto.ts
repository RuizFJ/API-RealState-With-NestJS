import { IsString } from 'class-validator';

export class VerifyGoogleTokenDto {
  @IsString()
  idToken: string;
}
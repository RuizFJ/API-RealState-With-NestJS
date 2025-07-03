import { IsString } from "class-validator";

export class SignUpWithGoogleDto {
  @IsString()
  idToken: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
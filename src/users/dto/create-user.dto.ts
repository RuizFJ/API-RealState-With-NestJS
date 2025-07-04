import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { AuthenticationStatus } from "src/common/enums/provider-authentication.enum";


export class CreateUserDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    googleId?: string;

    @IsEnum(() => AuthenticationStatus)
    @IsOptional()
    provider?: AuthenticationStatus
}

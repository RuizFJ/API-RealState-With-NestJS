import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class SignUpLocalDto {
        @IsString()
        @MinLength(3)
        name: string;

        @IsString()
        @MinLength(3)
        lastName: string;
    
        @IsString()
        @IsEmail()
        email: string;
    
        @IsString()
        @MinLength(6)
        password: string;
    
        
}
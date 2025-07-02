import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class singInWithEmail {
     @IsString()
        @MinLength(3)
        name: string;
    
        @IsString()
        @IsEmail()
        email: string;
    
        @IsString()
        @MinLength(6)
        password: string;
    
        @IsString()
        @MinLength(3)
        @IsOptional()
        lastName?: string;
}
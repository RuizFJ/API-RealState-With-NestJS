import { IsNumber, IsString, Min, MinLength,  } from "class-validator";

export class CreatePropertyDto {

    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    @MinLength(10)
    description: string;

    @IsNumber()
    price: number;

    @IsString()
    status: string;

    @IsString()
    @MinLength(5)
    address: string;

    @IsString()
    @MinLength(2)
    city: string;

    @IsString()
    property_type: string;

    @IsNumber()
    bedrooms: number;

    @IsNumber()
    bathrooms: number;

    @IsNumber()
    area: number;

    @IsString({ each: true })
    images: string[];

    @IsString()
    user_id: string; // Assuming user_id is a UUID or similar identifier


}

import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GetUserFilterDto {

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    elo?: string;

    @IsOptional()
    status?: string
}
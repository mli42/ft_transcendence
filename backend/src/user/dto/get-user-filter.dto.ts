import { IsNumber, IsOptional, IsString } from "class-validator";

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
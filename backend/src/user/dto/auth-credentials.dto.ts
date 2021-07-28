import { IsNotEmpty, MinLength, MaxLength, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
	@IsOptional()
	@ApiProperty({description: 'optional'})
	username: string;

	@IsOptional()
	@ApiProperty({description: 'optional'})
	email: string;

	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(32)
	@ApiProperty({description: 'required'})
	password: string;
}
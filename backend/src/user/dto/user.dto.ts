import { IsNotEmpty, MinLength, MaxLength, IsEmail, Matches, IsEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNull } from 'typeorm';

export class CreateUserDto {
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(15)
	@ApiProperty({description: 'required'})
	username: string;

	@IsNotEmpty()
	@IsEmail()
	@ApiProperty({description: 'required'})
	email: string;

	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(32)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password is too weak',
	})
	@ApiProperty({description: 'required'})
	password: string;

}
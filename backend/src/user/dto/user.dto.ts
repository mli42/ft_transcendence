import { IsNotEmpty, MinLength, MaxLength, IsEmail, Matches, IsEmpty, IsOptional, Equals } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNull } from 'typeorm';
import { Match } from './match.decorator';

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

	@IsNotEmpty()
	@Match('password',{
		message: 'the passwords entered are not identical',
	})
	passwordConfirm: string;

}
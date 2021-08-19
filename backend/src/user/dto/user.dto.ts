import { IsNotEmpty, MinLength, MaxLength, IsEmail, Matches, IsEmpty, IsOptional, Equals, IsAlphanumeric } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from './match.decorator';

export class CreateUserDto {
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(15)
	@IsAlphanumeric()
	@ApiProperty({description: 'not empty'})
	username: string;

	@IsNotEmpty()
	@IsEmail()
	@ApiProperty({description: 'not empty'})
	email: string;

	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(32)
	@Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password is too weak, uppercase, lowercase, number and special character',
	})
	@ApiProperty({description: 'not empty with : uppercase, lowercase, number and special character'})
	password: string;

	@IsNotEmpty()
	@Match('password',{
		message: 'the passwords entered are not identical',
	})
	@ApiProperty({description: 'not empty'})
	passwordConfirm: string;
}


export class SigInUserDto {
	@IsNotEmpty()
	@ApiProperty({description: 'not empty'})
	id: string;

	@IsNotEmpty()
	@ApiProperty({description: 'not empty with : uppercase, lowercase, number and special character'})
	password: string;
}
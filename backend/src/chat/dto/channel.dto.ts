import { IsNotEmpty, MinLength, MaxLength, IsEmail, Matches, IsEmpty, IsOptional, Equals } from 'class-validator';

export class CreateChannelDto {

	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(15)
	name: string;

	@IsOptional()
	private: string;

}
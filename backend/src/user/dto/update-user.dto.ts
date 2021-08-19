import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEmail, IsOptional, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
	@MinLength(3)
	@MaxLength(15)
	@ApiProperty()
	@IsAlphanumeric()
	username: string;

	@IsOptional()
	@IsEmail()
	@ApiProperty()
	email: string;

    @IsOptional()
	@MinLength(8)
	@MaxLength(32)
	@Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password is too weak, uppercase, lowercase, number and special character',
	})
	@ApiProperty()
	password: string;
}
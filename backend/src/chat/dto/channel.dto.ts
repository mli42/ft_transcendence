import { IsNotEmpty, MinLength, MaxLength, Matches, IsOptional, IsAlphanumeric, IsDate } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class ChannelDto {

    @IsNotEmpty()
    channelId: string;
    
    @IsNotEmpty()
	@MinLength(3)
	@MaxLength(15)
	@IsAlphanumeric()
    channelName: string;
    
    @IsOptional()
    @IsDate()
    date?: Date;
    
    @IsOptional()
    users?: User[];
    
    @IsNotEmpty()
    publicChannel?: boolean;
    
    @IsOptional()
    @MinLength(5)
	@MaxLength(32)
	@Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password is too weak, uppercase, lowercase, number and special character',
	})
    password?: string;
    
    @IsOptional()
    adminUsers?: string[];
    
    @IsOptional()
    owner?: string;
    
    @IsOptional()
    authPrivateChannelUsers?: string[];
    
    @IsNotEmpty()
	directMessage: boolean;
}
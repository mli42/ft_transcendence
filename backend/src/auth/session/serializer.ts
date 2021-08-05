import { PassportSerializer } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { User } from '../../user/entities/user.entity'
import { UserService } from '../../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly userService: UserService) { 
        super();
    } 

    serializeUser(user: User, done: (err: Error, user: User) => void ) {
        done(null, user);
    }

    async deserializeUser(user: User, done: (err: Error, user: User) => void) {
        const userDb = await this.userService.findUser42(user.username);
        return userDb ? done(null, userDb) : done(null, null);
    }
} 
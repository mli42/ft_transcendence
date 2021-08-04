import { PassportSerializer } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { User } from '../../user/entities/user.entity'

@Injectable()
export class SessionSerializer extends PassportSerializer {
    // constructor() { } 

    serializeUser(user:User, done: (err: Error, user: User) => void ) {
        done(null, user);
    }

    deserializeUser(user: User, done: (err: Error, user: User) => void) {
        // const userDb;
        // done(null, userDb);
    }
} 
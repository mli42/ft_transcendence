import { Injectable, CanActivate, ExecutionContext, Res, Inject, forwardRef } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';

@Injectable()
export class UserAuth implements CanActivate {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        let respons = context.switchToHttp().getResponse();
        const user: User = request.user;
        if (user.twoFactorAuth === false)
            return true;
        // console.log("cookie: ", request.cookies.userAuth);
        // console.log(typeof(request.cookies.userAuth));
        if (request.cookies.userAuth === 'false') {
            return false;
        }
        return true
  }
}
import { Injectable, CanActivate, ExecutionContext, Res, Inject, forwardRef, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import jwt_decode from "jwt-decode";

@Injectable()
export class UserAuth implements CanActivate {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        if (user.isBan === true) {
            throw new ForbiddenException('You are banned, you no longer have access to our site');
        }

        let decode = jwt_decode(request.cookies.jwt);
        if (decode['auth'] === false && user.twoFactorAuth === true) {
            throw new ForbiddenException('need 2FA');
        }
        return true;
    }
}
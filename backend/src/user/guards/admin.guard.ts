import { Injectable, CanActivate, ExecutionContext, Res, Inject, forwardRef, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';


@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        if (user.isAdmin === false) {
            throw new UnauthorizedException('You aren\'t an administrator');
        }
        return true;
    }
}
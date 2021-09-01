import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { UserAuth } from 'src/user/guards/userAuth.guard';
import { AdminService } from './admin.service';

@ApiTags('users')
@Controller('api/admin')
export class AdminController {
    constructor (
        private readonly adminService: AdminService
    ) {}

    @ApiOperation({description: 'Get numbers Users'})
    @UseGuards(AuthGuard('jwt'), UserAuth)
    @Get('/allUsers')
    getNumbersUsers(@Req() req): Promise<Partial<User[]>> {
        const user: User = req.user;

        if (user.isAdmin === false)
			throw new UnauthorizedException('You aren\'t an administrator');
        return this.adminService.getNumbersUsers();
    }

    @ApiOperation({description: 'Get All Admin'})
    @UseGuards(AuthGuard('jwt'), UserAuth)
    @Get('/allAdmin')
    getAllAdmin(@Req() req): Promise<Partial<User[]>> {
        const user: User = req.user;

        if (user.isAdmin === false)
			throw new UnauthorizedException('You aren\'t an administrator');
        return this.adminService.getAllAdmin();
    }
}

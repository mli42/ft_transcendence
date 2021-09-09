import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { AdminGuard } from 'src/user/guards/admin.guard';
import { UserAuth } from 'src/user/guards/userAuth.guard';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
    constructor (
        private readonly adminService: AdminService
    ) {}

    @ApiOperation({description: 'Get numbers Users'})
    @UseGuards(AuthGuard('jwt'), UserAuth)
    @Get('/allUsers')
    getAllUsers(@Req() req): Promise<Partial<User[]>> {
        return this.adminService.getAllUsers();
    }

    @ApiOperation({description: 'Get All Admin'})
    @UseGuards(AuthGuard('jwt'), UserAuth, AdminGuard)
    @Get('/allAdmin')
    getAllAdmin(): Promise<Partial<User[]>> {
        return this.adminService.getAllAdmin();
    }
}

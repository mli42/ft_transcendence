import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { AdminService } from './admin.service';

@ApiTags('users')
@Controller('api/admin')
export class AdminController {
    constructor (
        private readonly adminService: AdminService
    ) {}

    @Get('/allUsers')
    getNumbersUsers(): Promise<number> {
        return this.adminService.getNumbersUsers();
    }

    @Get('/allAdmin')
    getAllAdmin(): Promise<Partial<User[]>> {
        return this.adminService.getAllAdmin();
    }
}

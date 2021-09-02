import { Controller, Get, Param, Res, UseGuards, Header } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Observable, of } from "rxjs";
import { GameService } from './game.service';

@ApiTags('game')
@Controller('api/game')
export class GameController {
    constructor(
        private gameService: GameService
    ) {}

    @ApiOperation({summary: 'Get One Map'})
	@ApiOkResponse({description: 'retrieve the map by sending its name as a parameter'})
	@ApiParam({name: 'nameMap', required: true, description: 'name of the map'})
    /*******/
	@Get('/map/:nameMap')
	getMap(@Res() res, @Param('nameMap') nameMap): Observable<object> {
        return this.gameService.getMap(res, nameMap);
    }

    @ApiOperation({summary: 'Get All Map'})
	@ApiOkResponse({description: 'returns a list of all available maps'})
    /*******/
    @UseGuards(AuthGuard('jwt'))
    @Get('/mapList')
    getAllMap(@Res() res): any {
      return res.set({ 'Cache-Control': ['public', 'max-age=604800', 'immutable']}).json(this.gameService.getAllMap());
    }

}

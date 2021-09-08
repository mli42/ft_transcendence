import { Controller, Get, Param, Res, UseGuards, Header } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Observable, of } from "rxjs";
import { GameService } from './game.service';
import { playingGames, gamesMap, playingUsers } from "./game.gateway";

@ApiTags('game')
@Controller('api/game')
export class GameController {
  constructor(
    private gameService: GameService
  ) {}

  /**
   * MAPS ROUTES
   */
  @ApiOperation({summary: 'Get All Map'})
  @ApiOkResponse({description: 'returns a list of all available maps'})
  /*******/
  @UseGuards(AuthGuard('jwt'))
  @Get('/mapList')
  getAllMap(@Res() res): any {
    return res.set({ 'Cache-Control': ['public', 'max-age=604800', 'immutable']}).json(this.gameService.getAllMap());
  }

  @ApiOperation({summary: 'Get One Map'})
  @ApiOkResponse({description: 'retrieve the map by sending its name as a parameter'})
  @ApiParam({name: 'nameMap', required: true, description: 'name of the map'})
  /*******/
  @Get('/map/:nameMap')
  getMap(@Res() res, @Param('nameMap') nameMap): Observable<object> {
    return this.gameService.getMap(res, nameMap);
  }

  @ApiOperation({summary: 'Get Small Map'})
	@ApiOkResponse({description: 'retrieve the map by sending its name as a parameter'})
	@ApiParam({name: 'nameMap', required: true, description: 'name of the map'})
  /*******/
	@UseGuards(AuthGuard('jwt'))
	@Get('/smallMap/:nameMap')
	getSmallMap(@Res() res, @Param('nameMap') nameMap): Observable<object> {
    return this.gameService.getSmallMap(res, nameMap);
  }

  /**
   * GAMES ROUTES
   */
  @ApiOperation({summary: 'Get All Playing Games'})
  @ApiOkResponse({description: 'returns a list of all playing maps'})
  /*******/
  @UseGuards(AuthGuard('jwt'))
  @Get('/playingGames')
  getPlayingGames(@Res({passthrough: true}) res): string[] {
    return (playingGames);
  }

  @ApiOperation({summary: 'Get the whole playing game class'})
  @ApiOkResponse({description: 'returns a data of a game by id'})
  @ApiParam({name: 'gameId', required: true, description: 'id of the playing game'})
  /*******/
  @UseGuards(AuthGuard('jwt'))
  @Get('/playingGames/:gameId')
  getGameClass(@Res({passthrough: true}) res, @Param('gameId') id): any {
    return (gamesMap.get(id));
  }

  @ApiOperation({summary: 'Get All Playing Users'})
  @ApiOkResponse({description: 'returns a list of all playing users ids'})
  /*******/
  @UseGuards(AuthGuard('jwt'))
  @Get('/playingUsers')
  getPlayingUsers(@Res({passthrough: true}) res): string[] {
    return (playingUsers);
  }
}

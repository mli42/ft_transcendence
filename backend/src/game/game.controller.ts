import { Controller, Get, Param, Res, UseGuards, Header } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Observable, of } from "rxjs";
import { GameService } from './game.service';
import { playingGames, gamesMap } from "./game.gateway";

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

}

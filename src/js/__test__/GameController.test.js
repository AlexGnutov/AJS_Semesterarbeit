import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import GameState from '../GameState';

jest.mock('../GameStateService.js');
jest.mock('../GamePlay.js');
jest.mock('../GameState.js');

beforeEach(() => {
  jest.resetAllMocks();
});

test('Test load function - load is OK - but no data', () => {
  const gamePlay = new GamePlay();
  const gameStateService = new GameStateService(localStorage);
  const gameCtrl = new GameController(gamePlay, gameStateService);

  gameStateService.load.mockReturnValue(null);
  const spy = jest.spyOn(GamePlay, 'showMessage');

  gameCtrl.onLoadGameClick();

  expect(gameStateService.load).toHaveBeenCalled();
  expect(spy).toBeCalledWith('No saved data to load...');
});

test('Test load function - load is OK - data is OK', () => {
  const gamePlay = new GamePlay();
  const gameStateService = new GameStateService(localStorage);
  const gameCtrl = new GameController(gamePlay, gameStateService);
  gameCtrl.gameState = new GameState();

  gameStateService.load.mockReturnValue({ state: 'state' });
  const spy = jest.spyOn(GamePlay, 'showMessage');

  gameCtrl.onLoadGameClick();

  expect(gameStateService.load).toHaveBeenCalled();
  expect(spy).toBeCalledWith('Sucessfully loaded data');
});

test('test load function', () => {
  const gamePlay = new GamePlay();
  const gameStateService = new GameStateService(localStorage);
  const gameCtrl = new GameController(gamePlay, gameStateService);
  gameCtrl.gameState = new GameState();

  gameStateService.load.mockImplementation(() => { throw new Error('Invalid state'); });
  const spy = jest.spyOn(GamePlay, 'showMessage');

  gameCtrl.onLoadGameClick();

  expect(gameStateService.load).toHaveBeenCalled();
  expect(spy).toBeCalledWith('Invalid state');
});

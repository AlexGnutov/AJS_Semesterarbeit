import GameState from './GameState';
import GamePlay from './GamePlay';
import { makeTitle, getRandomFrom } from './utils';
import themes from './themes';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gameState = new GameState();

    // gamePlay events (click, enter, leave)
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    // new, save and load buttons events
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
    // Blocked event containers
    this.gamePlay.$cellClickListeners = [];
    this.gamePlay.$cellEnterListeners = [];
    this.gamePlay.$cellLeaveListeners = [];

    // try load saved stated from stateService
    let state;
    try {
      state = this.stateService.load();
    } catch (e) {
      GamePlay.showMessage(e.message);
    }
    if (state) {
      this.gameState.recoverFromLoaded(state);
    } else {
      this.gameState.newGame();
    }

    const actualTheme = themes[this.gameState.currentLevel - 1];
    this.gamePlay.drawUi(actualTheme); // p.3 Отрисовка поля
    this.gamePlay.redrawPositions(this.gameState.units);

    this.fieldBlock();
    setTimeout(() => {
      this.fieldUnblock();
    }, 10);
  }

  // **
  // User access blocking
  /**
   * @description Swich off cell click/enter/leave handlers and blocks user access
   */
  fieldBlock() {
    this.gamePlay.$cellClickListeners = this.gamePlay.cellClickListeners;
    this.gamePlay.$cellEnterListeners = this.gamePlay.cellEnterListeners;
    this.gamePlay.$cellLeaveListeners = this.gamePlay.cellLeaveListeners;
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
  }

  /**
   * @description Turn on cell click/enter/leave handlers
   */
  fieldUnblock() {
    this.gamePlay.cellClickListeners = this.gamePlay.$cellClickListeners;
    this.gamePlay.cellEnterListeners = this.gamePlay.$cellEnterListeners;
    this.gamePlay.cellLeaveListeners = this.gamePlay.$cellLeaveListeners;
  }

  /**
   * @descriptionSaves starts new game
   */
  onNewGameClick() {
    this.gameState.newGame();
    const actualTheme = themes[this.gameState.currentLevel - 1];
    this.gamePlay.drawUi(actualTheme); // p.3 Отрисовка поля
    this.gamePlay.redrawPositions(this.gameState.units);
  }

  /**
   * @description Saves current game state
   */
  onSaveGameClick() {
    const {
      units,
      nextTurn,
      currentLevel,
    } = this.gameState;
    const state = {
      units,
      nextTurn,
      currentLevel,
    };
    this.stateService.save(state);
    GamePlay.showMessage('Game saved');
  }

  /**
   * @description Loads latest saved game
   */
  onLoadGameClick() {
    let state;
    try {
      state = this.stateService.load();
    } catch (e) {
      GamePlay.showMessage(e.message);
    }
    if (state) {
      this.gameState.recoverFromLoaded(state);
      this.redrawAll();
      GamePlay.showMessage('Sucessfully loaded data');
    } else {
      GamePlay.showMessage('No saved data to load...');
    }
  }

  /**
   * @description Processes all user clicks
   * @param {*} index clicked cell index
   */
  onCellClick(index) {
    // Check, if the cell has selected character in
    const activeCell = this.gameState.getSelectedCell();

    // If any character is selected, do (4 opportunities):
    if (activeCell !== null) {
      // Get position information
      const activeUnit = this.gameState.getUnitFromCell(activeCell);
      const allowedToGo = activeUnit.getAllowedToGo();
      const allowedToAttack = activeUnit.getAllowedToAttack();
      const busyCells = this.gameState.getAllUnitsCells();
      const playerCells = this.gameState.getAllPlayerCells();
      const enemyCells = this.gameState.getAllEnemyCells();

      // Move (if can there move)
      if (allowedToGo.includes(index) && !busyCells.includes(index)) {
        this.gamePlay.deselectCell(index);
        activeUnit.position = index;
        this.gameState.selectedCell = null;
        this.gamePlay.deselectCell(activeCell);
        this.gamePlay.redrawPositions(this.gameState.units);
        // (next turn here)
        this.fieldBlock();
        this.aiTurn();
      }
      // Attack, if there is enemy in cell and unit can attack it
      if (allowedToAttack.includes(index) && enemyCells.includes(index)) {
        const target = this.gameState.getUnitFromCell(index);
        const damage = activeUnit.attacks(target);
        this.gameState.selectedCell = null;
        this.gamePlay.deselectCell(activeCell);
        this.gamePlay.deselectCell(index);

        this.fieldBlock();
        this.gamePlay.showDamage(index, -damage).then(() => {
          if (target.character.health <= 0) {
            this.gameState.removeCharacter(target);
            this.stateCheck(true);
          } else {
            this.gamePlay.redrawPositions(this.gameState.units);
            this.aiTurn();
          }
        });
      }
      // Deselect unit, if the cell is empty and it can't go into it
      if (!allowedToGo.includes(index) && !busyCells.includes(index)) {
        this.gameState.selectedCell = null;
        this.gamePlay.deselectCell(activeCell);
        this.gamePlay.deselectCell(index);
      }
      // If cell contains another unit - select it
      if (playerCells.includes(index)) {
        this.gameState.selectedCell = index;
        this.gamePlay.deselectCell(activeCell);
        this.gamePlay.selectCell(index);
      }
    } else {
      // If no unit selected: check, if there is a unit in cell, and select it, if it is
      const playerCells = this.gameState.getAllPlayerCells();
      if (playerCells.includes(index)) {
        this.gamePlay.selectCell(index);
        this.gameState.selectedCell = index;
      }
    }
  }

  /**
   * @description Reacts on cursor entering inside cell boarders
   * @param {*} index - Entered cell index
   */
  onCellEnter(index) {
    // If cell is occupied by any character - show title
    const unit = this.gameState.getUnitFromCell(index);
    if (unit) {
      this.gamePlay.showCellTooltip(makeTitle(unit.character), index);
    }

    // Show finger - when over friendly characters:
    if (this.gameState.getAllPlayerCells().includes(index)) {
      this.gamePlay.setCursor('pointer');
    }

    // Check, if a character is selected...
    const activeCell = this.gameState.getSelectedCell();
    if (activeCell !== null) {
      // If yes, get related data first
      const activePos = this.gameState.getUnitFromCell(activeCell);
      const allowedToGo = activePos.getAllowedToGo();
      const allowedToAttack = activePos.getAllowedToAttack();

      // Show move possibility, when move is possble:
      const busyCells = this.gameState.getAllUnitsCells();
      if (allowedToGo.includes(index) && !busyCells.includes(index)) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor('pointer');
      }

      // Show attack possibility, when attack is possible:
      const enemyCells = this.gameState.getAllEnemyCells();
      if (allowedToAttack.includes(index) && (enemyCells.includes(index))) {
        this.gamePlay.selectCell(index, 'red');
        this.gamePlay.setCursor('crosshair');
      }

      // Show not-allowed, when too far to attack:
      if (!allowedToAttack.includes(index) && (enemyCells.includes(index))) {
        this.gamePlay.setCursor('not-allowed');
      }
    }
  }

  /**
   * @description Deselects cell and returns cursor to a normal style
   * @param {*} index cell coordinate
   */
  onCellLeave(index) {
    // If there is no selected unit in the cell, turn off any selection
    if (index !== this.gameState.getSelectedCell()) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.setCursor('auto'); // cursor back to auto
    this.gamePlay.hideCellTooltip(index); // tip hide
  }

  /**
   * @description Performs AI turn - all things are randomized
   */
  aiTurn() {
    // Random selection of a unit to use
    const enemyCells = this.gameState.getAllEnemyCells();
    const activeCell = getRandomFrom(enemyCells);
    const activeUnit = this.gameState.getUnitFromCell(activeCell);

    // Check, if the unit can attack. If yes, attack random target
    const allowedToAttack = activeUnit.getAllowedToAttack();
    const playerCells = this.gameState.getAllPlayerCells();
    const accessableTargets = playerCells.filter((x) => allowedToAttack.includes(x));

    const targetCell = getRandomFrom(accessableTargets);
    if (targetCell) {
      const target = this.gameState.getUnitFromCell(targetCell);
      const damage = activeUnit.attacks(target);

      this.gamePlay.showDamage(targetCell, -damage).then(() => {
        if (target.character.health <= 0) {
          this.gameState.removeCharacter(target);
          this.stateCheck(true);
        } else {
          this.gamePlay.redrawPositions(this.gameState.units);
          this.fieldUnblock();
        }
      });
    } else {
      // If no target to attack, make a move (random cell)
      const allowedToGo = activeUnit.getAllowedToGo();
      const busyCells = this.gameState.getAllUnitsCells();
      const accessableCells = allowedToGo.filter((x) => !busyCells.includes(x));
      const gotoCell = getRandomFrom(accessableCells);
      if (gotoCell) {
        activeUnit.position = gotoCell;
        this.gamePlay.redrawPositions(this.gameState.units);
      }
      this.fieldUnblock();
    }
  }

  /**
   * @description Check if both teams have enough units
   * @param {*} aiIsNext if true - AI will make next turn, if false - player
   * @returns nothing
   */
  stateCheck(aiIsNext) {
    // If player's team has no units - Game over
    if (this.gameState.playerTeam.members.length === 0) {
      // eslint-disable-next-line no-alert
      GamePlay.showMessage('GAME OVER!');
      // Get new game state and redraw
      this.gameState.newGame();
      this.redrawAll();
      this.fieldUnblock();
      return;
    }

    // If enemy's team has no players - Next level of Total Win
    if (this.gameState.enemyTeam.members.length === 0) {
      this.gameState.nextLevel();
      this.redrawAll();
      this.fieldUnblock();
      return;
    }

    // If no game over / game won or next level - redraw and next turn
    this.gamePlay.redrawPositions(this.gameState.units);
    // AI turn, if switched to state check from player turn:
    if (aiIsNext) {
      this.aiTurn();
    }
    this.fieldUnblock();
  }

  /**
   * @description Helps to redraw battlefield with only one call
   */
  redrawAll() {
    const actualTheme = themes[this.gameState.currentLevel - 1];
    this.gamePlay.drawUi(actualTheme);
    this.gamePlay.redrawPositions(this.gameState.units);
  }
}

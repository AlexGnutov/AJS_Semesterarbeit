/* eslint-disable no-param-reassign */
import Team from './Team';
import Unit from './Unit';
import Bowman from './characters/bowman';
import Swordsman from './characters/swordsman';
import Magician from './characters/magician';
import Vampire from './characters/vampire';
import Undead from './characters/undead';
import Deamon from './characters/deamon';
import { characterGenerator } from './generators';
import GamePlay from './GamePlay';

export default class GameState {
  constructor() {
    this.playerTeam = undefined;
    this.enemyTeam = undefined;
    this.units = [];
    this.nextTurn = 'player';
    this.selectedCell = null;
    this.currentGameScore = 0;
    this.scores = [];
    this.currentLevel = 0;
  }

  /**
   * @description Fills GameState object with data for complete new game
   */
  newGame() {
    this.currentLevel = 1;
    this.currentGameScore = 0;

    this.playerTeam = new Team('Humans', 2, 1, [Swordsman, Bowman]);
    this.enemyTeam = new Team('Darkens', 2, 1);

    this.giveAllUnitsPosition();
  }

  /**
   * @description Gets start positions, creates and positions units
   */
  giveAllUnitsPosition() {
    const pSPos = Unit.getStartPos(this.playerTeam.members.length, 8, 'Humans');
    const eSPos = Unit.getStartPos(this.enemyTeam.members.length, 8, 'Darkens');

    this.units = [];
    this.playerTeam.members.forEach(
      (m, i) => this.units.push(new Unit(m, pSPos[i])),
    );
    this.enemyTeam.members.forEach(
      (m, i) => this.units.push(new Unit(m, eSPos[i])),
    );
  }

  /**
   * @description Fills GameState object with data from local storage
   * @param {*} state - state object
   */
  recoverFromLoaded(state) {
    this.currentLevel = state.currentLevel;
    this.nextTurn = state.nextTurn;

    this.units = []; // Zeroing units of game state
    // Make two empty teams
    this.playerTeam = new Team('Humans', 0, 1);
    this.enemyTeam = new Team('Darkens', 0, 1);

    // Get units data from state
    const { units } = state;
    units.forEach((unit) => {
      // Get character data from units
      const { type, health, level } = unit.character;
      // check if unit data corresponds to "frendly" or "foe"
      // create new character, put in into right team
      // create new unit and put in into game state units
      if (['swordsman', 'bowman', 'magician'].includes(type)) {
        const newCharacter = this.playerTeam.addCharacter(type, level, health);
        this.units.push(new Unit(newCharacter, unit.position));
      }
      if (['undead', 'vampire', 'daemon'].includes(type)) {
        const newCharacter = this.enemyTeam.addCharacter(type, level, health);
        this.units.push(new Unit(newCharacter, unit.position));
      }
    });
  }

  /**
   * @description Updates GameState object according to the next level set
   */
  nextLevel() {
    // Switch current level value to next
    this.currentLevel += 1;

    // Collect game score
    this.playerTeam.members.forEach((m) => {
      this.currentGameScore += m.health;
    });

    // If it was last level - generate new game
    if (this.currentLevel > 4) {
      GamePlay.showMessage(`Master, you have brilliantly won all the levels! Congratulations! You overall score is ${this.currentGameScore}`);
      this.newGame();
      return;
    }

    // Recover health and do level UP
    this.playerTeam.members.forEach((m) => {
      const newAttack = Math.max(m.attack, Math.round(m.attack * (0.5 + m.health / 100)));
      m.health = 100;
      m.level += 1;
      m.attack = newAttack;
    });
    // Add characters
    const humans = [Swordsman, Bowman, Magician];
    const darkens = [Vampire, Undead, Deamon];
    // Prepare generators
    const getLevel2Human = characterGenerator(humans, 1);
    const getLevel3Human = characterGenerator(humans, 2);
    const getLevel4Human = characterGenerator(humans, 3);
    const getLevel2Darken = characterGenerator(darkens, 1);
    const getLevel3Darken = characterGenerator(darkens, 2);
    const getLevel4Darken = characterGenerator(darkens, 3);

    switch (this.currentLevel) {
      case 2: // level2
        this.playerTeam.members.push(getLevel2Human.next().value);
        for (let i = 0; i < this.playerTeam.members.length; i += 1) {
          this.enemyTeam.members.push(getLevel2Darken.next().value);
        }
        break;
      case 3: // level3
        this.playerTeam.members.push(getLevel3Human.next().value);
        this.playerTeam.members.push(getLevel3Human.next().value);
        for (let i = 0; i < this.playerTeam.members.length; i += 1) {
          this.enemyTeam.members.push(getLevel3Darken.next().value);
        }
        break;
      case 4: // level4
        this.playerTeam.members.push(getLevel4Human.next().value);
        this.playerTeam.members.push(getLevel4Human.next().value);
        for (let i = 0; i < this.playerTeam.members.length; i += 1) {
          this.enemyTeam.members.push(getLevel4Darken.next().value);
        }
        break;
      default:
    }

    this.giveAllUnitsPosition();
    GamePlay.showMessage(`Good work! Welcome to level ${this.currentLevel}. You current score is ${this.currentGameScore}`);
  }

  getSelectedCell() {
    return this.selectedCell;
  }

  getAllUnitsCells() {
    return this.units.map((pos) => pos.position);
  }

  getAllPlayerCells() {
    const output = [];
    this.playerTeam.members.forEach((m) => {
      const { position } = this.units.find((pos) => pos.character === m);
      output.push(position);
    });
    return output;
  }

  getAllEnemyCells() {
    const output = [];
    this.enemyTeam.members.forEach((m) => {
      const { position } = this.units.find((pos) => pos.character === m);
      output.push(position);
    });
    return output;
  }

  getUnitFromCell(index) {
    return this.units.find((unit) => unit.position === index);
  }

  removeCharacter(unit) {
    const idxp = this.playerTeam.members.indexOf(unit.character);
    if (idxp >= 0) {
      this.playerTeam.members.splice(idxp, 1);
    }
    const idxe = this.enemyTeam.members.indexOf(unit.character);
    if (idxe >= 0) {
      this.enemyTeam.members.splice(idxe, 1);
    }
    const idx = this.units.indexOf(unit);
    if (idx >= 0) {
      this.units.splice(idx, 1);
    }
  }
}

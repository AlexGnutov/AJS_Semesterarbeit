# Пояснительная записка к решению

## Подход в целом
* Класс PositionedCharacter из задания переименован в `Unit` и работает с юнитами. Юнит - это объект, включающий персонаж и его позицию (все юниты - хранятся в `GameState.units`) - т.е. как и было. Этот класс позволяет "собрать" и разместить юниты, а также даёт информацию о клетках, которые заняты своими и вражескими юнитами, выдаёт юнит по клетке и т.п. В нём же происходит расчёт последствий атаки. 
* В центре решения объект `GameState`. Особое место занимает его поле `units`. Методы объекта выгружают массивы, показывающие, какие клетки свободны, где свои юниты, какие клетки заняты врагом и т.п.
* На основе полученных от `GameState` и `Unit` данных в классе `GameController` реализована логика при различных действиях пользователя.
* Если в какой-либо команде погибают все юниты, то идёт вызов методов изменения состояния `newGame()` или `nextLevel()`. Они находятся в классе `GameState` и позволяют создать новое состояние для новой игры или очередного уровня.
* ПК действует случайным образом с приоритетом атаки, при этом используются все те же методы, что и при реализации логики для игрока.
* Для удобства реализовано некоторое количество дополнительных функций в классе `Team` и модуле `utils.js`.

## Классы без изменений

* `GamePlay`
* `GameStateService`

## Реализованные и модернизированные классы

### class GameState
Хранит состояние игры на данный момент.
* `newGame()` - состояние объекта переводится в соответствующее новой игре.
* `giveAllUnitsPosition()` - получает стартовые позиции, создаёт и расставляет юнитов в начале игры и на следующих уровнях.
* `recoverFromLoaded(state)` - восстанавливает сохранённое состояние. Генерирует перснажей, создаёт юниты и расставляет их без случайностей, используя данные сохранённого состояния.
* `nextLevel()` - переводит игру на следующий уровень или завершает её, когда заканчивается четвёртый уровень.
* `getSelectedCell()` - возвращает номер выделенной в данный момент ячейки
* `getAllUnitsCells()` - возвращает номера всех ячеек, где есть какие-либо юниты (куда нельзя пойти).
* `getAllPlayerCells()` - возвращает номера ячеек, где находятся юниты игрока.
* `getAllEnemyCells()` - возвращает номера ячеек, где находятся юниты противника.
* `getUnitFromCell(index)` - возвращает юнит по номеру ячейки.
* `removeCharacter(unit)` - удаляет юнит из команды и units.

### class Unit (ранее PositionedCharacter)
Позволяет создавать юниты и получать сведения об их возможностях в зависимости от положения, рассчитывает атаку.
* `static getStartPos(number, boardSize, side)` - возвращает набор стартовых позиций для одной из двух команд.
* `getAllowedToGo()` - возвращает клетки, в которые может пойти данный юнит.
* `getAllowedToAttack()` - возвращате клетки, которые может атаковать данный юнит.
* `attacks(target)` - "наносит урон" юниту, атакуемому данным юнитом

### class GameController
Реализует алгоритм взаимодействия с пользователем и развития игры. Ключевые компоненты: работа с состоянием, работа с вводом, ходы ПК, проверка состояния выигрыша.

Главный маршрут: веделение персонажа -> атака -> проверка состояния -> принятие решения о завершении уровня или игры -> запуск нового уровня или игры.

* `init()` - инициализация при запуске: загрузка сохранённой игры или создание новой, подключение обработчиков, сохранение наборов обработчиков
* `fieldBlock()` - блокировка поля игры
* `fieldUnblock()` - разблокировка поля игры
* `onNewGameClick()` - по нажатию кнопки обновляет объект состояния GameState и перерисовывает игровое поле для новой игры
* `onSaveGameClick()` - по нажатию кнопки сохраняет текущее состояние игры
* `onLoadGameClick()` - по нажатию кнопки загружает последнее сохранённое состояние
* `onCellClick(index)` - нажатие на клетку и соответствующие действия: выделение юнита, перемещение, атака, снятие выделения.
* `onCellEnter(index)` - перемещение в клетку и соответствующая информация: подсвечивания и изменения курсора.
* `onCellLeave(index)` - выход из клетки
* `aiTurn()` - ход компьютера
* `stateCheck()` - проверка состояния - если в какой-либо из комманд ноль игроков, то или игра завершается, или происходит переход на следующий уровень
* `redrawAll()` - перерисовывает поле и юниты

Класс в наибольшей степени взаимодействует с `GameState`.

### Team
* `addCharacter(type, level, health)` - позволяет "изготовить" персонажа на основе полных данных - используется для восстановления загруженной игры. 

### class GameState

Хранит состояние и выдаёт данные на его основе в зависимости от команды и положения юнита, кроме того обновляет состояние при переходе через уровень, загрузке игры или начале новой игры.

### utils.js
* `makeTitle(obj)` - формирует строку с данными о персонаже для всплывающей справки
* `linearToXY(position)` - переводит линейную координату в пару XY
* ` XYtoLinear(pair)` - делает обратное преобразование
* `getRandomFrom(array)` - возвращает случайный элемент из массива

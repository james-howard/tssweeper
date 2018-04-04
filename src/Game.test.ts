import * as Game from './Game';

// *** Adjacency Count Tests ***

it('calculates adjacency 3x3 upper left', () => {
    let b = Game.Board.fromPattern([
        "*  ",
        "   ",
        "   "
    ]);
    expect(b.cellAt(0, 0)).toBe(Game.Cell.MINED);
    expect(b.adjacentMineCount(1, 0)).toBe(1);
    expect(b.adjacentMineCount(2, 0)).toBe(0);
    expect(b.adjacentMineCount(0, 1)).toBe(1);
    expect(b.adjacentMineCount(1, 1)).toBe(1);
    expect(b.adjacentMineCount(2, 1)).toBe(0);
    expect(b.adjacentMineCount(0, 2)).toBe(0);
    expect(b.adjacentMineCount(1, 2)).toBe(0);
    expect(b.adjacentMineCount(2, 2)).toBe(0);
});

it('calculates adjacency 3x3 center', () => {
    let b = Game.Board.fromPattern([
        "   ",
        " * ",
        "   "
    ]);
    expect(b.cellAt(1, 1)).toBe(Game.Cell.MINED);
    for (let y = 0; y <= 2; y++) {
        for (let x = 0; x <= 2; x++) {
            if (x === 1 && y === 1) {
                continue;
            }
            expect(b.adjacentMineCount(x, y)).toBe(1);
        }
    }
});

it('calculates 3x3 adjacency 8 mines', () => {
    let b = Game.Board.fromPattern([
        "***",
        "* *",
        "***"
    ]);
    expect(b.adjacentMineCount(1, 1)).toBe(8);
});

// *** GameState tests ***

it('wins 3x3 game via flag', () => {
    let b = Game.Board.fromPattern([
        "   ",
        " * ",
        "   "
    ]);
    expect(b.state).toBe(Game.GameState.IN_PROGRESS);
    let c = b.flag(1, 1);
    expect((c & Game.Cell.FLAGGED) !== 0).toBe(true);
    expect(b.state).toBe(Game.GameState.WON);
});

it('wins 3x3 game via reveal', () => {
    let b = Game.Board.fromPattern([
        "   ",
        " * ",
        "   "
    ]);
    expect(b.state).toBe(Game.GameState.IN_PROGRESS);
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            if (x === 1 && y === 1) { continue; }
            expect(b.state).toBe(Game.GameState.IN_PROGRESS);
            let c = b.reveal(x, y);
            expect((c & Game.Cell.REVEALED) !== 0).toBe(true);
        }
    }
    expect(b.state).toBe(Game.GameState.WON);
});

it('loses 3x3 game via mine reveal', () => {
    let b = Game.Board.fromPattern([
        "   ",
        " * ",
        "   "
    ]);
    expect(b.state).toBe(Game.GameState.IN_PROGRESS);
    b.reveal(1, 1);
    expect(b.state).toBe(Game.GameState.LOST);
});

// *** Reveal Tests ***

it('reveals empty cells recursively', () => {
    let b = Game.Board.fromPattern([
      // 01234
        "     ", // 0
        "     ", // 1
        "  *  ", // 2
        "     ", // 3
        "     "  // 4
    ]);
    b.reveal(0, 0);
    /* expect to reveal everything except for the mine and have a board like this:
        00000
        01110
        01*10
        01110
        00000
    */
    expect(b.state).toBe(Game.GameState.WON);
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            let c = b.cellAt(x, y);
            if (x === 2 && y === 2) {
                expect((c & Game.Cell.MINED) !== 0).toBe(true);
                expect((c & Game.Cell.REVEALED) === 0).toBe(true);
            } else {
                expect((c & Game.Cell.REVEALED) !== 0).toBe(true);
            }
        }
    }
});
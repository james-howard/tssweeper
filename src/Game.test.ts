import * as Game from './Game'

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
    for (var y = 0; y <= 2; y++) {
        for (var x = 0; x <= 2; x++) {
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

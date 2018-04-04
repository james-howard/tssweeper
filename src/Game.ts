/* Represents non-UI Game state */

enum Cell {
    // Adjacency Counts
    EMPTY = 1 << 0,
    ONE = 1 << 1,
    TWO = 1 << 2,
    THREE = 1 << 3,
    FOUR = 1 << 4,
    FIVE = 1 << 5,
    SIX = 1 << 6,
    SEVEN = 1 << 7,
    EIGHT = 1 << 8,
    // Cell contents
    MINED = 1 << 9,
    FLAGGED = 1 << 10,
    REVEALED = 1 << 11
}

enum GameState {
    IN_PROGRESS,
    LOST, // a mine exploded
    WON,  // all mines have been flagged and/or only mines remain unrevealed
}

class Board {
    cells: Cell[];
    state: GameState = GameState.IN_PROGRESS;
    flagCount: number;

    static fromPattern(rows: string[]) {
        let width = rows[0].length;
        let height = rows.length;
        let mineCount = rows.join('').split('').reduce((sum, ch) => sum + (ch === '*' ? 1 : 0), 0);

        let board = new Board(width, height, mineCount);

        rows.forEach((row, y) => {
            for (let x = 0; x < width; x++) {
                let ch = row[x];
                board.cells[board.cellIndex(x,y)] = ch === '*' ? Cell.MINED : Cell.EMPTY;
            }
        });

        board.calculateAdjacency();

        return board;
    }
    
    constructor(public width: number, public height: number, public mineCount: number) {
        const length = width * height;
        let mines = this.mineCount = Math.min(length, mineCount);
        // initialize cells as either empty or mined according to the number of mines requested
        let cells = this.cells = new Array<Cell>(width*height);
        cells.fill(Cell.MINED, 0, mines);
        cells.fill(Cell.EMPTY, mines, cells.length);
        // shuffle cells so that the mines are evenly distributed
        for (let i = cells.length-1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i+1)); // j in range [0, i]
            // swap cells[i], cells[j]
            let tmp = cells[i];
            cells[i] = cells[j];
            cells[j] = tmp;
        }
        this.calculateAdjacency();
    }

    private calculateAdjacency() {
        let countAdjacents = (x:number, y:number): Cell => {
            let i = x + y * this.width;
            if (this.cells[i] & Cell.MINED) {
                return this.cells[i];
            }
            let count = this.adjacents(x, y).reduce((sum, [x1, y1]) => {
                let j = this.cellIndex(x1, y1);
                if (this.cells[j] & Cell.MINED) {
                    return sum + 1;
                } else {
                    return sum;
                }
            }, 0);
            return 1 << count;
        };
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.cells[this.cellIndex(x,y)] = countAdjacents(x, y);
            }
        }
    }

    private cellIndex(x:number, y:number): number {
        return x + y * this.width;
    }

    cellAt(x:number, y:number): Cell {
        return this.cells[this.cellIndex(x,y)];
    }

    // return valid coordinates of adjacent cells, taking into account the board boundaries.
    adjacents(x:number, y:number): [number, number][] {
        let result = new Array<[number, number]>();
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) {
                    continue; // skip center
                }
                let x1 = x + dx;
                let y1 = y + dy;
                if (x1 < 0 || x1 >= this.width || y1 < 0 || y1 >= this.height) {
                    continue; // skip out of bounds
                }
                result.push([x1, y1]);
            }
        }
        return result;
    }

    adjacentMineCount(x:number, y:number): number {
        // returns the number of adjacent mines to the cell at x, y, or 9 if cell is a mine
        let c = this.cellAt(x, y);
        // log2 implementation specialized to our usage ...
        // it's equivalent to Math.log2(c & 0xF)
        for (var p = 0; p <= 9; p++) {
            if (c & (1 << p)) {
                return p;
            }
        }
        throw new Error("Corrupt board state");
    }

    private _reveal(x:number, y:number) {
        let i = this.cellIndex(x, y);
        let c = this.cells[i];
        if ((c & Cell.FLAGGED) === 0  /* can't reveal something while it is flagged */ && (c & Cell.REVEALED) === 0) {
            c |= Cell.REVEALED;

            this.cells[i] = c;

            if (c & Cell.EMPTY) {
                this.adjacents(x, y).forEach(([x1, y1]) => {
                    let adj = this.cellAt(x1, y1);
                    if ((adj & Cell.MINED) === 0) {
                        this._reveal(x1, y1);
                    }
                });
            }
        }

        return c;
    }

    reveal(x:number, y:number) {
        let c = this._reveal(x, y);
        this.updateState();
        return c;
    }

    flag(x:number, y:number) {
        let i = this.cellIndex(x, y);
        let c = this.cells[i];
        if (c & Cell.REVEALED) {
            return c; // you can't flag something that is revealed
        }
        c |= Cell.FLAGGED;
        this.cells[i] = c;
        this.updateState();
        return c;
    }

    private updateState() {
        let revealed = 0;
        let flaggedCorrectly = 0;
        let flaggedIncorrectly = 0;
        let triggered = 0;
        let mines = 0;
        for (let i = 0; i < this.cells.length; i++) {
            let c = this.cells[i];
            if (c & Cell.MINED) {
                mines++;
            }
            if (c & Cell.REVEALED) {
                revealed++;
                if (c & Cell.MINED) {
                    triggered++;
                }
            } else if (c & Cell.FLAGGED) {
                if (c & Cell.MINED) {
                    flaggedCorrectly++;
                } else {
                    flaggedIncorrectly++;
                }
            }
        }
        // one way to lose:
        // 1. reveal a mine
        // two ways to win:
        // 1. Flag all mines
        // 2. Reveal all cells which are not mines
        if (triggered > 0) {
            this.state = GameState.LOST;
        } else if (mines === flaggedCorrectly) {
            this.state = GameState.WON; // win condition 1
        } else if (flaggedIncorrectly === 0 && this.cells.length - revealed === mines) {
            this.state = GameState.WON; // win condition 2
        } else {
            this.state = GameState.IN_PROGRESS;
        }
    }
}

export { Board, GameState, Cell };

import * as React from 'react';
import {createElement as h } from 'react';

import * as Game from './Game';

import './UI.css';

const CellSize = 24;

interface CellUIProps {
    cell: Game.Cell;
    onReveal: () => void;
    onFlag: () => void;
}

class CellUI extends React.PureComponent<CellUIProps> {
    mouseClicked(evt:MouseEvent) {
        let cell = this.props.cell;
        if ((cell & Game.Cell.REVEALED) === 0 && (cell & Game.Cell.FLAGGED) === 0) {
            this.props.onReveal();
        }
    }

    mouseRightClicked(evt:MouseEvent) {
        let cell = this.props.cell;
        if ((cell & Game.Cell.REVEALED) === 0) {
            this.props.onFlag();
        }
        evt.preventDefault();
    }

    render() {
        // we're in one of 3 states:
        // Revealed, showing contents
        // Unrevealed, unpressed
        // Unrevealed, pressed
        
        let revealed = (this.props.cell & Game.Cell.REVEALED) !== 0;
        let flagged = (this.props.cell & Game.Cell.FLAGGED) !== 0;

        let contents:string = '';
        if (flagged) {
            contents = '⚑';
        } else if (revealed) {
            let count = Game.AdjacentMineCount(this.props.cell);
            switch (count) {
                case 0: 
                    contents = '';
                    break;
                case 9:
                    contents = '☀︎';
                    break;
                default:
                    contents = `${count}`;
            }
        }

        let className = 'Cell';
        if (revealed) {
            className += ' CellRevealed';
        } else {
            className += ' CellUnrevealed';
        }
        
        return h('button', { 
            className,
            onClick: this.mouseClicked.bind(this),
            onContextMenu: this.mouseRightClicked.bind(this),
        }, contents);
    }
}

interface GameUIState {
     board: Game.Board;
}

class GameUI extends React.Component<{}, GameUIState> {
    constructor(props:{}) {
        super(props);
        this.state = {
            board: new Game.Board(5, 6, 5),
        };
    }

    render() {
        let cellElements:React.ComponentElement<CellUIProps, CellUI>[] = [];
        let board = this.state.board;
        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                let onFlag = () => {
                    this.state.board.toggleFlag(x, y);
                    this.forceUpdate();
                };
                let onReveal = () => {
                    this.state.board.reveal(x, y);
                    this.forceUpdate();
                };
                let cell = h(CellUI, { 
                    cell:board.cellAt(x, y),
                    onFlag,
                    onReveal,
                    key: `${x}.${y}`,
                });
                cellElements.push(cell);
            }
        }

        let containerStyle:React.CSSProperties = {
            display: 'grid',
            gridTemplateColumns: `repeat(${board.width}, ${CellSize}px)`,
            gridTemplateRows: `repeat(${board.height}, ${CellSize}px)`,
            cursor: 'default'
        };
        let container = h('div', {style: containerStyle, className:'Grid'}, cellElements);

        return container;
    }
}

export default GameUI;

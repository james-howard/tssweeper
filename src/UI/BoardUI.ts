import * as React from 'react';
import {createElement as h } from 'react';

import * as Game from '../Game';

import {CellUI, CellUIProps} from './CellUI';

type CellUIAction = (x:number, y:number) => void;
interface BoardUIProps {
    board: Game.Board;
    onToggleFlag: CellUIAction;
    onReveal: CellUIAction;
}

class BoardUI extends React.PureComponent<BoardUIProps> {
    static pixelWidthFromBoardWidth(boardWidth:number) {
        return CellUI.CellSize * boardWidth;
    }

    render() {
        let cellElements:React.ComponentElement<CellUIProps, CellUI>[] = [];
        let board = this.props.board;
        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                let onFlag = () => {
                    this.props.onToggleFlag(x, y);
                };
                let onReveal = () => {
                    this.props.onReveal(x, y);
                };
                let cell = h(CellUI, { 
                    cell:board.cellAt(x, y),
                    disabled: board.state !== Game.GameState.IN_PROGRESS,
                    onFlag,
                    onReveal,
                    key: `${x}.${y}`,
                });
                cellElements.push(cell);
            }
        }

        let containerStyle:React.CSSProperties = {
            display: 'grid',
            gridTemplateColumns: `repeat(${board.width}, ${CellUI.CellSize}px)`,
            gridTemplateRows: `repeat(${board.height}, ${CellUI.CellSize}px)`,
            cursor: 'default'
        };
        let container = h('div', {style: containerStyle, className:'Grid'}, cellElements);

        return container;
    }
}

export { BoardUI, BoardUIProps };

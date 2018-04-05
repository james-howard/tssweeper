import * as React from 'react';
import {createElement as h } from 'react';

import * as Game from '../Game';

import './CellUI.css';

const CellSize = 24;

interface CellUIProps {
    cell: Game.Cell;
    disabled: boolean;
    onReveal: () => void;
    onFlag: () => void;
}

class CellUI extends React.PureComponent<CellUIProps> {
    static readonly CellSize = CellSize;

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
            disabled: this.props.disabled,
            onClick: this.mouseClicked.bind(this),
            onContextMenu: this.mouseRightClicked.bind(this),
        }, contents);
    }
}

export { CellUI, CellUIProps };

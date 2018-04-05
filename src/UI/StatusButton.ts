import * as React from 'react';
import {createElement as h } from 'react';

import { GameState } from '../Game';

import './StatusButton.css';

interface StatusButtonProps {
    gameState: GameState;
    mouseDown: boolean;
    onReinitialize: () => void;
}

class StatusButton extends React.PureComponent<StatusButtonProps> {
    render() {
        let content:string;
        switch (this.props.gameState) {
            case GameState.IN_PROGRESS:
                content = this.props.mouseDown ? '🤔' : '🙂';
                break;
            case GameState.LOST:
                content = '😵';
                break;
            case GameState.WON:
                content = '😎';
                break;
            default:
                content = '😶';
                break;
        }
        return h('button', {onClick:this.props.onReinitialize, className:'StatusButton'}, content);
    }
}

export { StatusButton, StatusButtonProps };

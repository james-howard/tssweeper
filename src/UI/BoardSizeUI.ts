import * as React from 'react';
import {createElement as h } from 'react';

interface BoardSizeUIProps {
    width:number;
    height:number;
    onReinitialize:(width:number, height:number, mineCount:number) => void;
}

class BoardSizeUI extends React.PureComponent<BoardSizeUIProps> {
    playBeginner() {
        this.props.onReinitialize(6, 6, 5);
    }

    playIntermediate() {
        this.props.onReinitialize(16, 16, 40);
    }

    playExpert() {
        this.props.onReinitialize(40, 16, 99);
    }

    render() {
        let isBeginner = this.props.width === 6;
        let isIntermediate = this.props.width === 16;
        let isExpert = this.props.width === 40;

        let beginner = h('input', {
            type:'radio', 
            checked:isBeginner, 
            onChange:this.playBeginner.bind(this)
        });
        let intermediate = h('input', {
            type:'radio', 
            checked:isIntermediate, 
            onChange:this.playIntermediate.bind(this)
        });
        let expert = h('input', {
            type:'radio', 
            checked:isExpert, 
            onChange:this.playExpert.bind(this)
        });

        let labelStyle:React.CSSProperties = {
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont',
            padding: '2px',
            fontSize: '10px'
        };
        
        let containerStyle:React.CSSProperties = {
            display: 'flex',
            backgroundColor: '#BDBDBD',
        };
        if (isBeginner) {
            containerStyle.flexDirection = 'column';
        }

        return h('div', {style: containerStyle}, 
            h('label', {key:'beginner', style: labelStyle}, beginner, "Beginner"),
            h('label', {key:'intermediate', style: labelStyle}, intermediate, "Intermediate"),
            h('label', {key:'expert', style: labelStyle}, expert, "Expert")
        );
    }
}

export { BoardSizeUI, BoardSizeUIProps };

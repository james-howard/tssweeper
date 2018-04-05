import * as React from 'react';
import {createElement as h } from 'react';

interface StatusCounterProps {
    value: number;
}

class StatusCounter extends React.PureComponent<StatusCounterProps> {
    render() {
        let style:React.CSSProperties = {
            backgroundColor: 'black',
            color: 'red',
            fontFamily: 'monospace',
            fontSize: '18px',
            padding: '2px'
        };
        // lame version of printf("%03d", value)
        let sign = this.props.value < 0;
        let v = Math.abs(this.props.value);
        let s = '' + v;
        if (sign) {
            if (v < 10) { 
                s = "-0" + v; 
            } else if (v < 100) { 
                s = "-" + v; 
            } else {
                s = "-99";
            }
        } else {
            if (v < 10) { 
                s = "00" + v; 
            } else if (v < 100) { 
                s = "0" + v; 
            }
        }
        
        return h('span', {style}, s);
    }
}

export { StatusCounter, StatusCounterProps };

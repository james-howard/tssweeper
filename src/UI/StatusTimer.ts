import * as React from 'react';
import {createElement as h } from 'react';

import { StatusCounter } from './StatusCounter';

interface StatusTimerProps {
    startTimestamp: number;
}
class StatusTimer extends React.PureComponent<StatusTimerProps> {
    private timer:number;

    render() {
        let value:number = 0;
        if (this.props.startTimestamp) {
            value = Math.round((performance.now() - this.props.startTimestamp)/1000.0) % 1000;
        }
        return h(StatusCounter, {value});
    }

    tick() {
        this.forceUpdate();
    }

    componentDidMount() {
        this.timer = window.setInterval(this.tick.bind(this), 1000);
    }

    componentWillUnmount() {
        if (this.timer) {
            window.clearInterval(this.timer);
            delete this.timer;
        }
    }
}

export { StatusTimer, StatusTimerProps };

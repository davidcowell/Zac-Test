import React from 'react';
import CrosshairImg from './Crosshair_6.png';

export default class Crosshair extends React.Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        return (
            <div style={{top: this.props.mapHeight / 2 + 'vh'}} id='reticule'>
                <img src={CrosshairImg} />
            </div>
        );
    }
}
import React from 'react';
import './App.css';

export default class LocationDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    getLatText() {
        var latRounded = this.props.location.lat.toFixed(5);
        var latDisplay = '';
        if (latRounded > 0) {
            latDisplay = latRounded.toString() + 'N';
        }
        else {
            latRounded = -latRounded;
            latDisplay = latRounded.toString() + 'S';
        }
        return latDisplay;
    }

    getLonText() {
        var lonRounded = this.props.location.lng.toFixed(5);
        var lonDisplay = '';
        if (lonRounded > 0) {
            lonDisplay = lonRounded.toString() + 'E';
        }
        else {
            lonRounded = -lonRounded;
            lonDisplay = lonRounded.toString() + 'W';
        }
        return lonDisplay;
    }

    getWGS84Text() {
        return this.getLatText() + ' ' + this.getLonText();
    }
  
    render() {
        return (
            /*
            <div style={{position: 'relative'}}>
                <div className="location" style={{float:'left'}}>
                    WGS84: {this.getWGS84Text()}
                </div>
            </div>
            */

            <div className='centredBlackFlexbox' style={{height: '100%', color: 'white'}}>
                <div style={{fontFamily: 'consolas', fontSize: '30px', color: 'white'}}>{this.getWGS84Text()}</div>
            </div>

            /*
            <div style={{position: 'relative'}}>
                <div className="location" style={{width: '150px', float:'left'}}>
                    Lat: {this.getLatDisplay()}
                </div>
                <div className="location" style={{width: '20%', float: 'left'}}>
                    Lon: {this.getLonDisplay()}
                </div>
            </div>
            */
        );
    }
}
import React from 'react';
import { forward } from 'mgrs';
import './App.css';

export default class MGRSDisplay extends React.Component {
    
    constructor(props) {
        super(props);

        this.setVars();
        /*
        this.mgrs = forward([this.props.location.lng, this.props.location.lat], 10); // Call mgrs library to convert Lat/Lon to MGRS
        this.p1 = this.mgrs.length === 14 ? 2 : 3;  // Start position of 2nd Element - depends on 1st Element size (can be 1 or 2 chars)
    */
    }

    setVars()
    {
        this.mgrs = forward([this.props.location.lng, this.props.location.lat], 10); // Call mgrs library to convert Lat/Lon to MGRS
        this.p1 = this.mgrs.length === 14 ? 2 : 3;  // Start position of 2nd Element - depends on 1st Element size (can be 1 or 2 chars)
    }

    componentDidUpdate(prevProps)
    {
        if (prevProps.location !== this.props.location) {
            this.setVars();
        }
    }

    getP1Text() { return this.mgrs.substring(0, this.p1); }
    getP2Text() { return this.mgrs.substring(this.p1, this.p1 + 2); }
    getP3Text() { return this.mgrs.substring(this.p1 +2, this.p1 + 7); }
    getP4Text() { return this.mgrs.substring(this.p1 +7); }

    getFullMGRSText() {
        return this.getP1Text() + ' ' + this.getP2Text() + ' ' + this.getP3Text() + ' ' + this.getP4Text();
    }

    /*
    getMGRSText(mgrs) {
        
        //alert('MGRSDisplay - ' + mgrs.length);
        var p1 = mgrs.length === 14 ? 2 : 3;
        //alert('MGRSDisplay length=' + part1Length);
        
        const mgrsText = mgrs.substring(0, p1) + ' ' 
            + mgrs.substring(p1, p1 + 2) + ' '
            + mgrs.substring(p1 +2, p1 + 7) + ' ' 
            + mgrs.substring(p1 +7);
        return mgrsText;
    }
  */

    render() {
        //const mgrs = forward([this.props.location.lng, this.props.location.lat], 10);
        if (this.props.displayAsBlock)
        {
            return (
                <div className='centredBlackFlexbox' style={{height: '100%', color: 'yellow'}}>
                    <div className='mgrsTextBig'>{this.getP1Text() + ' ' + this.getP2Text()}</div>
                    <div className='mgrsTextHuge'>{this.getP3Text()}</div>
                    <div className='mgrsTextHuge'>{this.getP4Text()}</div>
                </div>
            );
        }
        else {
            return (
                <div className="location" style={{float: 'right', color: 'yellow'}}>
                    MGRS: {this.getFullMGRSText()}
                </div>
            );
        }
    }
}
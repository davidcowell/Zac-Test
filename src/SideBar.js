import React from 'react';
import MGRSDisplay from './MGRSDisplay';
import LocationDisplay from './LocationDisplay';
import {MapCentreLocationContext} from './Contexts';
import './App.css';

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const unitsText = this.props.units === 'metric' ? 'm' : 'ft'
        if (this.props.show){
            return (
                <div style={{width: this.props.sideBarWidthPercent + '%', height: this.props.mapHeightVH + 'vh'}} id='sidebar'>   
                    {/* TABS*/}
                    <div className='sidebar_block' style={{height: '10%'}} >     
                        <div style={{width: '25%', height: '100%', float: 'left'}} id='sidebartab'>1</div>
                        <div style={{width: '25%', height: '100%', float: 'left'}} id='sidebartab'>2</div>
                        <div style={{width: '25%', height: '100%', float: 'left'}} id='sidebartab'>3</div>
                        <div style={{width: '25%', height: '100%', float: 'left'}} id='sidebartab'>4</div>
                    </div>

                    {/* POINT SELECTION*/}
                    <div className='sidebar_block' style={{height: '10%'}} id='location_title' >   
                        <p>Your Current Location</p>
                    </div>

                    {/* PRIMARY LOCATION INFO*/}
                    <div className='sidebar_block' style={{height: '50%'}}>   
                        <MapCentreLocationContext.Consumer>
                            {location => (
                                <MGRSDisplay
                                    location={location}
                                    displayAsBlock={true}
                                /> 
                            )}
                        </MapCentreLocationContext.Consumer>
                    </div>

                    {/* ACCURACY & ALTITUDE INFO*/}
                    <div className='sidebar_block' style={{height: '20%'}}>   
                        <div style={{width: '50%', height: '100%', float: 'left'}} id='sidebar_accblock'>
                            {this.props.gpsAccuracy + unitsText}
                        </div>
                        <div style={{width: '50%', height: '100%', float: 'left'}} id='sidebar_altblock'>
                            {this.props.altitude + unitsText}
                        </div>
                    </div>

                    {/* SECONDARY LOCATION INFO*/}
                    <div className='sidebar_block' style={{height: '10%'}}>   
                        <MapCentreLocationContext.Consumer>
                            {location => (
                                <LocationDisplay
                                    location={location}
                                /> 
                            )}
                        </MapCentreLocationContext.Consumer>
                    </div>

                </div>
            )
        }
        return null;
    }
}

export class SideBarToggleButton extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        this.props.onClick({});
    }

    render() {
        const text = this.props.show ? '<<' : '>>';
        const topPos = (this.props.mapHeight / 2) + 'vh';
        const leftPos = this.props.show ? this.props.sideBarWidth + '%' : '0%';
        return (
            <div id='sidebarbutton' onClick={this.handleClick} style={{top: topPos, left:leftPos}}>
                {text}
            </div>
        );
    }
}


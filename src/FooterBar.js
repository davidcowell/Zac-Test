import React from 'react';
import MgrsInput from './MgrsInput';
import LocationDisplay from './LocationDisplay';
import MGRSDisplay from './MGRSDisplay';
import {MapCentreLocationContext} from './Contexts';
import './App.css';

export default class FooterBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.show) {
            return (
                <div style={{height: this.props.heightVH + 'vh', width: '100%'}} id='footerbar'>
                    <MapCentreLocationContext.Consumer>
                        {location => (
                            <LocationDisplay
                                location={location}
                            /> 
                        )}
                    </MapCentreLocationContext.Consumer>
                    <MapCentreLocationContext.Consumer>
                        {location => (
                            <MGRSDisplay
                                location={location}
                            /> 
                        )}
                    </MapCentreLocationContext.Consumer>
                </div>
            )
        }
        return null;
    }
}

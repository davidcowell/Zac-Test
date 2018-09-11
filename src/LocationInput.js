import React from 'react';
import './App.css';

export default class LocationInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputLat: this.props.mapCentreLocation.lat,
            inputLon: this.props.mapCentreLocation.lng,
            waitingInput: true
        };
            
        this.handleLatChange = this.handleLatChange.bind(this);
        this.handleLonChange = this.handleLonChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log("LocationInput.componentDidUpdate()");
        if (prevProps.mapCentreLocation !== this.props.mapCentreLocation){
        //if ((prevProps.lat !== this.props.lat) || (prevProps.lon !== this.props.lon)){
            // Disable event handler to prevent infinite looping
            this.setState({waitingInput: false});

            // Reset input control text to new position values
            this.setState({inputLat: this.props.mapCentreLocation.lat});
            this.setState({inputLon: this.props.mapCentreLocation.lng});

            // Re-enable event handler for user input
            this.setState({waitingInput: true});
        }
        
    }

    handleLatChange(event) {
        //alert('Position changed: waiting input=' + this.state.waitingInput + ', lat=' + this.state.inputLat + ', lon=' + this.state.inputLon);
        if (this.state.waitingInput){
            this.setState({inputLat: parseFloat(event.target.value)});
        }
    }

    handleLonChange(event) {
        if (this.state.waitingInput){
            this.setState({inputLon: parseFloat(event.target.value)});
        }
    }

    handleSubmit(event) {
        //alert('A new location was submitted - lat: ' + this.state.inputLat + ', lon: ' + this.state.inputLon);
        event.preventDefault();
        this.props.onLocationChange({lat: this.state.inputLat, lon: this.state.inputLon});
    }
  
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
            <label className="locationinput">
                Lat:
                <input type="text" value={this.state.inputLat} onChange={this.handleLatChange} />
                Lon:
                <input type="text" value={this.state.inputLon} onChange={this.handleLonChange} />
            </label>
            <input type="submit" value="Submit" />
            </form>
        );
    }
}
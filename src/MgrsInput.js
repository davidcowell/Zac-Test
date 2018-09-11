import React from 'react';
import './App.css';
import { forward } from 'mgrs';

export default class MgrsInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputMgrs: this.props.mgrs,
            waitingInput: true
        };
            
        this.handlePositionChange = this.handlePositionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log("MgrsInput.componentDidUpdate(mgrs=" + this.props.mgrs + ")");
        if (prevProps.mgrs !== this.props.mgrs){
            // Disable event handler to prevent infinite looping
            this.setState({waitingInput: false});

            // Reset input control text to new position values
            this.setState({inputMgrs: this.props.mgrs});

            // Re-enable event handler for user input
            this.setState({waitingInput: true});
        }
        
    }

    handlePositionChange(event) {
        //alert('Position changed: waiting input=' + this.state.waitingInput + ', lat=' + this.state.inputLat + ', lon=' + this.state.inputLon);
        if (this.state.waitingInput){
            this.setState({inputMgrs: event.target.value});
        }
    }

    handleSubmit(event) {
        //alert('A new location was submitted - lat: ' + this.state.inputLat + ', lon: ' + this.state.inputLon);
        event.preventDefault();
        this.props.onLocationChange(this.state.inputMgrs);
    }
  
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
            <label className="App-intro">
                MGRS:
                <input type="text" value={this.state.inputMgrs} onChange={this.handlePositionChange} />
            </label>
            <input type="submit" value="Submit" />
            </form>
        );
    }
}
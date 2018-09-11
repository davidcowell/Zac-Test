import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { camelize } from  './Utils';

const evtNames = ['click', 'mouseover'];

export default class Marker extends React.Component {
    componentDidUpdate(prevProps) {
        if ((this.props.map !== prevProps.map) || (this.props.position !== prevProps.position) || (this.props.google !== prevProps.google)) {
            this.renderMarker();
        }
    }

    componentWillUnmount() {
        if (this.marker) {
            this.marker.setMap(null);
        }
    }

    renderMarker() {
        let {
            map, google, position, mapCenter
        } = this.props;
        
        if (google) {       
            let pos = position || mapCenter;
            position = new google.maps.LatLng(pos.lat, pos.lng);
            //console.log("Marker.RenderMarker(pos.lat=" + position.lat + ")");
            //console.log("Marker.RenderMarker(mapCenter.lat=" + mapCenter.lat + ")");
            const pref = {
                map: map,
                position: position,
                label: this.props.label,
                icon: this.props.icon
            };
            this.marker = new google.maps.Marker(pref);

            // Add Google Map event listeners
            evtNames.forEach(e => {
                this.marker.addListener(e, this.handleEvent(e));
            })
        }
    }

    handleEvent(evtName) {
        //console.log("Marker: Attach event handler(" + evtName + ")");
        const handlerName = `on${camelize(evtName)}`
        return (e) => {
            if (this.props[handlerName]) {
                this.props[handlerName](this.props, this.marker, e);
            }
        }
    }

    render() {
      return null;
    }
}
  
Marker.propTypes = {
    position: PropTypes.object,
    map: PropTypes.object
}

// Add event properties
evtNames.forEach(e => Marker.propTypes[camelize(e)] = PropTypes.func)

Marker.defaultProps = {
    //Event Handlers
    onClick: function() {console.log("Marker: onClick event fired")},
    onMouseover: function() {console.log("Marker: onMouseover event fired")}
}
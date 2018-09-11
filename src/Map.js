import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { camelize } from  './Utils';

//const evtNames = ['ready', 'click', 'dragend'];
const evtNames = ['ready'];

export default class Map extends React.Component {
    constructor(props) {
        super(props);
    }   

    componentDidUpdate(prevProps, prevState) {
        //console.log("Map.componentDidUpdate()");
        if (prevProps.google !== this.props.google) {
            //console.log("Map.componentDidUpdate(): Google API loaded");
            this.loadMap();
        }

        if (prevProps.mapCentreLocation !== this.props.mapCentreLocation){
            //console.log("Map.componentDidUpdate(): Input changed - lat=" + this.props.mapCentreLocation.lat + ": lng=" + this.props.mapCentreLocation.lng + ")");
            this.recenterMap();         
        }
    }
    
    loadMap() {
        if (this.props && this.props.google) { // Google API is available
            console.log("Map.loadMap(Google API loaded)");
            
            // Load Map
            const node = ReactDOM.findDOMNode(this.refs.map);
            const mapConfig = Object.assign({}, {
                center: this.props.mapCentreLocation,
                zoom: this.props.zoom
            })
            this.map = new this.props.google.maps.Map(node, mapConfig);

            // Add Google Map event listeners using generic event handler builder function
            evtNames.forEach(e => {
                this.map.addListener(e, this.handleEvent(e));
            });

            // Add specific event listeners
            this.addClickEventListener();
            this.addCenterChangedEventListener(); 

            // Trigger Google Map ready event when map has loaded - ** NOT CURRENTLY USED **
            this.props.google.maps.event.trigger(this.map, 'ready');
        }
        else {
            console.log("Map.loadMap(Google API not loaded yet)");
        }
    }

    
    
    componentDidMount() {
        console.log("Map.componentDidMount()");
        this.loadMap();
    } 

    addClickEventListener() {
        /*
        this.map.addListener('click', (evt) => {
            // TEST CODE for LINE DRAWING
            var flightPlanCoordinates = [
                {lat: 37.772, lng: -122.214},
                {lat: 21.291, lng: -157.821},
                {lat: -18.142, lng: 178.431},
                {lat: -27.467, lng: 153.027}
            ];
            var flightPath = new this.props.google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
            });
        
            flightPath.setMap(this.map);

            console.log("Map click event fired");
            this.props.onClick(evt, this.map);
        })
        */

        this.props.google.maps.event.addListener(this.map, 'click', (event) => {
            //console.log("Lat=" + event.latLng.lat());
            this.props.onClick(event, this.map);
        })
    }

    addCenterChangedEventListener() {
        let centerChangedTimeout;
        this.map.addListener('center_changed', (evt) => {
            if (centerChangedTimeout) {
                clearTimeout(centerChangedTimeout);
                centerChangedTimeout = null;
            }
            centerChangedTimeout = setTimeout(() => {
                this.props.onMoveMap(this.map.getCenter());
            }, 0); // Set 0 here to get instant update; or > 0 for update after moving stops
        })
    }

    // Builds named event handler
    handleEvent(evtName) {
        let timeout;
        const handlerName = `on${camelize(evtName)}`;
   
        return (e) => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            timeout = setTimeout(() => {
                if (this.props[handlerName]) {
                    this.props[handlerName](this.props, this.map, e);
                }
            }, 0);
        }
    }

    recenterMap() {
        //console.log("Map.recenterMap()");
        if (this.map) {
            this.map.panTo(this.props.mapCentreLocation);
        }
    }

    renderChildren() {
        const {children} = this.props;
        //console.log("Map.renderChildren(children=" + children + ":google=" + this.props.google + ")");
        if (!children) return;
        console.log("Map.renderChildren(count=" + children.length + ")"); 
        if (children[2]) {
            console.log("Markers count=" + children[2].length);
            //console.log("markers array children=" + children[2].props.length); THIS IS RUBBISH
        }
        //console.log("element 1 is array:" + Array.isArray(children[0])); 
        //console.log("element 2 is array:" + Array.isArray(children[1])); 
        //console.log("element 3 is array:" + Array.isArray(children[2])); 
        //console.log("element 4 is array:" + Array.isArray(children[3])); 

        //console.log("Map.renderChildren(prop 1=" + children[0].props.name + ")"); 
        //console.log("Map.renderChildren(prop 2=" + children[1].props.name + ")"); 
        //console.log("Map.renderChildren(prop 3=" + children[2].name + ")"); 
        //console.log("Map.renderChildren(prop 4=" + children[3].name + ")"); 
        
        // This seems to do exactly the same as the code below
        return React.Children.map(children, c => {
            if (c) {
                if (Array.isArray(c))
                {
                    return React.Children.map(c, kid => {
                        return React.cloneElement(kid, {
                            map: this.map,
                            google: this.props.google,
                            mapCenter: this.props.mapCentreLocation
                        });
                    })
                }
                else {
                    return React.cloneElement(c, {
                        map: this.map,
                        google: this.props.google,
                        mapCenter: this.props.mapCentreLocation
                    });
                }
            }
        })
        
        /*       
        return React.Children.map(children, c => {
            if (c) {
                return React.cloneElement(c, {
                    map: this.map,
                    google: this.props.google,
                    mapCenter: this.props.mapCentreLocation
                });
            }
        })
        */
    }

    render() {
        console.log("Map.js render");
        return (
            <div ref='map' style={{ height: '100%', width: '100%' }}>
                Loading map...
                {this.renderChildren()}
            </div>
        )
    }
}

Map.propTypes = {
    //Properties
    google: PropTypes.object,
    zoom: PropTypes.number,
    mapCentreLocation: PropTypes.object,
   
    onMapMove: PropTypes.func,
    onToggleSideBar: PropTypes.func
}

// Add event properties
evtNames.forEach(e => Map.propTypes[camelize(e)] = PropTypes.func)

Map.defaultProps = {
    //Default Properties
    zoom: 13,
    
    //Event Handlers
    //onMove: function() {console.log("onMove")}, 
    onDragend: function() {console.log("Map.onDragend()")}, 
    onClick: function() {console.log("Map.onClick()")}, 
    onReady: function() {console.log("Map: onReady event fired")}
}

/* OBSOLETE
// Add control to show/hide sidebar
            let controlDiv = document.createElement('div');
            var control = this.mapControl(controlDiv, this.map, this.props.onToggleSideBar);
            console.log("Control Div=" + controlDiv.innerHTML);
            this.map.controls[this.props.google.maps.ControlPosition.LEFT_CENTER].push(controlDiv);

            // TODO - figure out how to extract this to a React component
            //var control = new SideBarButton(controlDiv, this.map);
            //var controlDiv = new SideBarButton(controlDiv, this.map);
            //console.log("Control Div=" + controlDiv.innerHTML);

mapControl = (controlDiv, map, callback) => {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.lineHeight = '30px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = '>>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    var chicago = {lat: 41.85, lng: -87.65};
    controlUI.addEventListener('click', function() {
        callback();
    });
}
*/
import React from 'react';
import PropTypes from 'prop-types'
import Map from './Map';
import GoogleApiComponent from './GoogleApiComponent';
import Marker from  './Marker';
import { InfoWindow } from  './InfoWindow';
import beachflag from './beachflag.png';
import mapIcon from './mapIcon.svg';
import Crosshair from './Crosshair';
import LocationInput from './LocationInput';
import MgrsInput from './MgrsInput';
import SideBar, {SideBarToggleButton} from './SideBar';
import FooterBar from './FooterBar';
import './App.css';
import { forward, toPoint } from 'mgrs';
import {MapCentreLocationContext} from './Contexts';
import {keydrown} from './KeydrownUtil';
import {googleApiKey} from './GoogleApiKey';
//import { forward } from './d:/GitHub/mgrs-master/mgrs-master/dist/mgrs';
//import { forward } from './mgrs';

export class Container extends React.Component {
    constructor (props) {
        super(props)

        // Create and initialise state variables
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            initialLocation: this.props.defaultLocation,
            userLocation: this.props.defaultLocation,
            mapCentreLocation: this.props.defaultLocation,
            mapCentreMgrs: '',
            location: {
                initialLocation: this.props.defaultLocation,
                userLocation: this.props.defaultLocation,
                mapCentreLocation: this.props.defaultLocation,
                gpsAccuracy: 0
            },
            gpsAccuracy: null,
            units: 'metric',

            // Dynamic page layout controls
            headerBarHeightPercent: 10,
            footerBarHeightPercent: 5,
            sideBarWidthPercent: 20,
            showSideBar: false,

            // Create empty array for Marker objects
            markers: [],
            markerLon: -2.58,
            markerId: 0
        }

        // Bind event handlers
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleMGRSChange = this.handleMGRSChange.bind(this);
        this.onMapMove = this.onMapMove.bind(this);
        this.onMapReady = this.onMapReady.bind(this);
        this.onToggleSideBar = this.onToggleSideBar.bind(this); 
    }

    componentDidMount() {
        //console.log("Container.componentDidMount()");
        if (this.props.centerAroundCurrentLocation) {
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const coords = pos.coords;
                    this.setState({
                        userLocation: {
                            lat: coords.latitude,
                            lng: coords.longitude
                        }
                    })
                    //console.log("Container.componentDidMount(user lat=" + this.state.userLocation.lat + ")");
                    this.setState({initialLocation: this.state.userLocation});
                    this.setState({mapCentreLocation: this.state.userLocation});
                    this.setState({location: {gpsAccuracy: coords.accuracy}});
                    this.setState({gpsAccuracy: coords.accuracy});
                    this.setState({location: {userLocation: this.state.userLocation}});
                    //console.log("Container.componentDidMount(user loclat=" + this.state.location.userLocation.lat + ")");
                    //console.log("Container.componentDidMount(gps acc1=" + coords.accuracy + ")");
                    //console.log("Container.componentDidMount(gps acc2=" + this.state.location.gpsAccuracy + ")");
                    //console.log("Container.componentDidMount(gps acc3=" + this.state.gpsAccuracy + ")");
                })
            }
        }
    } 

    getInitialState = function() {
        return {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {}
        }
    }

   /* THIS DOESN'T WORK!!
   onMarkerClick: function(props, marker, e) {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    },
    */

    // BUT THIS DOES
    onMarkerClick = function(props, marker, e) { 
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onMapClick(event, map) {
        console.log('Container.onMapClick()');
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }

        if (keydrown.P.isDown()) {
            console.log('Create a goddam POINT !!! - lat=' + event.latLng.lat());
            //var marker = {name: 'new marker', label: 'new marker', icon: mapIcon, position: {lat: 51.51, lng: -2.57}};
            var marker = {
                key: this.state.markerId,
                name: 'new marker', 
                label: 'new marker', 
                icon: mapIcon, 
                position: {lat: event.latLng.lat(), lng: event.latLng.lng()}
            };
            this.state.markers.push(marker);

            // Increment id for the next one
            let id = this.state.markerId + 1;
            this.setState({markerId: id});
        }
        

        // Sidebar size toggle test
        /*
        if (this.state.showSideBar) {
            this.setState({sideBarWidthPercent: 20});
            this.setState({headerBarHeightPercent: 5});
            this.setState({footerBarHeightPercent: 10});
            this.setState({showSideBar: false});
        }
        else {
            this.setState({sideBarWidthPercent: 0});
            this.setState({headerBarHeightPercent: 10});
            this.setState({footerBarHeightPercent: 5});
            this.setState({showSideBar: true});
        }
        */
    }

    onMapReady() {
        console.log("Container.onMapReady()");
    }

    onToggleSideBar() {
        // This method shows an overlay on top of the map without moving it
        /*
        if (this.state.showSideBar) {
            this.setState({sideBarWidthPercent: 20});
            this.setState({showSideBar: false});
        }
        else {
            this.setState({sideBarWidthPercent: 0});
            this.setState({showSideBar: true});
        }
        */

        // This method slides the map aside
        this.setState({showSideBar: !this.state.showSideBar}); // Simply toggle show state
    }

    onMapMove = function(position) {
        //console.log("Container.onMapMove(position - lat=" + position.lat() + ":lon=" + position.lng() + ")");
        this.setState({mapCentreLocation: {lat: position.lat(), lng: position.lng()}}); 
        const mgrs = forward([position.lng(), position.lat()], 10);
        this.setState({mapCentreMgrs: mgrs});
    }

    handleLocationChange(location) {
        //alert('Container.handleLocationChange: ' + location.lat + ', Lon: ' + location.lon); 
        this.setState({mapCentreLocation: {lat: location.lat, lng: location.lon}}); 

        const mgrs = forward([location.lon, location.lat], 10);
        this.setState({mapCentreMgrs: mgrs});
        //const mgrs1 = forward([51, 2], 5);
        //console.log("Container.handleLocationChange: MGRS=" + mgrs + ")");
        //console.log("Container.handleLocationChange: MGRS=" + mgrs1 + ")");
    }

    handleMGRSChange(mgrs) {
        alert('Container.handleMGRSChange: ' + mgrs); 
        this.setState({mapCentreMgrs: mgrs}); 

        const location = toPoint(mgrs);
        this.setState({mapCentreLocation: {lat: location[1], lng: location[0]}});
        //this.setState({mapCentreMgrs: mgrs});
        //const mgrs1 = forward([51, 2], 5);
        console.log("Container.handleMGRSChange: lat=" + location[1] + "lon=" + location[0] + ")");
        //console.log("Container.handleLocationChange: MGRS=" + mgrs1 + ")");
    }

    onInfoWindowClose = function() {
        this.setState({
            showingInfoWindow: false,
            activeMarker: null
        })
    }

    getMarkers()
    {
        if (this.state.markers.length > 0) {
            // OUCH!!
            //console.log("Markers: " + this.state.markers[0].position.lat);
            //console.log("Count=" + this.state.markers.length);
            //let pos1 = {lat: 51.5, lng: this.state.markerLon};
            //console.log("Manual=" + pos1.lat);
            //console.log("Auto: lat=" + this.state.markers[0].position.lat + " lon=" + this.state.markers[0].position.lng);
            console.log("Container.getMarkers()")
            return (
                this.state.markers.map(item =>
                    <Marker 
                        key={item.key}
                        onClick={this.onMarkerClick}
                        position={{lat: item.position.lat, lng: item.position.lng}}
                        name={item.name}
                        label={item.label}
                        icon={item.icon}
                    />
                )
            ) 

            /*
            <Marker 
            onClick={this.onMarkerClick}
            position={{lat: this.state.markers[0].position.lat, lng: this.state.markers[0].position.lng}}
            name={this.state.markers[0].name}
            label={this.state.markers[0].label}
            icon={this.state.markers[0].icon}
            />
            */
        }
        return null;
    }
    
    render() {
        console.log("Container.render()");
        //console.log("Container.render(initial lat=" + this.state.initialLocation.lat + ")")
        //console.log("Container.render(map lat=" + this.state.mapCentreLocation.lat + ")")
        const markerPos = {lat: 51.48, lng: -2.59490277}

        // Determine Map area size
        // const mapWidth = 100 - this.state.sideBarWidthPercent; ** This is for sliding-in sidebar pattern
        const mapWidth = 100;
        const mapHeight = 100 - this.state.headerBarHeightPercent - this.state.footerBarHeightPercent;

        const sideBarWidthPercent = this.state.showSideBar ? this.state.sideBarWidthPercent : 0;
       
       
        //let controlDiv = document.createElement('div');
        //this.props.map.controls[this.props.google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
        

        return (
            <div /*style={{position: 'relative'}}*/>
                <div style={{ height: this.state.headerBarHeightPercent +'vh', width: '100%'}} id='headerbar'>
                    Header bar
                    <LocationInput
                        mapCentreLocation={this.state.mapCentreLocation}
                        onLocationChange={this.handleLocationChange} 
                    /> 
                    <MgrsInput
                        mgrs={this.state.mapCentreMgrs}
                        onLocationChange={this.handleMGRSChange} 
                    /> 
                </div>
                {/***** This is where the div root for map centring originates ****/}
                <div style={{position: 'relative'}}>   
                    
                    {/* MAP div */}
                    <div style={{ height: mapHeight + 'vh', width: mapWidth + '%', float: 'left' }}>
                        <Map 
                            google={this.props.google}
                            mapCentreLocation={this.state.mapCentreLocation}
                            //onDragEnd={this.onMapMove}
                            onMoveMap={this.onMapMove}
                            onClick={this.onMapClick}
                            onReady={this.onMapReady}
                            onToggleSideBar={this.onToggleSideBar}
                            //controls
                            >
                            <Marker 
                                icon={mapIcon}
                            />
                            <Marker 
                                onClick={this.onMarkerClick}
                                position={markerPos} 
                                name={'Marker 1'}
                                label='Marker 1'
                                icon={beachflag}
                                //icon='https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                                //icon='./mapIcon.svg'
                            />
                            {this.getMarkers()}
                            <InfoWindow
                                marker={this.state.activeMarker}
                                visible={this.state.showingInfoWindow}
                                onClose={this.onInfoWindowClose}>
                                <div>
                                    <h1>{this.state.selectedPlace.name}</h1>
                                </div>
                            </InfoWindow>
                        </Map>
                    </div>

                    <Crosshair
                        mapHeight={mapHeight}
                    />
                   
                   <MapCentreLocationContext.Provider value={this.state.mapCentreLocation}>
                        <SideBar
                            show={this.state.showSideBar} 
                            sideBarWidthPercent={sideBarWidthPercent}
                            mapHeightVH={mapHeight}
                            gpsAccuracy={this.state.gpsAccuracy}
                            altitude={34}
                            units={this.state.units}
                        />
                    </MapCentreLocationContext.Provider>

                    <SideBarToggleButton
                        show={this.state.showSideBar} 
                        sideBarWidth={this.state.sideBarWidthPercent}
                        mapHeight={mapHeight}
                        onClick={this.onToggleSideBar}
                    />
                </div>
                <MapCentreLocationContext.Provider value={this.state.mapCentreLocation}>
                    <FooterBar
                        show={true}
                        heightVH={this.state.footerBarHeightPercent}
                        onLocationChange={this.handleLocationChange} 
                    />
                </MapCentreLocationContext.Provider>
            </div>
        )
    }
}

Container.propTypes = {
    google: PropTypes.object,
    zoom: PropTypes.number,
    centerAroundCurrentLocation: PropTypes.bool,
    defaultLocation: PropTypes.object
}

Container.defaultProps = {
    zoom: 14,
    /*
    defaultLocation: { // Uluru
      lat: 37.774929,
      lng: -122.419416
    },
    */
    defaultLocation: { // Somewhere on the Welsh border
        lat: 52,
        lng: -2.59490277
    },
    centerAroundCurrentLocation: true
}

export default GoogleApiComponent({
    apiKey: googleApiKey
})(Container)


/*** OBSOLETE
 * 
    KEYDROWN - solved by moving keydrown declaration to separate file, so that object was available outside declaring scope
    alert("Hello");
    
    var kd1 = require('keydrown');
    kd1.run(function () {
        kd1.tick();
    })
    
    keydrown.SPACE.press(function () {
        alert('The space bar was pressed!');
    });

    alert("mapClicked=" + this.state.mapClicked);
    if (keydrown.P.isDown()) {
        console.log("P key is being pressed");
    }
    if (keydrown.LEFT.isDown()) {
        console.log("SPACE key is being pressed");
    }

*/
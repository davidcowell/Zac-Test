import React, { Component } from 'react';
import ReactDOM from 'react';
/*global google*/

/*export default class Map extends Component {
    //constructor(props) {
        //super(props);
        //center: { lat: 51.4748639, lng: -2.59490277 }
        //zoom: 11
   // }

    /*componentDidMount() {
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyD_x8POJw407kkOHjTU5KRIo6ez2LrMd-g&callback=initMap')
    }

    initMap() {
        this.map = new google.maps.Map(this.refs.map, {
            center: { lat: 51.4748639, lng: -2.59490277},
            zoom: 16});
    }

    render() {
        return (
          <div className='google-map' ref='map' style={{ height: '100vh', width: '100%' }}></div>
        );
    }
}

function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}
/*
<div id="map" style={{ height: '100vh', width: '100%' }}></div>
*/
/*
function initMap() {
  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}
*/


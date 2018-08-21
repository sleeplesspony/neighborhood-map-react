import React, { Component } from 'react';

class Map extends Component {

	initMap() {
		const map = new window.google.maps.Map(
			document.getElementById('map'),
			{ 
			    center: {
			        lat: this.props.center.lat, 
			        lng: this.props.center.lng
			    }, 
			    zoom: 13
			}
		);
		this.props.onMapLoad(map);
	}

	componentDidMount() {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBuOrUnYcOxswafAZifpSilhif4PyC3368&v3';
		script.setAttribute('async', '')
		script.setAttribute('defer', '')
		document.body.appendChild(script);

		script.addEventListener('load', event => {
			this.initMap()
		});

		script.addEventListener('error', () => {
			let map = document.getElementById('map');
			map.innerHTML = '<p>Error loading google maps. Please try later</p>';
		});
	}

	render() {

		return (
			<div id="map" className="map-container"></div>
		)
	}
}

export default Map
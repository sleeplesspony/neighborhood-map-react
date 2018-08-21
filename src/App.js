import React, { Component } from 'react';
import Map from './Map'
import './App.css';

class App extends Component {

    state = {
        locations: []
    }

    componentDidMount() {        
        fetch('./data/locations.json', {  
            headers: {
                "Content-Type": "application/json",
            }
        }).then(function(response) {
            return response.json();
        }).then((response) => {
            this.setState({ locations: response.locations });
        }).catch(error => {
            let defaultLocation = {
                "id" : "53f88290498ef2ad1a6c8308",
                "title" : "Bubba Gump Shrimp Co",
                "lat" : 51.510339800134155,
                "lng" : -0.13244546545923674
            };
            this.setState({ locations: [defaultLocation] });
        });
    }

    onMarkerClick = (marker, infoWindow, map) => {
        // Foursquare api data
        const foursquare = {
            'clientId' : 'RL15FUQLEH5FJ0FQ5F1OVLDKZZYQUZOFAQPXRAFR53IJENOK',
            'clientSecret' : 'RNQSWOWEUX5F4CYHMTFKP4HLRHWLGLXWPQ5JUS2TH1FO1USA',
            'apiVersion' : '20180323',
            'detailUrl' : 'https://api.foursquare.com/v2/venues/'
        };
        //let url = `${foursquare.detailUrl}${marker.id}?client_id=${foursquare.clientId}&client_secret=${foursquare.clientSecret}&v=${foursquare.apiVersion}`;

        let url = `${foursquare.detailUrl}${marker.id}?v=${foursquare.apiVersion}`;
        
        if (infoWindow.marker != marker) {
            infoWindow.marker = marker;
            fetch(url).then((response) => {
                return response.json();
            }).then((data) => {
                return this.getInfoWindowHtml(data.response.venue);
            }).catch((error) => {
                console.log(error);
                return this.getErrorInfoWindowHtml(marker.title);
            }).then((html) => {
                infoWindow.setContent(html);
                infoWindow.open(map, marker);
            });
        }
    }

    getInfoWindowHtml(data) {
        let title = data.name;
        let link = data.canonicalUrl;
        let address = data.location.address;
        let photoSrc = data.bestPhoto ? `${data.bestPhoto.prefix}200x150${data.bestPhoto.suffix}` : './data/img/location_no_photo.jpg';
        let hours = data.hours ? data.hours.status : ' no information';
        let rating = data.rating ? data.rating : 'no information';
        let html = `<div>
            <h3>${title}</h3>
            <img class="infowindow-img" src="${photoSrc}" alt="${title}">
            <p>Address : ${address}</p>
            <p>Hours : ${hours}</p>
            <p>Rating : ${rating}</p>
            <p><a href="${link}">More info</a></p>
        </div>`;
        return html;
    }

    getErrorInfoWindowHtml(title) {
        return `<div class="infowindow-err">
            <h3>${title}</h3>
            <p>Sorry, information is not available at the moment</p>
        </div>`;
    }

    onMapLoad = (map) => {
        let markers = [];
        let bounds = new window.google.maps.LatLngBounds();
        let infoWindow = new window.google.maps.InfoWindow();
        infoWindow.addListener('closeclick', function() {
          infoWindow.marker = null;
        });
        for (let location of this.state.locations) {
            let marker = new window.google.maps.Marker({
                map: map,
                position: location,            
                title: location.title,
                id: location.id
            });
            markers.push(marker);
            marker.addListener('click', () => { this.onMarkerClick(marker, infoWindow, map); }); 
            bounds.extend(marker.position);
        }
        map.fitBounds(bounds);
    }

    render() {
        return (
            <div className="app">
                <div className="main">
                    <Map 
                        center={this.state.locations[0]}
                        onMapLoad={this.onMapLoad}
                    />
                </div>
            </div>
        );
    }
}

export default App;

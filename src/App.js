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

    onMapLoad = (map) => {
        let markers = [];
        let bounds = new window.google.maps.LatLngBounds();
        for (let location of this.state.locations) {
            let marker = new window.google.maps.Marker({
                map: map,
                position: location,            
                title: location.title,
                id: location.id
            });
            markers.push(marker);
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

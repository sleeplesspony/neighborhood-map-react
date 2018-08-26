import React, { Component } from 'react';
import Map from './Map'
import List from './List'
import escapeRegExp from 'escape-string-regexp'
import './App.css';
import Menu from './menu.svg';

class App extends Component {

    state = {
        locations: [],
        markers: [],
        query: '',
        activeLocations: [],
        map: null,
        visibleSideBar: false
    }

    // get locations data from json and set state
    componentDidMount() {        
        fetch('./data/locations.json', {  
            headers: {
                "Content-Type": "application/json",
            }
        }).then(function(response) {
            return response.json();
        }).then((response) => {
            this.setState({ locations: response.locations, activeLocations: response.locations, visibleSideBar: !this.isMobile() });
        }).catch(error => {
            console.log(error);
            this.setState({locations: [], activeLocations: [], visibleSideBar: !this.isMobile()});
        });
    }

    // show infowidow with data from foursquare on marker click
    onMarkerClick = (marker, infoWindow) => {
        // Foursquare api data
        const foursquare = {
            'clientId' : 'RL15FUQLEH5FJ0FQ5F1OVLDKZZYQUZOFAQPXRAFR53IJENOK',
            'clientSecret' : 'RNQSWOWEUX5F4CYHMTFKP4HLRHWLGLXWPQ5JUS2TH1FO1USA',
            'apiVersion' : '20180323',
            'detailUrl' : 'https://api.foursquare.com/v2/venues/'
        };
        //let url = `${foursquare.detailUrl}${marker.id}?client_id=${foursquare.clientId}&client_secret=${foursquare.clientSecret}&v=${foursquare.apiVersion}`;

        let url = `${foursquare.detailUrl}${marker.id}?v=${foursquare.apiVersion}`;
        
        if (infoWindow.marker !== marker) {
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
                infoWindow.open(this.state.map, marker); // not commited
            });
        }
    }

    // set html string to set infowindow content
    getInfoWindowHtml(data) {
        let title = data.name;
        let link = data.canonicalUrl;
        let address = data.location.address;
        let photoSrc = data.bestPhoto ? `${data.bestPhoto.prefix}200x150${data.bestPhoto.suffix}` : './data/img/location_no_photo.jpg';
        let hours = data.hours ? data.hours.status : ' no information';
        let rating = data.rating ? data.rating : 'no information';
        let html = `<div class="infowindow-block">
            <h3>${title}</h3>
            <img class="infowindow-img" src="${photoSrc}" alt="${title}">
            <p>Address : ${address}</p>
            <p>Hours : ${hours}</p>
            <p>Rating : ${rating}</p>
            <p><a href="${link}">More info on Foursquare</a></p>
        </div>`;
        return html;
    }

     // set html string to set infowindow content if foursquare api error occures
    getErrorInfoWindowHtml(title) {
        return `<div class="infowindow-err">
            <h3>${title}</h3>
            <p>Sorry, information is not available at the moment</p>
        </div>`;
    }

    // set markers on map
    onMapLoad = (map) => {
        this.setState({map});
        let markers = [];
        let bounds = new window.google.maps.LatLngBounds();
        let infoWindow = new window.google.maps.InfoWindow();
        infoWindow.addListener('closeclick', function() {
          infoWindow.marker = null;
        });
        for (let location of this.state.activeLocations) {
            let marker = new window.google.maps.Marker({
                map: map,
                position: location,            
                title: location.title,
                id: location.id
            });
            markers.push(marker);
            marker.addListener('click', () => { this.onMarkerClick(marker, infoWindow); }); 
            bounds.extend(marker.position);
        }
        if (this.state.activeLocations.length) {
            map.fitBounds(bounds);
            this.setState({markers});
        }
    }

    // handler for clicks on items in locations list    
    onListItemClick = (location) => {
        for (let marker of this.state.markers) {
            if (marker.id === location.id) {
               new window.google.maps.event.trigger( marker, 'click' );
            }
        }
    }

    updateQuery = (query) => {
        this.setState({query});
        query = query.trim();
        let activeLocations;
        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i')
            activeLocations = this.state.locations.filter((location) => match.test(location.title))
        } else {
            activeLocations = this.state.locations;
        }
        this.setState((state) => ({  
            activeLocations: activeLocations,           
            markers: state.markers.map((marker) => {
                let visible = false;
                for(let location of activeLocations) {
                    if (marker.id === location.id) {
                        visible = true;
                        break;
                    }
                }
                if (visible) marker.setMap(this.state.map);
                else marker.setMap(null);
                return marker;
            })
        }))
    }

    toggleSideBar = () => {
        this.setState((state) => ({
            visibleSideBar: !state.visibleSideBar
        }));
    }

    isMobile = () => {
        console.log(window.innerWidth);
        return window.innerWidth >= 500 ? false : true
    }

    hideSideBar = () => {
        console.log(this.isMobile(), this.state.visibleSideBar);
        if (this.state.visibleSideBar && this.isMobile()) {
            this.toggleSideBar();
        }
    }

    render() {
        let sideBarClassName = "app-sidebar";
        let mapBlockClassName = "app-map-container"
        if (!this.state.visibleSideBar) {
            sideBarClassName += ' app-sidebar-hidden';
            mapBlockClassName += ' app-map-container-full'
        }
        return (
            <div className="app">
                <header className="app-header">
                    <nav className="app-nav" onClick={this.toggleSideBar}>
                        <img src={Menu} alt="Toggle menu" />
                    </nav>
                    <h1 className="app-title">London City restaurants</h1>
                </header>
                <div className="app-container">
                    <div className={sideBarClassName} onClick={this.hideSideBar}>
                        <input 
                            className="app-sidebar-filter"
                            type="text" 
                            placeholder="Search by title"
                            value={this.state.query}
                            onChange={(event) => this.updateQuery(event.target.value)}
                        />
                        <List 
                            onListItemClick={this.onListItemClick} 
                            locations={this.state.activeLocations}
                        />
                    </div>
                    <div className={mapBlockClassName}>
                        <Map 
                            center={this.state.activeLocations.length ? this.state.activeLocations[0] : {"lat" : 51.510339800134155, "lng" : -0.13244546545923674}}
                            onMapLoad={this.onMapLoad}
                        /> 
                    </div>
                   
                </div>
            </div>
        );
    }
}

export default App;

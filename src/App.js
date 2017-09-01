import React, { Component } from 'react';
import './App.css';
import Lmap from './components/Map';
import GeoLocate from './components/GeoLocate';
import FilterMarkers from './components/FilterMarkers';
import ExternalLinks from './components/ExternalLinks';
import FilterInfo from './components/FilterInfo';

class App extends Component {
  state = {
    OGMarkers: [],
    markers: [],
    viewport: {
      center: [29.760427, -95.369803],
      zoom: 9
    },
    currentLocation: [],
    selectedFilter: 'Accepting People',
    clickToggleInfo: false
  }

  componentDidMount() {

    fetch('https://spreadsheets.google.com/feeds/list/14GHRHQ_7cqVrj0B7HCTVE5EbfpNFMbSI9Gi8azQyn-k/od6/public/values?alt=json')
    .then(data => data.json())
    .then(data => {
      const shelterData = data.feed.entry;
      const allShelterData = shelterData.map((shelter) => {
        let latitude = parseFloat(shelter.gsx$latitude.$t)
        let longitude = parseFloat(shelter.gsx$longitude.$t)
        return {
          county: shelter.gsx$county.$t,
          name: shelter.gsx$shelter.$t,
          address: shelter.gsx$address.$t,
          phone: shelter.gsx$phone.$t,
          pets: shelter.gsx$pets.$t,
          accepting: shelter.gsx$accepting.$t,
          location: {
            lat: latitude ? parseFloat(shelter.gsx$latitude.$t) : 0,
            lng: longitude ? parseFloat(shelter.gsx$longitude.$t) : 0
          },
          lastUpdated: shelter.gsx$lastupdated.$t,
          notes: shelter.gsx$notes.$t,
          supplyNeeds: shelter.gsx$supplyneeds.$t,
          volunteerNeeds: shelter.gsx$volunteerneeds.$t,
          showInfo: false
        }
      })

      this.setState({
        OGMarkers: allShelterData,

        // Accepting shelters set to default
        markers: allShelterData.filter(marker => (marker.accepting === 'TRUE'))
      })
    })
  }

  handleLocate = (currentLocation) => {
    this.setState({
      viewport: {
        center: currentLocation,
        zoom: 13
      },
      currentLocation: currentLocation
    })
  }

  handleFilteredList = (filteredMarkers, selectedFilter) => {
    this.setState({
      markers: filteredMarkers,
      selectedFilter: selectedFilter
    })
  }

  handleToggleInfo = () => {
    this.setState({
      clickToggleInfo: !this.state.clickToggleInfo
    })
  }

  render() {
    const { OGMarkers, markers, viewport, currentLocation, selectedFilter, clickToggleInfo } = this.state;
    return (
      <div className="App">
        <FilterMarkers
          OGMarkers={ OGMarkers }
          markers={ markers }
          clickToggleInfo={ clickToggleInfo }
          onClickFilter={ this.handleFilteredList }
        />
        <GeoLocate
          currentLocation={ currentLocation }
          clickToggleInfo={ clickToggleInfo }
          onClickLocate={ this.handleLocate }
        />
        <Lmap
          currentLocation={ currentLocation }
          markers={ markers }
          viewport={ viewport }
          clickToggleInfo={ clickToggleInfo }
          onToggleInfo={ this.handleToggleInfo }
        />
        <ExternalLinks />
        <FilterInfo
          selectedFilter={selectedFilter}
          filterLength={markers.length}
        />
      </div>
    )
  }
}

export default App;

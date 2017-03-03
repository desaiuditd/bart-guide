/**
 * Created by udit on 3/1/17.
 */

import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import './station.html';

Session.setDefault('station', null);
Template.App_station.helpers({
  station: function () {
    return Session.get('station');
  },
  stationMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {

      const station = Session.get('station');

      // Map initialization options
      return {
        center: new google.maps.LatLng(station.gtfs_latitude[0], station.gtfs_longitude[0]),
        zoom: 16
      };
    }
  },
});

Template.App_station.onRendered(() => {

  const stn_abbr = FlowRouter.getParam('stn_abbr');

  HTTP.get('/api/station/?source='+stn_abbr, function (err, response) {

    if(err) {
      console.log(err);
      return;
    }

    const station = response.data.root.stations[0].station[0];
    station.county[0] = station.county[0].charAt(0).toUpperCase() + station.county[0].slice(1);

    station.north_platforms = station.north_platforms[0].platform;
    station.south_platforms = station.south_platforms[0].platform;
    station.north_routes = station.north_routes[0].route;
    station.south_routes = station.south_routes[0].route;

    Session.set('station', station);

    if (typeof GoogleMaps.maps.stationMap === 'undefined') {

      GoogleMaps.ready('stationMap', function(map) {

        var position = new google.maps.LatLng(station.gtfs_latitude[0], station.gtfs_longitude[0]);

        // Add a marker to the map once it's ready
        var marker = new google.maps.Marker({
          position: position,
          map: map.instance
        });

        map.instance.panTo(position);

      });

    } else {

      var position = new google.maps.LatLng(station.gtfs_latitude[0], station.gtfs_longitude[0]);

      // Add a marker to the map once it's ready
      var marker = new google.maps.Marker({
        position: position,
        map: GoogleMaps.maps.stationMap.instance
      });

      GoogleMaps.maps.stationMap.instance.panTo(position);

    }
  });
});
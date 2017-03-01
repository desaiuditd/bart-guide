/**
 * Created by udit on 2/28/17.
 */

import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';
import './stations.html';

Session.setDefault('stations', []);
Template.App_stations.helpers({
  stations: function () {
    return Session.get('stations');
  },
  getFirstColumnStations: function () {
    const stations = Session.get('stations');
    return stations.filter(function (item, i) {
      return i%3 === 0;
    });
  },
  getSecondColumnStations: function () {
    const stations = Session.get('stations');
    return stations.filter(function (item, i) {
      return i%3 === 1;
    });
  },
  getThirdColumnStations: function () {
    const stations = Session.get('stations');
    return stations.filter(function (item, i) {
      return i%3 === 2;
    });
  },
});

Template.App_stations.onRendered(() => {
  HTTP.get('/api/stations/', function (err, response) {
    if(err) {
      return;
    }
    Session.set('stations', response.data.root.stations[0].station);
  });
});
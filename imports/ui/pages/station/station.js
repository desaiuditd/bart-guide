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
});

Template.App_station.onRendered(() => {
  const stn_abbr = FlowRouter.getParam('stn_abbr');
  HTTP.get('/api/station/?source='+stn_abbr, function (err, response) {
    if(err) {
      return;
    }
    Session.set('station', response.data.root.stations[0].station[0]);
  });
});
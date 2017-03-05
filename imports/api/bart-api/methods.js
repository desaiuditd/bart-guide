/**
 * Created by udit on 2/28/17.
 */

import { Meteor } from 'meteor/meteor';
import { BART_API } from './api.js';
import { XML_PARSER } from '../xml-parser/api.js';
import Future from 'fibers/future'

Meteor.method('getStations', function () {

  const stationsXML = BART_API.getAllStations();

  const f = new Future();
  XML_PARSER.getJSON(stationsXML, function (stationsJSON) {
    f.return(stationsJSON);
  });

  return f.wait();
}, {
  url: '/api/stations',
  // getArgsFromRequest: function (req) {
  //   return [''];
  // },
  httpMethod: 'get',
});

Meteor.method('getStation', function (stn_abbr) {

  const stationXML = BART_API.getStation(stn_abbr);

  const f = new Future();
  XML_PARSER.getJSON(stationXML, function (stationJSON) {
    f.return(stationJSON);
  });

  return f.wait();
}, {
  url: '/api/station',
  getArgsFromRequest: function (req) {
    let stn_abbr = '';

    if(req.query && req.query.source && typeof req.query.source === 'string' && req.query.source.length > 0) {
      stn_abbr = req.query.source;
    }

    return [stn_abbr];
  },
  httpMethod: 'get',
});

Meteor.method('getTrips', function (src, dest) {

  const mainFuture = new Future();

  let response = {};

  const scheduledXML = BART_API.getScheduledTrips(src, dest);

  XML_PARSER.getJSON(scheduledXML, function (scheduledJSON) {

    response.scheduledTrips = scheduledJSON;

    const realTimeXML = BART_API.getRealTimeEstimates(src);

    XML_PARSER.getJSON(realTimeXML, function (realTimeJSON) {
      response.realTimeEstimates = realTimeJSON;
      mainFuture.return(response);
    });

  });

  return mainFuture.wait();
}, {
  url: '/api/trips/:src/:dest',
  getArgsFromRequest: function (req) {
    let src = '';
    let dest = '';

    if (req.params && req.params.src && typeof req.params.src === 'string' && req.params.src.length > 0) {
      src = req.params.src;
    }

    if (req.params && req.params.dest && typeof req.params.dest === 'string' && req.params.dest.length > 0) {
      dest = req.params.dest;
    }

    return [src, dest];
  },
  httpMethod: 'get',
});

Meteor.method('getTrainHeadStationData', function (scheduledTrips) {

  const allLegs = [];
  lodash.each(scheduledTrips.root.schedule[0].request[0].trip, function (trip) {
    lodash.each(trip.leg, function (leg) {
      allLegs.push(leg);
    });
  });

  allLegs.push({
    $: {
      trainHeadStation: scheduledTrips.root.origin[0],
    }
  });

  allLegs.push({
    $: {
      trainHeadStation: scheduledTrips.root.destination[0],
    }
  });

  lodash.each(scheduledTrips.root.schedule[0].request[0].trip, function (trip) {
    lodash.each(trip.leg, function (leg) {
      allLegs.push({
        $: {
          trainHeadStation: leg.$.destination,
        }
      });
    });
  });

  const futures = lodash.map(allLegs, function (leg) {
    const future = new Future();
    const stationXML = BART_API.getStation(leg.$.trainHeadStation);

    XML_PARSER.getJSON(stationXML, function (stationJSON) {
      future.return(stationJSON);
    });

    return future;
  });

  const response = lodash.map(futures, function (future) {
    const trainHeadStation = future.wait();
    return trainHeadStation;
  });

  return response;
}, {
  url: '/api/trainHeadStationData',
  getArgsFromRequest: function (req) {
    let scheduledTrips = [];
    if (req.body != undefined) {
      scheduledTrips = req.body;
    }
    return [scheduledTrips];
  },
  httpMethod: 'post',
});

Meteor.method('getRoutes', function (scheduledTrips) {

  const allLegs = [];
  lodash.each(scheduledTrips.root.schedule[0].request[0].trip, function (trip) {
    lodash.each(trip.leg, function (leg) {
      allLegs.push(leg);
    });
  });

  const futures = lodash.map(allLegs, function (leg) {
    const future = new Future();

    const line = leg.$.line;
    // "ROUTE XX" - after ROUTE everything
    const route = line.slice(6);
    const routeXML = BART_API.getRoute(route);
    XML_PARSER.getJSON(routeXML, function (routeJSON) {
      future.return(routeJSON);
    });

    return future;
  });

  const response = lodash.map(futures, function (future) {
    const route = future.wait();
    return route;
  });

  return response;
}, {
  url: '/api/routes',
  getArgsFromRequest: function (req) {
    let scheduledTrips = [];
    if (req.body != undefined) {
      scheduledTrips = req.body;
    }
    return [scheduledTrips];
  },
  httpMethod: 'post',
});

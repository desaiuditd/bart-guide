/**
 * Created by udit on 2/28/17.
 */

import { Meteor } from 'meteor/meteor';
import { BART_API } from './api.js';
import { XML_PARSER } from '../xml-parser/api.js';
import Future from 'fibers/future'

Meteor.method('getStations', function () {

  const f = new Future();

  BART_API.getAllStations(function (xmlResponse) {

    XML_PARSER.getJSON(xmlResponse, function (jsonResponse) {

      f.return(jsonResponse);

    });

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
  const f = new Future();

  BART_API.getStation(stn_abbr, function (xmlResponse) {

    XML_PARSER.getJSON(xmlResponse, function (jsonResponse) {

      f.return(jsonResponse);

    });

  });

  return f.wait();
}, {
  url: '/api/station',
  getArgsFromRequest: function (req) {
    let stn_abbr = '';

    if(req.query && req.query.source && typeof req.query.source == 'string' && req.query.source.length > 0) {
      stn_abbr = req.query.source;
    }

    return [stn_abbr];
  },
  httpMethod: 'get',
});
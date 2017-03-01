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

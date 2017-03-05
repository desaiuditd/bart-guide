/**
 * Created by udit on 2/28/17.
 */

import { HTTP } from 'meteor/http';
import { BART_API_CONFIG } from './config.js';

export const BART_API = {
  getAllStations: function () {

    return HTTP.get(BART_API_CONFIG.endpoints.getAllStations.url, {
        params: BART_API_CONFIG.endpoints.getAllStations.params,
      }
    ).content;

  },
  getStation: function (stn_abbr) {

    const params = BART_API_CONFIG.endpoints.getStation.params;
    params.orig = stn_abbr;

    return HTTP.get(BART_API_CONFIG.endpoints.getStation.url, {
        params: params,
      }
    ).content;

  },
  getRealTimeEstimates: function (stn_abbr) {

    const params = BART_API_CONFIG.endpoints.getRealTimeEstimates.params;
    params.orig = stn_abbr;

    return HTTP.get(BART_API_CONFIG.endpoints.getRealTimeEstimates.url, {
        params: params,
      }
    ).content;

  },
  getScheduledTrips: function (src, dest) {

    const params = BART_API_CONFIG.endpoints.getScheduledTrips.params;
    params.orig = src;
    params.dest = dest;

    return HTTP.get(BART_API_CONFIG.endpoints.getScheduledTrips.url, {
        params: params,
      }
    ).content;

  },
  getRoute: function (route) {

    const params = BART_API_CONFIG.endpoints.getRoute.params;
    params.route = route;

    return HTTP.get(BART_API_CONFIG.endpoints.getRoute.url, {
        params: params,
      }
    ).content;

  },
};

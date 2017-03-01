/**
 * Created by udit on 2/28/17.
 */

import { HTTP } from 'meteor/http';
import { BART_API_CONFIG } from './config.js';

export const BART_API = {
  getAllStations: function (callback) {

    HTTP.get(BART_API_CONFIG.endpoints.getAllStations.url, {
        params:BART_API_CONFIG.endpoints.getAllStations.params
      }, function (err, response) {
        if (err) {
          throw new Meteor.Error(err);
        } else {
          callback(response.content);
        }
      }
    );

  },
};
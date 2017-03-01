/**
 * Created by udit on 2/28/17.
 */

export const BART_API_CONFIG = {
  endpoints: {
    getAllStations: {
      url: 'http://api.bart.gov/api/stn.aspx',
      params: {
        cmd: 'stns',
        key: 'MW9S-E7SL-26DU-VV8V',
      }
    },
    getStation: {
      url: 'http://api.bart.gov/api/stn.aspx',
      params: {
        cmd: 'stninfo',
        key: 'MW9S-E7SL-26DU-VV8V',
      }
    },
  },
};

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
    getScheduledTrips: {
      url: 'http://api.bart.gov/api/sched.aspx',
      params: {
        cmd: 'depart',
        key: 'MW9S-E7SL-26DU-VV8V',
        b: '4', // 4 trips to be returned before the current time. In case the current time is inaccurate.
        a: '4', // 4 trips to be returned after the current time. trips that can be taken as of now.
        l: '1', // include legends in the response
      },
    },
    getRealTimeEstimates: {
      url: 'http://api.bart.gov/api/etd.aspx',
      params: {
        cmd: 'etd',
        key: 'MW9S-E7SL-26DU-VV8V',
      },
    },
    getRoute: {
      url: 'http://api.bart.gov/api/route.aspx',
      params: {
        cmd: 'routeinfo',
        key: 'MW9S-E7SL-26DU-VV8V',
      }
    }
  },
};

/**
 * Created by udit on 3/3/17.
 */

import "./trips.html";

Session.setDefault('stations', []);

Template.App_trips.helpers({
  stations: function () {
    return Session.get('stations');
  },
  tripData: function () {
    return Session.get('tripData');
  },
  realDate: function () {
    const tripData = Session.get('tripData');
    return moment(tripData.realTimeEstimates.root.date[0], 'MM-DD-YYYY').format('MMMM DD, YYYY');
  },
  realTime: function () {
    const tripData = Session.get('tripData');
    return tripData.realTimeEstimates.root.time;
  },
  tripMapOptions: function () {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {

      // Map initialization options
      return {
        center: new google.maps.LatLng(65, 95),
        zoom: 8,
      };
    }
  },
  trips: function () {
    const tripData = Session.get('tripData');
    return tripData.scheduledTrips.root.schedule[0].request[0].trip;
  },
  tripMarkup: function(trip) {

    const tripData = Session.get('tripData');

    let markup = '';
    const transfercodemessage = {
      N: 'Normal Transfer.',
      T: 'Timed Transfer. Connecting trains will wait up to five minutes for transferring passengers.',
      S: 'Scheduled Transfer. Connecting trains will NOT wait for transferring passengers if there is a delay.',
    };

    const noOfLegs = trip.leg.length;

    let stationCol = 'col-xs-2 col-sm-1';
    if (noOfLegs === 1) {
      stationCol = 'col-xs-2';
    }

    let arrowCol = 2;
    if (noOfLegs === 1) {
      arrowCol = 7;
    } else if (noOfLegs === 2) {
      arrowCol = 3;
    }

    if (is.mobile()) {
      arrowCol = 8;
    }

    for(let i = 0; i < trip.leg.length; i++) {

      if(i == 0) {
        markup += '<div class="' + stationCol + ' text-center"><h4><small>' + trip.leg[i].$.origin + '</small><br />' + trip.leg[i].$.origTimeMin + '</h4></div>';
      } else if(is.mobile()) {
        markup += '<div class="' + stationCol + ' text-center"><h6><small>' + trip.leg[i].$.origin + '</small><br />' + trip.leg[i].$.origTimeMin + '</h6></div>';
      }

      markup += '<div class="col-xs-' + arrowCol + '">';
      markup += '<div id="arrow-1" class="arrow-h-' + tripData.routes[trip.leg[i].$.line].root.routes[0].route[0].hexcolor[0].toUpperCase() + '">';
      markup += '<h4 class="text-center">';
      markup += tripData.trainHeadStations[trip.leg[i].$.trainHeadStation].root.stations[0].station[0].name;
      markup += ' <span class="text-info"> ';
      const bikeflag = trip.leg[i].$.bikeflag;
      if (bikeflag === '1') {
        markup += '<i class="fa fa-bicycle bg-info" data-toggle="tooltip" title="Bikes are allowed on this train."></i>';
      }
      const load = parseInt(trip.leg[i].$.load);
      for(let j = 0; j < load; j++) {
        markup += '<i class="fa fa-user bg-info" data-toggle="tooltip" title="This shows how full the train is at this time."></i>';
      }
      markup += '</span>';
      markup += '</h4>';
      markup += '</div>';
      markup += '</div>';

      if(i == trip.leg.length-1) {
        markup += '<div class="' + stationCol + ' text-center">';
        markup += '<h4>';
        markup += '<small>' + trip.leg[i].$.destination + '</small><br />';
        markup += trip.leg[i].$.destTimeMin;
        markup += '</h4>';
        markup += '</div>';
      } else {
        markup += '<div class="' + stationCol + ' text-center">';
        markup += '<h6>';
        markup += '<small>' + trip.leg[i].$.destination + '</small><br />';
        markup += trip.leg[i].$.destTimeMin;
        markup += '<br /><span class="lead trasfercode bg-info text-info" data-toggle="tooltip" title="' + transfercodemessage[trip.leg[i].$.transfercode] + '">' + trip.leg[i].$.transfercode + '</span>';
        markup += '</h6>';
        markup += '</div>';
      }

    }

    return markup;
  },
  realTimeEstimates: function () {
    const tripData = Session.get('tripData');
    return tripData.realTimeEstimates.root.station[0].etd;
  },
  getRealTimeEstimateMinutes: function (minutes) {
    if (minutes === 'Leaving') {
      return 'Leaving';
    }
    return '<span class="real-time-remained">' + minutes + '</span> minutes';
  },
  getRealTimeCountdown: function (minutes) {
    if (minutes === 'Leaving') {
      return '';
    }
    const tripData = Session.get('tripData');
    const realTimestamp = tripData.realTimeEstimates.root.date[0] + ' ' + tripData.realTimeEstimates.root.time;
    const realDate = moment(realTimestamp, 'MM-DD-YYYY HH:mm:ss A').add(parseInt(minutes), 'minutes');
    return '(<span data-countdown="' + moment(realDate).format('YYYY/MM/DD HH:mm:ss A') + '"></span>)';
  },
  legend: function () {
    const tripData = Session.get('tripData');
    return tripData.scheduledTrips.root.message[0].legend;
  },
  co2emission: function () {
    const tripData = Session.get('tripData');
    return tripData.scheduledTrips.root.message[0].co2_emissions;
  },
  specialSchedule: function () {
    const tripData = Session.get('tripData');
    return tripData.scheduledTrips.root.message[0].special_schedule;
  },
  isSourceSelected: function (stn_abbr) {
    return FlowRouter.getQueryParam('source') === stn_abbr ? 'selected="selected"' : '';
  },
  isDestinationSelected: function (stn_abbr) {
    return FlowRouter.getQueryParam('destination') === stn_abbr ? 'selected="selected"' : '';
  },
});

Template.App_trips.onRendered(() => {

  window.countDownIntervalIds = [];

  $('#source, #destination').select2({
    placeholder: 'Select Station',
    allowClear: true,
  });

  const source = FlowRouter.getQueryParam('source');
  const destination = FlowRouter.getQueryParam('destination');

  HTTP.get('/api/stations/', function (err, response) {
    if(err) {
      console.log(err);
    } else {
      Session.set('stations', response.data.root.stations[0].station);
    }

    if (source != '' && source != undefined
      && destination != '' && destination != undefined) {

      setTimeout(function () {
        $('#source').val(source).change();
        $('#destination').val(destination).change();
      }, 100);

    }

    return;
  });

  if (source != '' && source != undefined
    && destination != '' && destination != undefined) {

    $('.trip-message').removeClass('hide');
    HTTP.get('/api/trips/' + source + '/' + destination + '/', function (err, res) {
      if(err) {
        console.log(err);
        Session.set('tripData', null);
      } else {
        const tripData = res.data;

        HTTP.post('/api/trainHeadStationData/', {
          data: tripData.scheduledTrips,
        }, function (err1, res1) {
          if(err1) {
            console.log(err1);
            Session.set('tripData', null);
          } else {
            const trainHeadStations = res1.data;
            tripData.trainHeadStations = {};
            for(let i = 0; i < trainHeadStations.length; i++) {
              const abbr = trainHeadStations[i].root.stations[0].station[0].abbr[0];
              tripData.trainHeadStations[abbr] = trainHeadStations[i];
            }

            HTTP.post('/api/routes/', {
              data: tripData.scheduledTrips,
            }, function (err2, res2) {
              if(err2) {
                console.log(err2);
                Session.set('tripData', null);
              } else {
                const routes = res2.data;
                tripData.routes = {};
                for(let i = 0; i < routes.length; i++) {
                  const routeID = routes[i].root.routes[0].route[0].routeID[0];
                  tripData.routes[routeID] = routes[i];
                }

                Session.set('tripData', tripData);

                setTimeout(function () {
                  $(window.countDownIntervalIds).each(function (item, i) {
                    clearInterval(item);
                  });

                  $('[data-countdown]').each(function() {
                    var $this = $(this);

                    var finalDate = moment($this.data('countdown'), 'YYYY/MM/DD hh:mm:ss A');
                    var now = moment(new Date(), 'YYYY/MM/DD hh:mm:ss A');
                    var diff = finalDate.format('X') - now.format('X');
                    var duration = moment.duration(diff * 1000, 'milliseconds');
                    var interval = 1000;

                    window.countDownIntervalIds.push(setInterval(function () {
                      if(duration - interval !== 0) {
                        duration = moment.duration(duration - interval, 'milliseconds');
                        $this.html(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds());
                      }
                    }, interval));
                  });
                }, 100);
              }
            });
          }
        });
      }
    });
  } else {
    Session.set('tripData', null);
  }

  setInterval(function () {

    var source = $('#source').val();
    var destination = $('#destination').val();

    if (source !== '' && destination !== '' && source !== destination ) {
      $('#btn-trip-go').click();
    }

  }, 30000);
});

let bartDirectionsDisplay = null;
let bartDirectionsService = null;

Template.App_trips.events({
  'shown.bs.modal #tripMapModal': (e) => {

    const button = $(e.relatedTarget); // Button that triggered the modal
    const tripIndex = button.data('trip-index'); // Extract info from data-* attributes
    const tripData = Session.get('tripData');
    const trip = tripData.scheduledTrips.root.schedule[0].request[0].trip[tripIndex];
    let modalTitle = trip.$.origin;

    const originLat = tripData.trainHeadStations[trip.$.origin].root.stations[0].station[0].gtfs_latitude[0];
    const originLong = tripData.trainHeadStations[trip.$.origin].root.stations[0].station[0].gtfs_longitude[0];
    const destLat = tripData.trainHeadStations[trip.$.destination].root.stations[0].station[0].gtfs_latitude[0];
    const destLong = tripData.trainHeadStations[trip.$.destination].root.stations[0].station[0].gtfs_longitude[0];

    google.maps.event.trigger(GoogleMaps.maps.tripMap.instance, 'resize');


    const bounds = new google.maps.LatLngBounds();

    for(let i = 0; i < trip.leg.length; i++) {
      modalTitle += ( ' <i class="fa fa-long-arrow-right"></i> ' + trip.leg[i].$.destination);

      const lat = tripData.trainHeadStations[trip.leg[i].$.destination].root.stations[0].station[0].gtfs_latitude[0];
      const long = tripData.trainHeadStations[trip.leg[i].$.destination].root.stations[0].station[0].gtfs_longitude[0];
      const latLong = new google.maps.LatLng(lat, long);
      bounds.extend(latLong);
    }

    $('#tripMapModalLabel').html(modalTitle);

    const originLatLong = new google.maps.LatLng(originLat, originLong);
    const destinationLatLong = new google.maps.LatLng(destLat, destLong);
    bounds.extend(originLatLong);
    bounds.extend(destinationLatLong);

    GoogleMaps.maps.tripMap.instance.fitBounds(bounds);       // auto-zoom
    GoogleMaps.maps.tripMap.instance.panToBounds(bounds);     // auto-center

    if(bartDirectionsDisplay != null) {
      bartDirectionsDisplay.setMap(null);
      bartDirectionsDisplay = null;
      bartDirectionsService = null;
    }

    bartDirectionsDisplay = new google.maps.DirectionsRenderer;
    bartDirectionsService = new google.maps.DirectionsService;

    bartDirectionsDisplay.setMap(GoogleMaps.maps.tripMap.instance);

    bartDirectionsService.route({
      origin: {lat: parseFloat(originLat), lng: parseFloat(originLong)},
      destination: {lat: parseFloat(destLat), lng: parseFloat(destLong)},
      travelMode: google.maps.TravelMode['TRANSIT'],
    }, function(response, status) {
      if (status == 'OK') {
        bartDirectionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  },
  // 'shown.bs.modal #tripMapModal': (e) => {
  //
  // },
  'click #btn-trip-go': (e) => {
    e.preventDefault();

    var source = $('#source').val();
    var destination = $('#destination').val();

    if (source === '') {
      Bert.alert({
        title: 'Oops!',
        message: 'Select a source station.',
        type: 'warning',
        style: 'growl-top-right',
      });
      return;
    } else if (destination === '') {
      Bert.alert({
        title: 'Oops!',
        message: 'Select a destination station.',
        type: 'warning',
        style: 'growl-top-right',
      });
      return;
    } else if (source === destination) {
      Bert.alert({
        title: 'Oops!',
        message: 'Select different station for destination.',
        type: 'warning',
        style: 'growl-top-right',
      });
      return;
    }

    FlowRouter.setQueryParams({source: source, destination: destination});

    const preHTML = $('#btn-trip-go').html();
    $('#btn-trip-go').prop('disabled', 'disabled').html('<i class="fa fa-spinner fa-spin fa-fw"></i>');

    $('.trip-message').removeClass('hide');
    HTTP.get('/api/trips/' + source + '/' + destination + '/', function (err, res) {
      if(err) {
        console.log(err);
        Session.set('tripData', null);
      } else {
        const tripData = res.data;

        HTTP.post('/api/trainHeadStationData/', {
          data: tripData.scheduledTrips,
        }, function (err1, res1) {
          if(err1) {
            console.log(err1);
            Session.set('tripData', null);
          } else {
            const trainHeadStations = res1.data;
            tripData.trainHeadStations = {};
            for(let i = 0; i < trainHeadStations.length; i++) {
              const abbr = trainHeadStations[i].root.stations[0].station[0].abbr[0];
              tripData.trainHeadStations[abbr] = trainHeadStations[i];
            }

            HTTP.post('/api/routes/', {
              data: tripData.scheduledTrips,
            }, function (err2, res2) {
              if(err2) {
                console.log(err2);
                Session.set('tripData', null);
              } else {
                const routes = res2.data;
                tripData.routes = {};
                for(let i = 0; i < routes.length; i++) {
                  const routeID = routes[i].root.routes[0].route[0].routeID[0];
                  tripData.routes[routeID] = routes[i];
                }

                Session.set('tripData', tripData);

                $('#btn-trip-go').prop('disabled', false).html(preHTML);

                setTimeout(function () {
                  $(window.countDownIntervalIds).each(function (item, i) {
                    clearInterval(item);
                  });

                  $('[data-countdown]').each(function() {
                    var $this = $(this);

                    var finalDate = moment($this.data('countdown'), 'YYYY/MM/DD HH:mm:ss');
                    var now = moment(new Date(), 'YYYY/MM/DD HH:mm:ss');
                    var diff = finalDate.format('X') - now.format('X');
                    var duration = moment.duration(diff * 1000, 'milliseconds');
                    var interval = 1000;

                    window.countDownIntervalIds.push(setInterval(function () {
                      if(duration - interval !== 0) {
                        duration = moment.duration(duration - interval, 'milliseconds');
                        $this.html(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds());
                      }
                    }, interval));
                  });
                }, 100);

              }
            });
          }
        });
      }
    });
  },
});
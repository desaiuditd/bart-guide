/**
 * Created by udit on 3/3/17.
 */

import "./trips.html";

Session.setDefault('stations', []);

Template.App_trips.helpers({
  stations: function () {
    return Session.get('stations');
  },
});

Template.App_trips.onRendered(() => {

  $('#source, #destination').select2({
    placeholder: 'Select Station',
    allowClear: true,
  });

  HTTP.get('/api/stations/', function (err, response) {
    if(err) {
      console.log(err);
    } else {
      Session.set('stations', response.data.root.stations[0].station);
    }
    return;
  });

  Session.set('tripData', {});
});

Template.App_trips.events({
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

    const preHTML = $('#btn-trip-go').html();
    $('#btn-trip-go').prop('disabled', 'disabled').html('<i class="fa fa-spinner fa-spin fa-fw"></i>');

    HTTP.get('/api/trips/' + source + '/' + destination + '/', function (err, response) {
      if(err) {
        console.log(err);
      } else {
        Session.set('tripData', response.data);
      }
      $('#btn-trip-go').prop('disabled', false).html(preHTML);
    });
  },
});
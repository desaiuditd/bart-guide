import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/privacy/privacy.js';
import '../../ui/pages/terms/terms.js';
import '../../ui/pages/stations/stations.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.route('/privacy', {
  name: 'App.privacy',
  action() {
    BlazeLayout.render('App_body', { main: 'App_privacy' });
  },
});

FlowRouter.route('/terms-of-use', {
  name: 'App.terms',
  action() {
    BlazeLayout.render('App_body', { main: 'App_terms' });
  },
});
FlowRouter.route('/stations', {
  name: 'App.stations',
  action() {
    BlazeLayout.render('App_body', { main: 'App_stations' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};

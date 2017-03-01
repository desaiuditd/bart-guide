// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
// import { Links } from '../../api/links/links.js';

Meteor.startup(() => {
  // add initial setup data here

  // Enable cross origin requests for all endpoints
  JsonRoutes.setResponseHeaders({
    "Cache-Control": "no-store",
    "Pragma": "no-cache",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
  });
});

// Import client startup through a single index entry point

// bootstrap
import '../../ui/js/bootstrap/bootstrap.js';
import '../../ui/js/pushmenu.js';

import './routes.js';

import './common-helpers.js';

Meteor.startup(function() {
  if (typeof GoogleMaps !== 'undefined') {
    GoogleMaps.load({
      v: '3',
      key: 'AIzaSyDlCnbdnZ2iFpw-Hr9fV-65cqDH_KSfckw',
      libraries: 'geometry,places,drawing,visualization',
    });
  }
});
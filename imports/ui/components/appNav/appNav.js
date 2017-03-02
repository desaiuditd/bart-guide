/**
 * Created by udit on 2/28/17.
 */

import { Session } from 'meteor/session'
import "./appNav.html";

Template.appNav.onRendered(() => {
  let visitCount = Session.get('visitCount');

  if(typeof visitCount === 'undefined') {
    Session.setPersistent('visitCount', 0);
  }

  visitCount = Session.get('visitCount');
  Session.update('visitCount', ++visitCount);
});

Template.appNav.helpers({
  visitCount: function () {
    const visitCount = Session.get('visitCount');
    return typeof visitCount === 'undefined' ? 0 : visitCount;
  },
});
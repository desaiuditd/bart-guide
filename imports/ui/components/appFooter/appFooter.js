/**
 * Created by udit on 2/28/17.
 */

import "./appFooter.html";

Template.appFooter.helpers({
  currentYear: function () {
    return new Date().getFullYear();
  },
});
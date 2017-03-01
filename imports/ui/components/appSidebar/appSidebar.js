/**
 * Created by udit on 2/28/17.
 */

import "./appSidebar.html";

Template.appSidebar.onRendered(() => {
  const tmpl = Template.instance();

  $('#slide-submenu').on('click', () => {
    const _this = tmpl.find('#slide-submenu');
    $(_this).closest('.list-group').fadeOut('slide', () => {
      $('.mini-submenu').fadeIn();
    });
  });

});

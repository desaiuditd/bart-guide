import './body.html';

Template.App_body.onRendered(() => {
  $('body').addClass('sidebar-mini skin-bart fixed');
  $('.content-wrapper').css('margin-bottom', $('.navbar-fixed-bottom').outerHeight());
});

Template.App_body.events({
  'click .main-sidebar .sidebar-menu li a': () => {
    if (!$('body').hasClass('sidebar-collapse') && is.mobile()) {
      $('a[data-toggle="offcanvas"]').click();
    }
  },
});
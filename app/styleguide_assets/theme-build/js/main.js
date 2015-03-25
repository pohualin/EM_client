var jQuery_no_conflict = $.noConflict(true);

/* ==========================================================
 * app.js
 * Angular app
 *
 * Author: Yann Gouffon, hello@yago.io
 *
 * Copyright 2014 Yann Gouffon
 * Licensed under MIT
 ========================================================== */

(function(){
  var app = angular.module('cortana', [
    'mgcrea.ngStrap',
    'emmi.typeahead',
    'ngTagsInput',
    'emmi.inputMask',
    'angularMoment',
    'emmi-angular-multiselect',
    'truncate'
  ]);

  app.controller('MainController', function($scope) {
    // For Popover example
    $scope.popover = {
      "title": "This thing already exists...",
      "content": "The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog."
    };
    // For Typeahead examples
    $scope.selectedState = "";
    $scope.states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
    // For Typeahead examples
    $scope.selectedName = "";
    $scope.names = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
  });

})();
/* ==========================================================
 * sidenav.js
 * Side nav init script
 *
 * Author: Yann Gouffon, hello@yago.io
 *
 * Copyright 2014 Yann Gouffon
 * Licensed under MIT
 ========================================================== */

(function($) {
  $(window).load(function() {
    var cortanaSlidebars = new $.slidebars();
    // $(window).load(function () {
    //   cortanaSlidebars.open('left');
    // });
    $('#open-left').on('click', function(event) {
      event.preventDefault();
      cortanaSlidebars.toggle('left');
    });

  });
}) (jQuery_no_conflict);

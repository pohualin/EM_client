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
    'emmi.chosen',
    'ngTagsInput',
    'emmi.inputMask',
    'angularMoment',
    'emmi-angular-multiselect',
    'truncate'
  ])

  .config(function ($datepickerProvider) {

    // ensure dates are compatible with back-end
    angular.extend($datepickerProvider.defaults, {
        dateFormat: 'MM/dd/yyyy',
        modelDateFormat: 'yyyy-MM-dd',
        dateType: 'string',
        iconLeft: 'fa-angle-left',
        iconRight: 'fa-angle-right'
    });

  });

  app.controller('MainController', function($scope) {

    // For Popover example
    $scope.popover = {
      'title': 'This thing already exists...',
      'content': 'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog.'
    };

    // For Typeahead examples
    $scope.selectedState = '';
    $scope.states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Dakota','North Carolina','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
    // For Typeahead examples
    $scope.selectedName = '';
    $scope.names = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Dakota','North Carolina','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

    // For Accordion examples
    $scope.panels = [
      {
        'title': 'Collapsible Group Item #1',
        'body': 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.'
      },
      {
        'title': 'Collapsible Group Item #2',
        'body': 'Food truck fixie locavore, accusamus mcsweeney\'s marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee.'
      },
      {
        'title': 'Collapsible Group Item #3',
        'body': 'Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney\'s organic lomo retro fanny pack lo-fi farm-to-table readymade.'
      },
      {
        'title': 'Collapsible Group Item #4',
        'body': 'Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid.'
      }
    ];
    $scope.panels.activePanels = [];

    // For Datepicker example
    $scope.selectedDate;

    // For Program Card example
    $scope.programCard1 = {};
    //$scope.programCard1.provider = '';
    $scope.providerCardProviders = [
        {
            'name': 'Doogie Howser, M.D.'
        },
        {
            'name': 'Dr. Quinn Medicine Woman'
        },
        {
            'name': 'Dr. Nick'
        }
    ];
    $scope.providerCardLocations = [
        {
            'name': 'Central City Clinic'
        },
        {
            'name': 'Jurassic Park'
        },
        {
            'name': 'Neverland'
        }
    ];

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
  // Stylesheet selector
  function setActiveStyleSheet(title) {
    var i, a, main;
    for(i=0; (a = document.getElementsByTagName('link')[i]); i++) {
      if(a.getAttribute('rel').indexOf('style') != -1 && a.getAttribute('title')) {
        a.disabled = true;
        if(a.getAttribute('title') == title) a.disabled = false;
      }
    }
  }
  function getPreferredStyleSheet() {
    var i, a;
    for(i=0; (a = document.getElementsByTagName('link')[i]); i++) {
      if(a.getAttribute('rel').indexOf('style') != -1
         && a.getAttribute('rel').indexOf('alt') == -1
         && a.getAttribute('title')
         ) return a.getAttribute('title');
    }
    return null;
  }
  var stylesheetCookie = document.cookie.replace(/(?:(?:^|.*;\s*)theme\s*\=\s*([^;]*).*$)|^.*$/, '$1'),
      stylesheetSelector = $('#style-selector');
  stylesheetSelector.on('change', function(e){
    var newSource = $(this).val();
    document.cookie = 'theme='+newSource;
    setActiveStyleSheet(newSource);
  });
  if (stylesheetCookie && stylesheetCookie.length && stylesheetCookie !== 'null') {
    stylesheetSelector.val(stylesheetCookie).trigger('change');
  } else {
    setActiveStyleSheet(getPreferredStyleSheet());
  }
}) (jQuery_no_conflict);

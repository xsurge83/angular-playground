'use strict';

/**
 * @ngdoc function
 * @name myAngularAppApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the myAngularAppApp
 */
angular.module('myAngularApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

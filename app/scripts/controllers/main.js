'use strict';

/**
 * @ngdoc function
 * @name myAngularAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myAngularAppApp
 */
angular.module('myAngularAppApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name myAngularAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myAngularApp
 */
angular.module('myAngularApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

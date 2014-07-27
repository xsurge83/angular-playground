'use strict';

/**
 * @ngdoc directive
 * @name myAngularAppApp.directive:tabs
 * @description
 * # tabs
 */
angular.module('myAngularApp.directives.navSwipe', [])

  .directive('navSwipe', function ($swipe, $window) {
    var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame;

    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function ($scope) {
        var _panes = $scope.panes = [],
          _currentIndex = 0;
        $scope.direction = 'go-right';

        /***
         *
         * @param {Object|number} pane
         */
        $scope.select = function (pane) {
          var selectedIndex;
          if (angular.isNumber(pane)) {
            pane = _panes[pane];
          }
          if (pane) {
            selectedIndex = _panes.indexOf(pane);
            $scope.direction = selectedIndex < _currentIndex ? 'go-right' : 'go-left';

            angular.forEach(_panes, function (pane) {
              pane.selected = false;
            });

            pane.selected = true;
            _currentIndex = selectedIndex;
          }
        };

        $scope.swipeLeft = function () {
          $scope.select(_currentIndex + 1)
        };

        $scope.swipeRight = function () {
          $scope.select(_currentIndex - 1);
        };

        this.addPane = function (pane) {
          if (_panes.length === 0) {
            $scope.select(pane);
          }
          _panes.push(pane);
        };
      },
      link : function(scope, element){
        var offset = 0,
          startX,
          swipeMoved;
        function scroll(x) {
          // use CSS 3D transform to move the carousel
          if (isNaN(x)) {
            x = scope.carouselIndex * containerWidth;
          }

          offset = x;
          var move = -Math.round(offset);
          move += (scope.carouselBufferIndex * containerWidth);

          if(!is3dAvailable) {
            element[0].style[transformProperty] = 'translate(' + move + 'px, 0)';
          } else {
            element[0].style[transformProperty] = 'translate3d(' + move + 'px, 0, 0)';
          }
        }

        function swipeMove(coords, event) {
          //console.log('swipeMove', coords, event);
          var x, delta;
          if (pressed) {
            x = coords.x;
            delta = startX - x;
            if (delta > 2 || delta < -2) {
              swipeMoved = true;
              startX = x;

              /* We are using raf.js, a requestAnimationFrame polyfill, so
               this will work on IE9 */
              requestAnimationFrame(function() {
                scroll(capPosition(offset + delta));
              });
            }
          }
          return false;
        }




        $swipe.bind(element, {

        })

      },
      templateUrl: '../../../views/navSwipe/nav-swipe.html'
    };
  })
  .directive('swipeContent', function () {
    return {
      require: '^navSwipe',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        title: '@'
      },
      link: function (scope, element, attrs, navSwipeCtrl) {
        navSwipeCtrl.addPane(scope);
      },
      templateUrl: '../../../views/navSwipe/swipe-content.html'
    };
  });


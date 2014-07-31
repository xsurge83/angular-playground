'use strict';
(function (angular) {

  function NavSwipeCtrl($scope) {
    var _panes = $scope.panes = [];
    $scope.currentIndex = 0;
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
        $scope.direction = selectedIndex < $scope.currentIndex ? 'go-right' : 'go-left';

        angular.forEach(_panes, function (pane) {
          pane.selected = false;
        });

        pane.selected = true;
        $scope.currentIndex = selectedIndex;
        $scope.swipeToNextIndex(selectedIndex);
      }
    };

    this.addPane = function (pane) {
      _panes.push(pane);
      if (_panes.length === 0) {
        $scope.select(pane);
      }

    };
  }

  function navSwipeDirective($swipe) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: 'NavSwipeCtrl',
      link: function (scope, element) {
        var _startX = 0, _offsetX = 0;
        var _containerWidth = element.find('.swipe-content-container')[0]
          .getBoundingClientRect().width;

        var _maxOffsetX = _containerWidth * (scope.panes.length - 1);

        var $swipeContentListEl = element.find('.swipe-content-list');

        scope.swipeToNextIndex = function swipeToNextIndex(newIndex, oldIndex) {
          console.log('newIndex ' + newIndex, 'oldIndex ' + oldIndex);
          var width;
          if (newIndex !== oldIndex) {
            width = getSwipeContentWidth();
            _offsetX = -(width * newIndex);
            performTranslateX(_offsetX, 1000);
          }
        };

        scope.$watch('currentIndex', function (newValue, oldValue) {
          if (newValue >= 0) {
            swipeToNextIndex(newValue, oldValue);
          }
        });

        /**
         * Get swipe content - assumes all swipe content div are the same
         * @returns {Number}
         */
        function getSwipeContentWidth() {
          return $swipeContentListEl.children()[0].getBoundingClientRect().width;
        }

        function performTranslateX(offsetX, duration) {
          console.log('performTranslateX:offsetX ' + offsetX);
          if (!angular.isDefined(duration)) {
            duration = 1;
          }
          $swipeContentListEl
            .velocity({ translateX: offsetX }, duration, "ease");
        }

        function swipeStart(coords) {
          _startX = coords.x;
        }

        function swipeEnd(coords) {
          console.log('end ' + coords.x);
          var scrollDiff = _startX - coords.x;
          var curMin = Math.round(-((scope.currentIndex) * _containerWidth));
          var prevIndex = scope.currentIndex;
          var offsetWithScroll = Math.round(_offsetX) - scrollDiff;

          if (offsetWithScroll <= curMin && _offsetX!==0) {

            // go next
            scope.select(scope.currentIndex + 1);
          } else if (offsetWithScroll > curMin) {

            // go prev
            scope.select(scope.currentIndex - 1);
          }
          swipeToNextIndex(scope.currentIndex, prevIndex);

        }

        function swipeMove(coords) {
          var delta = Math.round(coords.x - _startX);

          if (delta > 2 || delta < -2) {

            // check for left and right limits
            if ((_offsetX <= 0) && _offsetX >= -(_maxOffsetX)) {
              _startX = Math.round(coords.x);
              _offsetX += delta;

              if (_offsetX > 0) {
                _offsetX = 0;
              } else if (_offsetX <= -(_maxOffsetX)) {
                _offsetX = -_maxOffsetX;
              }
              performTranslateX(_offsetX, 10);
            }
          }
        }

        $swipe.bind($swipeContentListEl, {
          start: swipeStart,
          move: swipeMove,
          end: swipeEnd,
          cancel: function (event) {
            swipeEnd({}, event);
          }
        });

      },
      templateUrl: '../../../views/navSwipe/nav-swipe.html'
    };
  }

  function swipeContentDirective() {
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
  }

  /**
   * @ngdoc directive
   * @name myAngularAppApp.directives.navSwipe
   * @description
   *
   */
  angular.module('myAngularApp.directives.navSwipe', [])

    .controller('NavSwipeCtrl', ['$scope', NavSwipeCtrl])

    .directive('navSwipe', ['$swipe', navSwipeDirective])

    .directive('swipeContent', swipeContentDirective);

})(angular);

/**
 * @ngdoc directive
 * @module plex
 * @name plex-filter
 * @description
 * Permite aplicar filtros a elementos ```input```
 *
 * @example
    <example module="app" deps="" animate="false">
    <file name="index.html">
      <div ng-controller="ExampleController">
        <input type="text" plex-filter="date:'dd / MMMM'" ng-model="fecha" ng-disabled="true" plex />
      </div>
    </file>
    <file name="main.js">
      angular.module('app').controller('ExampleController', function($scope){
          $scope.fecha = new Date();
      });
    </file>
    </example>
**/
angular.module('plex').directive("plexFilter", ["$filter", function ($filter) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelController) {
            if (attrs.plexFilter) {
                var index = attrs.plexFilter.indexOf(":");
                var filterName = index < 0 ? attrs.plexFilter : attrs.plexFilter.substr(0, index).trim();
                var filterParam = index < 0 ? undefined : eval(attrs.plexFilter.substr(index + 1).trim());
                var filter = $filter(filterName);
                ngModelController.$formatters.push(function (data) {
                    return filter(data, filterParam);
                });
            }
        }
    };
}]);

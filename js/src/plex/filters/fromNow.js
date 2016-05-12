/**
 * @ngdoc filter
 * @module plex
 * @name fromNow
 * @description
* Muestra el tiempo transcurrido desde la fecha indicada utilizando Moment.JS (http://momentjs.com/)
 *
 * @param {Date} date Fecha
 * @param {bool} ignorePrefix Si es ```true``` indica que no debe agregar el prefijo "Hace..." (ej: Hace 20 días)
 * @example
    <example module="app" deps="" animate="false">
      <file name="index.html">
        <div ng-controller="ExampleController">
          <h3>Utilizando el prefijo<h3>
          <pre>{{fecha | fromNow}}</pre>
          <h3>Sin prefijo<h3>
          <pre>Tiempo transcurrido: {{fecha | fromNow:true}}</pre>
        </div>
      </file>
      <file name="main.js">
        angular.module('app').controller('ExampleController', function ($scope) {
          $scope.fecha = new Date(2010, 1, 1);
        });
      </file>
    </example>
 **/
angular.module('plex').filter('fromNow', function () {
    return function (date, ignorePrefix) {
        /*
            Parámetros:
            - date: fecha a formatear
            - ignorePrefix: si es true, indica que no debe agregar el prefijo "Hace..." (ej: Hace 20 días)
        */
        if (date)
            return moment(date).locale('es').fromNow(ignorePrefix);
        else
            return "";
    };
});

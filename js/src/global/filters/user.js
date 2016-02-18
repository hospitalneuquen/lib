'use strict'

/**
 * @ngdoc filter
 * @module global
 * @name user
 * @description
 * Filtro para mostrar datos de un usuario
 *
 * @param {Object} persona Instancia de usuario
 * @param {string} formato Formato
 *
 * Puede ser uno de los siguientes valores:
 *   - `na`: Muestra el nombre y apellido (valor por defecto)
 *   - `an`: Muestra el apellido y nombre
 * @param {Boolean} messageIfNull Si ```true``` muestra un mensaje si el usuario no existe
 **/
angular.module('global').filter('user', ['$filter', function ($filter) {
    return function (user, format, messageIfNull) {
        // Formato default: ns
        // Ejemplo de formato: "sn" --> Surname + Name
        if (!user || user.id == 0)
            return messageIfNull ? "Usuario no registrado" : undefined;
        else {
            switch (format) {
                case "an":
                case "sn":
                    return user.familyName + ", " + user.familyName;
                    break;
                default:
                    return user.name;
            }
        }
    }
}]);

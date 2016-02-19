'use strict';

/**
 * @ngdoc service
 * @module global
 * @name Session
 * @description
 * Servicio de gestión de sesión de usuario.
 *
 * Notas: actualmente sólo soporta autenticación con SSO, pero podrían implementarse otros métodos a través un mecanismo de herencia. (Ver http://blog.mgechev.com/2013/12/18/inheritance-services-controllers-in-angularjs/ )
 **/
angular.module('global').factory('Session', ['$rootScope', '$q', '$http', '$window', 'jwtHelper', function($rootScope, $q, $http, $window, jwtHelper) {
    var self = {
        state: 'inactive', // Estado de la sesión: inactive, active, locked. Se inicializa en init().
        id: null, // Identificador de la sesión. Se inicializa en init().
        user: null, // Datos del usuario. Se inicializa en init().
        permissions: null, // Permisos del usuario. Se inicializa en init().
        variables: null, // Variables asociadas al usuario. Se inicializa en init().
        settings: {
            //plexSkin: 'cosmo',

            /**
             *
             * @ngdoc method
             * @name Session#settings.load
             * @param {String} name Nombre del setting
             * @description Carga un setting de usuario desde el backend. Una vez finalizado actualiza la entrada ```Session.settings[{name}]``` con el valor.
             * @returns {Promise} Promise
             **/
            load: function(name) {
                self.api.getSetting(name).then(function(value) {
                    self.settings[name] = value;
                    return value;
                })
            },

            /**
             *
             * @ngdoc method
             * @name Session#settings.set
             * @param {String} name Nombre del setting
             * @description Guarda un setting de usuario en el backend. Una vez finalizado actualiza la entrada ```Session.settings[{name}]``` con el nuevo valor.
             * @returns {Promise} Promise
             **/
            set: function(setting, value) {
                self.api.setSetting(setting, value).then(function(value) {
                    self.settings[setting] = value;
                    return value;
                })
            }
        },

        /**
         *
         * @ngdoc method
         * @name Session#isActive
         * @description Devuelve ```true``` si el usuario inició sesión y no está bloqueada
         **/
        isActive: function() {
            if (self.state == 'inactive') {
                // Inicia la sesión desde un token almacenado (si existe)
                self.login($window.sessionStorage.jwt);
            }
            return self.state == 'active';
        },

        /**
         *
         * @ngdoc method
         * @name Session#reset
         * @description Cierra la sesión actual
         **/
        logout: function() {
            self.state = 'inactive';
            self.id = null;
            self.user = null;
            self.permissions = null;
            self.variables = null;
            delete $window.sessionStorage.jwt;
        },

        /**
         *
         * @ngdoc method
         * @name Session#login
         * @param {Object} data Datos de la sesión
         * @description Inicializa la sesión con los datos suministrados
         **/
        login: function(token) {
            self.logout();

            // Json Web Token (JWT)
            if (token) {
                try {
                    if (!jwtHelper.isTokenExpired(token)) {
                        var payload = jwtHelper.decodeToken(token);

                        self.user = {
                            name: payload.name,
                            givenName: payload.given_name,
                            familyNane: payload.family_name,
                            picture: payload.picture,
                            username: payload.username,
                        };
                        self.variables = payload.scope.variables;
                        self.permissions = payload.scope.permissions;

                        // Login OK
                        $window.sessionStorage.jwt = token;
                        self.state = 'active';
                    }
                } catch (e) {
                    // El token no es válido
                }
            }
        },

        /**
         *
         * @ngdoc method
         * @name Session#authRequest
         * @param {Object} request Request
         * @description Configura un request http con tokens de autenticación
         **/
        authRequest: function(request) {
            if (sessionStorage.jwt) {
                if (!request.headers)
                    request.headers = {};

                request.headers.Authorization = "JWT " + sessionStorage.jwt;
            }
            return request;
        },
        api: { // Encapsula llamadas a la API
            login: function(data) {
                return $http.post('/auth/login', data).then(function(response) {
                    return response && response.data;
                });
            },
            getSetting: function(setting) {
                return $http.get('/auth/settings/' + setting).then(function(response) {
                    return (response && response.data) || response;
                });
            },
            setSetting: function(setting, value) {
                return $http.post('/auth/settings/' + setting, {
                    value: value
                }).then(function(response) {
                    return response && response.data;
                });
            }
        }
    };

    return self;
}]);

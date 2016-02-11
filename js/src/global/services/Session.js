'use strict';

/**
 * @ngdoc service
 * @module global
 * @name Session
 * @description
 * Servicio de gestión de sesión de usuario. Soporta diferentes tipos de autenticación
 **/
angular.module('global').factory('Session', ['$rootScope', '$http', '$timeout', function($rootScope, $http, $timeout) {
    var self = {
        // Datos básicos de la sesión
        id: 'ABCDEFGHI', // Identificador de la sesión
        state: 0, // 0 = Inactiva, 1 = Activa, 2 = Bloqueada
        user: {
            id: 12345, // Identificador del usuario
            firstName: 'María Eugenia', // Nombre del usuario
            lastName: 'García', // Apellido del usuario
            username: 'mgarcia', // Nombre de usuario
        },
        settings: {
            plexSkin: 'cosmo'
        },
        profile: { // Datos de perfil del usuario. Este objeto es utilizado por otros servicios y controladores para establecer datos comunes para las aplicaciones
            perfil: 'medico',
            ubicaciones: [{
                id: 'CM',
                nombre: 'Clínica Médica',
            }, {
                id: 'CQ',
                nombre: 'Clínica Quirúrgica'
            }],
            idProfesional: 12345,
        },
        // _initCache: null,
        // init: function() {
        //     if (!self._initCache)
        //         self._initCache = $http.get('/api/sso/sessions/current').then(function(response) {
        //             self.session = response.data;
        //         })
        //     return self._initCache;
        // },
        // menu: function(applicationId) {
        //     return $http.get('/api/sso/users/current/menu/' + applicationId).then(function(response) {
        //         return (response && response.data) || response;
        //     });
        // },
        // settings: {
        //     get: function(setting) {
        //         return $http.get('/api/sso/users/current/settings/' + setting).then(function(response) {
        //             return (response && response.data) || response;
        //         });
        //     },
        //     post: function(setting, value) {
        //         return $http.post('/api/sso/users/current/settings/' + setting, {
        //             value: value
        //         }).then(function(response) {
        //             return (response && response.data) || response;
        //         });
        //     }
        // },
        // lock: function() {
        //     self.waitForUnlock();
        //     return $http.post('/api/sso/sessions/current/lock').then(function(response) {
        //         angular.extend(self.session, response.data);
        //         $rootScope.$broadcast('sso-lock');
        //         return response.data;
        //     });
        // },
        // unlock: function(password) {
        //     self.waitForUnlock(true);
        //     return $http.post('/api/sso/sessions/current/unlock', {
        //         password: password
        //     }).then(function(response) {
        //         angular.extend(self.session, response.data);
        //         $rootScope.$broadcast('sso-unlock');
        //         return response.data;
        //     }).catch(function(e) {
        //         // Falló el unlock, por lo que seguimos esperando
        //         self.waitForUnlock();
        //         throw e;
        //     });
        // },
        // _waitForUnlockTimer: null,
        // waitForUnlock: function(cancel) {
        //     // Observa si la sesión se desbloqueó (por ejemplo, desde otro tab en el browser)
        //     if (!cancel) {
        //         self._waitForUnlockTimer = $timeout(function() {
        //             $http.get('/api/sso/sessions/current/state').then(function(response) {
        //                 if (response && response.data == 0) {
        //                     // Si todavía no fue cancelada ...
        //                     if (self._waitForUnlockTimer) {
        //                         self.waitForUnlock(true);
        //                         $rootScope.$broadcast('sso-unlock');
        //                     }
        //                 } else {
        //                     self.waitForUnlock();
        //                 }
        //             })
        //         }, 1000);
        //     } else {
        //         if (self._waitForUnlockTimer) {
        //             $timeout.cancel(self._waitForUnlockTimer);
        //             self._waitForUnlockTimer = null;
        //         }
        //     }
        // },
    };
    return self;
}]);

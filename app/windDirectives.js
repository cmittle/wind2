//angular.module('windDirectives', [])

app
.directive("testDirective", function () {
    return {
        template: 'Name: {{customer.name}} Address: {{customer.address}}'
    };
})

.directive("testDirective2", function () {
    return {
        template: 'Name: TEST DIRECTIVE 2 Address: {{towerModel}}',
        scope: {
        	towerModel: '@model'
        }
    };
})


.directive('gearboxSeals', function () {
    'use strict';
    return {
        restrict: 'E',
        controller: 'gearboxSealsCtrl', //I can probably copy a lot from gearboxSpecifics2.js....
        scope: {
            gbxModel: '@model'
        },
        //template: 'Name: GEARBOX SEALS DIRECTIVE Address: {{gbxModel}}'
        templateUrl: 'partials/gearbox_seals.html'  //Copying gearbox_specifics2.html and modifying for seals
    };
})

.directive('mainSeals', function () {
    'use strict';
    return {
        restrict: 'E',
        controller: 'mainSealsCtrl', //copied from gearboxSealsCtrl intially
        scope: {
            towerModel: '@model',  //variable name in scope is towerModel (value on left side of this statement)
            towerMfg: '@mfg'
        },
        templateUrl: 'partials/main_seals.html'  //copied from gearboxSealsCtrl intially
    };
})

.directive('gearboxBearings', function () {
    'use strict';
    return {
        restrict: 'E',
        controller: 'gearboxBearingsSpecificCtrl', //I copied existing gearboxSpecifics2.js and changed url variable to pull from directive attribute rather than url
        scope: {
            gbxModel: '@model'  //variable name in scope is gbxModel (value on left side of this statement)
        },
        templateUrl: 'partials/gearbox_specifics2.html'  //I can probably copy a majority of existing gearboxSpecifics2.html for seals page
    };
})


.directive('gearboxText', function () {
    'use strict';
    return {
        restrict: 'E',
        controller: 'gearboxTextCtrl', 
        scope: {
            gbxModel: '@model', //variable name in scope is gbxModel (value on left side of this statement)
            gbxMfg: '@mfg'  
        },
        templateUrl: 'partials/gearbox_text.html'  //I can probably copy a majority of existing gearboxSpecifics2.html for seals page
    };
})

.directive('mainBearing', function () {
    'use strict';
    return {
        restrict: 'E',
        controller: 'mainBearingSpecificCtrl',
        scope: {
            towerModel: '@model',  //variable name in scope is towerModel (value on left side of this statement)
            towerMfg: '@mfg'
        },
        templateUrl: 'partials/main_bearing.html'  //I can probably copy a majority of existing gearboxSpecifics2.html for seals page
    };
})

.directive('towerText', function () {
    'use strict';
    return {
        restrict: 'E',
        controller: 'towerTextCtrl', 
        scope: {
            towerModel: '@model', //variable name in scope is towerModel (value on left side of this statement)
            towerMfg: '@mfg'  
        },
        templateUrl: 'partials/tower_text.html'
    };
})

.directive('towerMfgText', function () {
    'use strict';
    return {
        restrict: 'E',
        controller: 'towerMfgTextCtrl', 
        scope: {
            //towerModel: '@model', //variable name in scope is towerModel (value on left side of this statement)
            towerMfg: '@mfg'  
        },
        templateUrl: 'partials/tower_mfg_text.html'
    };
})

.directive('gearboxAll', function () {
    'use strict';
    return {
        restrict: 'E',
        //controller: 'ptcMotorController',
        scope: {
            gbxModel: '@model'
        },
        template: 'Name: GEARBOX ALL DIRECTIVE Address: {{customer.address}}'
        //templateUrl: 'lib/cm-ptcalc/ptcmotor.html'  //need to make new template for gearboxAll
    };
}); //only include this semicolon on the last directive in this file



//copied from pcCalc application, leave it here for working sample
/*.directive('ptcMotor', function () {
        'use strict';
        return {
            restrict: 'E',
            controller: 'ptcMotorController',
            scope: {
                motorVrpm: '=outRpm',
                motorOutTorque: '=outTorque',
                motorText: '=motorText'
            },
            templateUrl: 'lib/cm-ptcalc/ptcmotor.html'  //copied all from vfd motor with vertical slider
        };
    });*/
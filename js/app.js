var app = angular.module('app', []);

/**
 * General Controller to prepare options for Directives
 */
app.controller('appController', function ($http, $scope) {
    this.template = '/templates/adItem.html';

    this.style = {};

    // used in template
    this.submit = function() {
        $scope.$broadcast('updateAdvert', this.template );
    };
});

/**
 * Directive to collect Data, and server as an API for children directives to get Advert generated HTML code
 */
app.directive('advertScreen', function ($http, $compile, $q, $log, $templateRequest) {
    return {
        restrict: 'E',
        require: 'advertScreen',
        scope: {
            'style' : '=ngStyle'
        },
        controller: function ($scope) {
            var template;
            var html;

            this.setTemplate = function( templateUrl ) {
                return $templateRequest( templateUrl ).then(function (res) {
                    template = res;
                });
            };

            this.generatedAdvert = function () {
                var compiled = $compile(template)($scope);

                //wrap body and html around;
                var root = document.createElement( 'html');
                root.appendChild( document.createElement( 'head') );
                root.appendChild( document.createElement( 'body') );
                root.querySelector( 'body' ).appendChild( compiled[0] );

                html = root;

                this.addStyle().then( function() {
                    $scope.$emit( 'generateAdvertDone', html );
                });
            };

            this.addStyle = function() {
                var style = document.createElement('style');
                return $http.get('css/ad.css').then(function (res) {
                    style.innerHTML = res.data;
                    html.querySelector('head').appendChild(style);
                }).catch(function(e) {
                    $log.warn( 'style couldnt be fetched' );
                    $log.info( 'Your anti ad software is running, please deactivate. For full experience' );
                    alert( 'Your anti ad software is running, please deactivate. For full experience' );
                    $log.warn( e );
                });
            };
        },
        link: function (scope, element, attribute, advertScreenController) {
            // receive products, resource is controlled by attribute
            $http.get(attribute.resource).then( function (res) {
                scope.products = res.data.products;
            });

            // styling has an update
            scope.$on('updateAdvert', function( event, template ) {
                if( template ) {
                    advertScreenController.setTemplate( template ).then( function( ) {
                        advertScreenController.generatedAdvert();
                    });
                }
            });
        }
    }
});

/**
 * Directive to collect HTML and serve the specific View option of the HTML
 * by setting scope.codeSnipped [NODE}
 */
app.directive('advertView', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attribute) {
            scope.$on( 'generateAdvertDone', function( event, html ) {
                scope.codeSnipped = html;
            });
        }
    }
});

/**
 * specific directive to render HTML in iFrame
 * needs scope.codeSnipped {Node}
 */
app.directive('viewPreview', function ( $timeout ) {
    return {
        restrict: 'A',
        template: '<iframe scrolling="no"></iframe>',
        replace: true,
        link: function (scope, element) {
            var iFrame = element[0].contentWindow;
            scope.$watch( 'codeSnipped', function( newArray ){
                // need timeout otherwise get pre compiled html
                $timeout( function(){
                    if( scope.codeSnipped && scope.codeSnipped.outerHTML ) {
                        iFrame.document.open();
                        iFrame.document.write( newArray.outerHTML );
                        iFrame.document.close();
                    }
                });
            });
        }
    }
});

/**
 * specific directive to display HTML code
 * needs scope.codeSnipped {Node}
 */
app.directive('viewHtml', function() {
    return {
        restrict: 'A',
        template: '<textarea readonly>{{ codeSnipped.outerHTML }}</textarea>',
        replace: true
    }
});

/**
 * directive to apply inline style to advert
 * needs scope.style {Object}
 *
 * @supports
 * css selector
 * css styles ( font-weight = fontWeight )
 * css values
 *
 * @example
 * style : {
 *      '.IamASelector' : {
 *          'backgroundColor' : 'black',
 *          'color' : 'white'
 *      }
 * }
 */
app.directive('advert', function( $timeout ) {
    return {
        restrict: 'C',
        link: function( scope, element ) {
            var elementSelector;
            var targetElement;
            var styleValue;
            var styleProperty;

            // tried scope.$evalAsync to run at least on digest circle
            // however waiting for one digest and rendering works too
            $timeout( function() {
                // O(n)^3
                for( elementSelector in scope.style ) { // iterate trough all styled elements
                    if( scope.style.hasOwnProperty( elementSelector ) ) { // just checking if its own property
                        targetElement = element[0].querySelectorAll( elementSelector ); // apply selector to find all elements
                        if( targetElement.length > 0 ) {
                            for( styleProperty in scope.style[ elementSelector ] ) {  // iterate trough all properties
                                if ( scope.style[ elementSelector ].hasOwnProperty( styleProperty ) ) { // just checking if its own property
                                    styleValue = scope.style[ elementSelector ][ styleProperty ]; // get value from property

                                    Array.prototype.forEach.call( targetElement, function( target ) { // walking trough nodeList
                                        target.style[ styleProperty ] = styleValue; // assign value of property to element
                                    });
                                }
                            }
                        }
                    }
                }
            });
        }
    }
});

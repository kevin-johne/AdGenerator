var app = angular.module('app', []);

app.controller('appController', function ($http, $scope) {
    this.template = '/templates/adItem.html';
    this.submit = function() {
        $scope.$broadcast('updateAdvert', this.template );
    };
});

app.directive('advertScreen', function ($http, $compile, $q, $log, $templateRequest) {
    return {
        restrict: 'E',
        require: 'advertScreen',
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
                    $log.info( 'Maybe anti ad is running, please deactivate');
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

app.directive('viewPreview', function () {
    return {
        restrict: 'A',
        template: '<iframe scrolling="no"></iframe>',
        replace: true,
        link: function (scope, element) {
            var iFrame = element[0].contentWindow;
            scope.$watch( 'codeSnipped', function( newArray ){
                // need timeout otherwise get pre compiled html
                setTimeout( function(){
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

app.directive('viewHtml', function() {
    return {
        restrict: 'A',
        template: '<textarea readonly>{{ codeSnipped.outerHTML }}</textarea>',
        replace: true
    }
});

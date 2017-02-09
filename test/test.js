var assert = require('assert');
require('./test-helper');

// Loads the module we want to test
require('../js/app');

describe('Generating HTML', function() {
    var $httpBackend,
        $rootScope,
        $scope,
        element,
        $compile,
        advertScreenController,
        authRequestHandler;

    var products = '/api/products.json';

    beforeEach(ngModule('app'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $scope = $rootScope.$new();

        authRequestHandler = $httpBackend.when('GET', products)
            .respond(
                {
                    products: [
                        {
                            img: 'basedata:image/jpeg;base64,',
                            name: 'test',
                            url: 'http://www.test.com'
                        },{
                            img: 'basedata:image/jpeg;base64,',
                            name: 'test2',
                            url: 'http://www.test2.com'
                        }
                    ]
                });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('has resource', function() {
        $httpBackend.expectGET(products);
        element = $compile('<advert-screen resource="'+products+'" template="/templates/adItem.html"></advert-screen>')($scope);
        console.log( element[0]);
        assert.equal( element.attr('resource', products ));
    });

    it('has products', function() {
        $httpBackend.expectGET(products);
        element = $compile('<advert-screen resource="'+products+'" template="/templates/adItem.html"></advert-screen>')($scope);
        advertScreenController = element.controller('advertScreen');
        $scope.$digest();
        assert.equal( $scope.products.length, 2 );
        $httpBackend.flush();
    });

});
var assert = require('assert');
require('./test-helper');

// Loads the module we want to test
require('../js/app');

describe('Rendering HTML', function() {

    var products = '/api/products.json';

    beforeEach(ngModule('app'));

    describe('Render Advert HTML View', function() {

        it('should have the TEXTAREA tag', inject(function($rootScope, $compile) {
            var scope = $rootScope.$new();

            var compiled = $compile('<advert-view view-html></advert-view>')(scope);

            assert.equal(compiled.prop('tagName'), 'TEXTAREA');
        }));

        it('should render HTML as text', inject(function ($rootScope, $compile) {
            var scope = $rootScope.$new();
            scope.codeSnipped = document.createElement('div');
            var compiled = $compile('<advert-view view-html></advert-view>')(scope);

            scope.$digest();

            assert.equal(compiled.text(), '<div></div>');
        }));
    });

    describe('Render Advert Preview View', function() {

        it('should have the IFRAME tag', inject(function($rootScope, $compile) {
            var scope = $rootScope.$new();

            var compiled = $compile('<advert-view view-preview></advert-view>')(scope);

            assert.equal(compiled.prop('tagName'), 'IFRAME');
        }));
        
    });
});
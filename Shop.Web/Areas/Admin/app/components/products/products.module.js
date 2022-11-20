﻿
(function () {
    angular.module('shop.products', ['shop.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('products', {
                url: '/products',
                templateUrl: '/Areas/Admin/app/components/products/product_list.view.html',
                controller: 'productListController'
            })
            .state('product_add', {
                url: '/product_add',
                templateUrl: '/Areas/Admin/app/components/products/product_add.view.html',
                controller: 'productAddController'
            })
            .state('product_edit', {
                url: '/product_edit/:id',
                templateUrl: '/Areas/Admin/app/components/products/product_edit.view.html',
                controller: 'productEditController'
            })
            .state('product_details', {
                url: '/product_details/:id',
                templateUrl: '/Areas/Admin/app/components/products/product_details.view.html',
                controller: 'productDetailsController'
            })
    }
})();
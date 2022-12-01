﻿(function (app) {
    app.controller('productDetailsController', productDetailsController);

    productDetailsController.$inject = ['apiService', '$scope', '$state', 'notificationService', '$stateParams', '$timeout', '$q'];

    function productDetailsController(apiService, $scope, $state, notificationService, $stateParams, $timeout, $q) {

        $scope.product = null;
        $scope.moreImages = [];

        $scope.listProductLatest = [];
        $scope.listProductRelated = [];
        $scope.listRootProductCategory = [];
        $scope.listProductCategory = [];

        $scope.getAllProductCategoryChild = getAllProductCategoryChild;
        $scope.checkExistChild = checkExistChild;
        

        $q.all([
            loadProductDetail(),
            getAllRootProductCategory(),
            getAllProductCategory(),

        ]).then(function (result) {
            $scope.product = result[0];
            $scope.moreImages = JSON.parse($scope.product.MoreImages);

            $scope.listRootProductCategory = result[1];
            $scope.listProductCategory = result[2];

            getAllProductRelated($scope.product.CategoryId, 7).then(result => {
                $scope.listProductRelated = result;
                $timeout(init, 0);
            })
        });

        getAllProductLatest(4).then(result => {
            $scope.listProductLatest = result;
        })
        

        function loadProductDetail() {
            var deferred = $q.defer();

            apiService.get(
                'https://localhost:44353/api/product/getbyidinclude/' + $stateParams.id,
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject('lấy product details thất bại.')
                }
            );

            return deferred.promise;
        }

        function getAllProductLatest(size) {
            var deferred = $q.defer();

            var config = {
                params: {
                    size: size
                }
            }

            apiService.get(
                `https://localhost:44353/api/product/getnew`,
                config,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject(`Lấy product new không thành công`);
                }

            );
            return deferred.promise;
        }

        function getAllProductRelated(categoryId, size) {
            var deferred = $q.defer();

            var config = {
                params: {
                    productId: $stateParams.id,
                    categoryId: categoryId,
                    size: size
                }
            }

            apiService.get(
                `https://localhost:44353/api/product/getrelated`,
                config,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject(`Lấy product related không thành công`);
                }

            );
            return deferred.promise;
        }

        function getAllRootProductCategory() {
            var deferred = $q.defer();
            apiService.get(
                'https://localhost:44353/api/productcategory/getallroot',
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject('Lấy root product category không thành công');
                }

            );
            return deferred.promise;
        }

        function getAllProductCategory() {
            var deferred = $q.defer();
            apiService.get(
                'https://localhost:44353/api/productcategory/getallparents',
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject('Lấy product category không thành công');
                }

            );
            return deferred.promise;
        }

        function getAllProductCategoryChild(id) {
            return $scope.listProductCategory.filter(x => x.ParentId == id);
        }

        // kiểm tra product Category id có tồn tại con hay không?
        function checkExistChild(id) {
            return $scope.listProductCategory.some(x => x.ParentId == id);
        }

        // Thêm file js vào cuối body sau khi chạy hết logic angularjs + html/csss
        function init() {
            $("script[src='/assets/client/js/themejs/homepage.js']").remove();
            $("script[src='/assets/client/js/themejs/so_megamenu.js']").remove();
            $("script[src='/assets/client/js/themejs/application.js']").remove();

            $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/homepage.js"></script>');
            $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/so_megamenu.js"></script>');
            $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/application.js"></script>');
        }

    }


})(angular.module('shop.product_details'));



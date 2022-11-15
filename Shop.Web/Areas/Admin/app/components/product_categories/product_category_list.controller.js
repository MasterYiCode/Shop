﻿(function (app) {

    app.controller('productCategoryListController', productCategoryListController);

    productCategoryListController.$inject = ['$scope', 'apiService', 'notificationService', '$ngBootbox'];

    function productCategoryListController($scope, apiService, notificationService, $ngBootbox) {

        $scope.productCategories = [];

        $scope.page = 0;

        $scope.pageSize = 10;

        $scope.pageCount = 0;

        $scope.keyword = '';

        $scope.deleteProductCategory = function (id) {
            $ngBootbox.confirm('Bạn có chắc chắn muốn xóa không?')
                .then(function () {
                    var config = {
                        params: {
                            id: id
                        }
                    };
                    apiService.del(
                        'api/productcategory/delete',
                        config,
                        function () {
                            notificationService.displaySuccess('Xóa danh mục thành công.');
                            search();
                        },
                        function () {
                            notificationService.displayError('Xóa danh mục không thành công.');
                        }
                    )
                }
            );
        }


        $scope.search = function () {
            $scope.getListProductCategory();
        }

        $scope.getListProductCategory = function (page) {
            // params: thông số

            page = page || 0;

            var config = {
                params: {
                    keyword: $scope.keyword,
                    page: page,
                    pageSize: $scope.pageSize,
                }
            }

            apiService.get(
                'https://localhost:44353/api/productcategory/getall',
                config,
                function (result) {
                    if (result.data.TotalCount == 0) {
                        notificationService.displayWarning("Không tồn tại sản phẩm nào")
                    }
                    $scope.productCategories = result.data.Items;
                    $scope.page = result.data.Page;
                    $scope.pageCount = result.data.TotalPages;
                    $scope.totalCount = result.data.TotalCount;
                },
                function (error) {
                    console.log('Lấy danh mục sản phẩm không thành công');
                }
            );
        }

        // Lấy danh sách danh mục sản phẩm
        $scope.getListProductCategory();


    }


})(angular.module('shop.product_categories'));

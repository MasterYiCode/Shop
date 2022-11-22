﻿(function (app) {

    app.controller('slideListController', slideListController);

    slideListController.$inject = ['$scope', 'apiService', 'notificationService', '$ngBootbox', '$filter'];

    function slideListController($scope, apiService, notificationService, $ngBootbox, $filter) {

        $scope.slides = [];

        $scope.page = 0;
        $scope.pageSize = 10;
        $scope.pageCount = 0;
        $scope.keyword = '';

        $scope.isAll = false;

        $scope.deleteSlide = deleteSlide;
        $scope.selectAll = selectAll;
        $scope.deleteMultiple = deleteMultiple;
        $scope.getListSlide = getListSlide;

        function deleteSlide(id) {
            $ngBootbox.confirm('Bạn có chắc chắn muốn xóa không?')
                .then(function () {
                    var config = {
                        params: {
                            id: id
                        }
                    };
                    apiService.del(
                        'https://localhost:44353/api/slide/delete',
                        config,
                        function () {
                            notificationService.displaySuccess('Xóa slide thành công.');
                            $scope.getListSlide();
                        },
                        function () {
                            notificationService.displayError('Xóa slide không thành công.');
                        }
                    )
                }
                );
        }

        function selectAll() {
            if ($scope.isAll) {
                angular.forEach($scope.slides, function (item) {
                    item.checked = false;
                });
                $scope.isAll = false;
            }
            else {
                angular.forEach($scope.slides, function (item) {
                    item.checked = true;
                });
                $scope.isAll = true;
            }
        };

        function deleteMultiple() {
            var listId = [];
            $.each($scope.selected, function (i, item) {
                listId.push(item.Id);
            })
            var config = {
                params: {
                    checkedSlides: JSON.stringify(listId)
                }
            }
            apiService.del(
                'https://localhost:44353/api/slide/deletemultiple',
                config,
                function (result) {
                    notificationService.displaySuccess('Xóa slide thành công.');
                    $scope.search();
                },
                function (error) {
                    notificationService.displaySuccess('Xóa thất bại rùi..., buồn ghê.');
                },
            );
        }

        $scope.$watch("slides", function (newValue, oldValue) {
            // filter (lọc) những giá trị có giá trị mới có checked = true
            var checked = $filter("filter")(newValue, { checked: true })

            if (checked.length) {
                $scope.selected = checked;
                $('#btnDelete').removeAttr('disabled');
            }
            else {
                $('#btnDelete').attr('disabled', 'disabled');
            }
        }, true);


        function getListSlide(page) {
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
                'https://localhost:44353/api/slide/getall',
                config,
                function (result) {
                    if (result.data.TotalCount == 0) {
                        notificationService.displayWarning("Không tồn tại slide nào hết!");
                    }
                    $scope.slides = result.data.Items;
                    $scope.page = result.data.Page;
                    $scope.pageCount = result.data.TotalPages;
                    $scope.totalCount = result.data.TotalCount;
                },
                function (error) {
                    console.log('Lấy danh sách slide không thành công');
                }
            );
        }

        // Lấy danh sách thương hiệu
        $scope.getListSlide();


    }


})(angular.module('shop.brands'));
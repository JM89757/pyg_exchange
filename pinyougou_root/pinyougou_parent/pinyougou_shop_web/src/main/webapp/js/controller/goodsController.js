//控制层
app.controller('goodsController', function ($scope, $controller, $location,
                                            goodsService, uploadService, itemCatService, typeTemplateService
    ) {

        $controller('baseController', {$scope: $scope});//继承

        $scope.updateIsMarketable = function (status) {
            goodsService.updateIsMarketable($scope.selectIds, status).success(
                function (response) {
                    if (response.success) {
                        $scope.reloadList();
                        $scope.selectIds = [];
                    } else {
                        alert(response.message);
                    }
                }
            );
        };


        $scope.save = function () {
            $scope.entity.goodsDesc.introduction = editor.html();

            let serviceObject;
            if ($scope.entity.goods.id != null) {
                serviceObject = goodsService.update($scope.entity);
            } else {
                serviceObject = goodsService.add($scope.entity);
            }
            serviceObject.success(
                function (response) {
                    if (response.success) {
                        alert("保存成功");
                        location.href = 'goods.html';
                    } else {
                        alert(response.message);
                    }
                }
            );
        };


        $scope.checkAttributeValue = function (specName, optionName) {
            let items = $scope.entity.goodsDesc.specificationItems;
            let object = $scope.searchObjectByKey(items, 'attributeName', specName);

            if (object) {
                return object.attributeValue.indexOf(optionName) >= 0;
            } else {
                return false;
            }
        };


        $scope.findOne = function () {
            let id = $location.search()['id'];
            if (id == null) {
                return;
            }
            goodsService.findOne(id).success(
                function (response) {
                    $scope.entity = response;
                    editor.html($scope.entity.goodsDesc.introduction);
                    $scope.entity.goodsDesc.itemImages = JSON.parse($scope.entity.goodsDesc.itemImages);
                    $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.entity.goodsDesc.customAttributeItems);
                    $scope.entity.goodsDesc.specificationItems = JSON.parse($scope.entity.goodsDesc.specificationItems);

                    for (let i = 0; i < $scope.entity.itemList.length; i++) {
                        $scope.entity.itemList[i].spec = JSON.parse($scope.entity.itemList[i].spec);
                    }
                }
            );
        };

        // $scope.status = ['未审核', '已审核', '审核未通过', '已关闭'];
        $scope.status = ['商品上架', '商品下架'];

        $scope.itemCatList = [];

        $scope.findItemCatList = function () {
            itemCatService.findAll().success(
                function (response) {
                    for (let i = 0; i < response.length; i++) {
                        $scope.itemCatList[response[i].id] = response[i].name;
                    }
                });
        };

        $scope.selectItemCat1List = function () {
            itemCatService.findByParentId(0).success(
                function (response) {
                    $scope.itemCat1List = response;

                }
            );
        };

        $scope.$watch('entity.goods.category1Id', function (newValue, oldValue) {
            itemCatService.findByParentId(newValue).success(
                function (response) {
                    $scope.itemCat2List = response;

                }
            );
        });

        $scope.$watch('entity.goods.category2Id', function (newValue, oldValue) {
            itemCatService.findByParentId(newValue).success(
                function (response) {
                    $scope.itemCat3List = response;

                }
            );
        });


        $scope.$watch('entity.goods.category3Id', function (newValue, oldValue) {
            itemCatService.findOne(newValue).success(
                function (response) {
                    $scope.entity.goods.typeTemplateId = response.typeId;

                }
            );
        });


        $scope.$watch('entity.goods.typeTemplateId', function (newValue, oldValue) {
            typeTemplateService.findOne(newValue).success(
                function (response) {
                    $scope.typeTemplate = response;
                    $scope.typeTemplate.brandIds = JSON.parse($scope.typeTemplate.brandIds);
                    if ($location.search()['id'] == null) {
                        $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.typeTemplate.customAttributeItems);
                    }
                }
            );

            typeTemplateService.findSpecList(newValue).success(
                function (response) {
                    $scope.specList = response;
                }
            );


        });


        $scope.uploadFile = function () {
            uploadService.uploadFile().success(
                function (response) {
                    if (response.success) {
                        $scope.image_entity.url = response.message;
                    } else {
                        alert(response.message)
                    }
                }).error(function () {
                alert("Failure");
            });
        };

        $scope.entity = {goods: {}, goodsDesc: {itemImages: [], specificationItems: []}};

        $scope.add_image_entity = function () {
            $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
        };

        $scope.remove_image_entity = function (index) {
            $scope.entity.goodsDesc.itemImages.splice(index, 1);
        };


        $scope.updateSpecAttribute = function ($event, name, value) {
            let object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems, 'attributeName', name);

            if (object) {
                if ($event.target.checked) {
                    object.attributeValue.push(value);
                } else {
                    object.attributeValue.splice(object.attributeValue.indexOf(value), 1);
                    if (object.attributeValue.length === 0) {
                        $scope.entity.goodsDesc.specificationItems.splice(
                            $scope.entity.goodsDesc.specificationItems.indexOf(object), 1);
                    }

                }
            } else {
                $scope.entity.goodsDesc.specificationItems.push({"attributeName": name, "attributeValue": [value]});
            }
        };


        $scope.createItemList = function () {

            $scope.entity.itemList = [{spec: {}, price: 0, num: 99999, status: '0', isDefault: '0'}];

            let items = $scope.entity.goodsDesc.specificationItems;

            for (let i = 0; i < items.length; i++) {
                $scope.entity.itemList = addColumn($scope.entity.itemList, items[i].attributeName, items[i].attributeValue);
            }

        };

        let addColumn = function (list, columnName, columnValues) {

            let newList = [];
            for (let i = 0; i < list.length; i++) {
                let oldRow = list[i];
                for (let j = 0; j < columnValues.length; j++) {
                    let newRow = JSON.parse(JSON.stringify(oldRow));
                    newRow.spec[columnName] = columnValues[j];
                    newList.push(newRow);
                }
            }
            return newList;
        };

        $scope.add = function () {
            $scope.entity.goodsDesc.introduction = editor.html();
            goodsService.add($scope.entity).success(
                function (response) {
                    if (response.success) {
                        alert('Success');
                        $scope.entity = {};
                        editor.html("");
                    } else {
                        alert(response.message);
                    }
                }
            )
        };


        //读取列表数据绑定到表单中
        $scope.findAll = function () {
            goodsService.findAll().success(
                function (response) {
                    $scope.list = response;
                }
            );
        };


        //分页
        $scope.findPage = function (page, rows) {
            goodsService.findPage(page, rows).success(
                function (response) {
                    $scope.list = response.rows;
                    $scope.paginationConf.totalItems = response.total;//更新总记录数
                }
            );
        };


        //查询实体
        /*       $scope.findOne = function (id) {
                   goodsService.findOne(id).success(
                       function (response) {
                           $scope.entity = response;
                       }
                   );
               };
       */

        //保存
        /*   $scope.save = function () {
               let serviceObject;//服务层对象
               if ($scope.entity.id != null) {//如果有ID
                   serviceObject = goodsService.update($scope.entity); //修改
               } else {
                   serviceObject = goodsService.add($scope.entity);//增加
               }
               serviceObject.success(
                   function (response) {
                       if (response.success) {
                           //重新查询
                           $scope.reloadList();//重新加载
                       } else {
                           alert(response.message);
                       }
                   }
               );
           };*/


        //批量删除
        $scope.dele = function () {
            //获取选中的复选框
            goodsService.dele($scope.selectIds).success(
                function (response) {
                    if (response.success) {
                        $scope.reloadList();//刷新列表
                        $scope.selectIds = [];
                    }
                }
            );
        };

        $scope.searchEntity = {};//定义搜索对象

        //搜索
        $scope.search = function (page, rows) {
            goodsService.search(page, rows, $scope.searchEntity).success(
                function (response) {
                    $scope.list = response.rows;
                    $scope.paginationConf.totalItems = response.total;//更新总记录数
                }
            );
        }

    }
)
;

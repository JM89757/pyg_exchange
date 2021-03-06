app.service('cartService', function ($http) {

    // this.findOne = function (userId) {
    //     return $http.get('address/findOne.do?userId=' + userId);
    // };

    this.add = function (address) {
        return $http.post('address/add.do', address);
    };

    this.update = function (address) {
        return $http.post('address/update.do', address);
    };

    this.del = function (id) {
        return $http.get('address/delete.do?id=' + id);
    };


    this.submitOrder = function (order) {
        return $http.post('order/add.do', order);
    };


    this.findAddressList = function () {
        return $http.get('address/findListByLoginUser.do');

    };

    this.showName = function () {
        return $http.get('cart/showName.do');
    };

    this.findCartList = function () {
        return $http.get('cart/findCartList.do');
    };


    this.addGoodsToCartList = function (itemId, num) {
        return $http.get('cart/addGoodsToCartList.do?itemId=' + itemId + '&num=' + num);
    };

    this.sum = function (cartList) {
        let totalValue = {totalNum: 0, totalMoney: 0.00};
        for (let i = 0; i < cartList.length; i++) {
            let cart = cartList[i];
            for (let j = 0; j < cart.orderItemList.length; j++) {
                let orderItem = cart.orderItemList[j];
                totalValue.totalNum += orderItem.num;
                totalValue.totalMoney += orderItem.totalFee;
            }
        }
        return totalValue;
    }
});
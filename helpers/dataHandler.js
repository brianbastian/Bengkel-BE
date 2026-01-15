const product = require("../models/product");
const service = require("../models/service");
const moment = require('moment');

const groupByDate = (arrData, start_date, end_date) => {
    if ( arrData.length == 0 ) return { x: 0, y: 0 };

    var diff = moment(end_date).diff(moment(start_date), 'days', false);
    var graphPoints = [];
    var x = moment(start_date).format("YYYY-MM-DD");
    var y = 0;

    for (let i = 0; i <= diff; i++) {
        if (i == 0) {
            graphPoints.push({ x, y });
        } else {
            x = moment(x).add(1, 'day').format("YYYY-MM-DD");
            graphPoints.push({ x, y });
        }
    }

    arrData.forEach( order => {
        let date = moment(order.created_at).format("YYYY-MM-DD");

        for (let i = 0; i < graphPoints.length; i++) {
            if (date == graphPoints[i].x) {
                graphPoints[i].y++;
            }
        }
    })

    return graphPoints;
};

const getProductTotal = (products, isReseller) => {
    var data = [];
    var total_price;
    if (isReseller == true) {
        products.forEach(async element => {
            var product_data = await product.findById(element.product_id);
            total_price = product_data.price.reseller * element.amount;
            total_price -= element.discount;
            var prod = {
                product_id: element.product_id,
                amount: element.amount,
                discount: element.discount,
                total_price: total_price
            }
            data.push(prod);
        })
        return data
    } else {
        products.forEach(async element => {
            var product_data = await product.findById(element.product_id);
            total_price = product_data.price.normal * element.amount;
            total_price -= element.discount;
            var prod = {
                product_id: element.product_id,
                amount: element.amount,
                discount: element.discount,
                total_price: total_price
            }
            data.push(prod);
        })
        return data
    }
}

const getGrandTotal = async (arrData) => {
    var grand_total;
    if (arrData.isReseller == true) {
        arrData.products.forEach(async element => {
            var product_data = await product.findById(element.product_id);
            total_price = product_data.price.reseller * element.amount;
            total_price -= element.discount;
        })
    } else {
        arrData.products.forEach(async element => {
            var product_data = await product.findById(element.product_id);
            total_price = product_data.price.normal * element.amount;
            total_price -= element.discount;
        })
    }
    if (arrData.withService == true ) {
        var serviceData = await service.findById(arrData.service_id);
        grand_total += serviceData.total;
    }
    return grand_total;
}

module.exports = {
    groupByDate,
    getProductTotal,
    getGrandTotal
};
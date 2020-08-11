'use strict';

let cuisineChart;
var cuisines_count = new Object();
var cuisine_details = [];
var cuisine_filter = [];

const filterMap = (data) => {
    console.log("in filtering Map");
    console.log(Object.values(data));
    cuisine_filter = Object.values(data);
      }
function map_filter()
{
    
}
const getCategory = (count) => {
    if (count < 45) {
        return '45';
    } else if (count < 90) {
        return '90';
    } else if (count < 135) {
        return '135';
    } else if (count < 180) {
        return '180';
    }
}


const init = () => {
    //constructData();
    //transformData();
    d3.json('business.json')
    .then((data) => {
        var cuisines = data['businesses'].map(function(value, index) {return value['cuisine']});
        console.log(cuisines);
        for (var i=0;i<cuisines.length;i++){
        if (cuisines[i] in cuisines_count) {
            cuisines_count[cuisines[i]] += 1;
        } else {
            cuisines_count[cuisines[i]] = 1;
        }}
        //console.log(cuisines_count);
        //console.log(Object.keys(cuisines_count))
        for (var key in cuisines_count) {
            //console.log(cuisines_count[key]);
            var json = {};
            json['Name'] = key;
            json['count'] = cuisines_count[key];
            json['category'] = getCategory(cuisines_count[key]);
            //console.log(json);
            cuisine_details.push(json);
    }
    console.log(cuisine_details);
    })
    .then(() => {

            // Plot Bubble chart for restaurants
            //console.log(cuisine_details);
            cuisineChart = bubbleChart()
                .width(710).height(540)
                .minRadius(10).maxRadius(60)
                .columnForColors("category")
                .columnForRadius("count")
                .columnForTitle('Name')
                .columnForCircleTitle('Name')
                .unitName("restaurants")
                .showTitleOnCircle(true)
                .customColors(["45", "90", "135", "180"], ["#00EBC8", "#FDE24F", "#6C62FF", "#FF5470"]);
            console.log(cuisine_details);
            d3.select('#countries-chart').datum(cuisine_details).call(cuisineChart);
        cuisineChart.onClickBubble(filterMap);
           })
        .then(() => { console.log('complete') });
}
//constructData();
init();
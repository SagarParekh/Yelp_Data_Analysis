//var all_reviews = {};
//var reviews = [];
function filter_reviews(businessid){
  reviews = [];
  positive=[];
  negative =[];
  neutral =[];
  positive_reviews =0;
  negative_reviews=0;
  neutral_reviews = 0;
  d3.json("tempereview.json")
  .then(data => countryNames = data)
  .then(function(data) {
  console.log(data);
  reviews_dict = data.filter(function(d){ return d.business_id == businessid });
  console.log(reviews_dict);
  reviews = extract_reviews(reviews_dict);
  positive,negative,neutral,positive_reviews,negative_reviews,neutral_reviews = get_sentiment(reviews);
  create_pie(positive_reviews,negative_reviews,neutral_reviews);
  document.getElementById('best_superb_amazing_very_good_').innerHTML = positive.slice(0,5).join('<br>');
  document.getElementById('bad_awful_worst_not_recommende').innerHTML = negative.slice(0,5).join('<br>');
  pos = (positive_reviews/(negative_reviews+positive_reviews+neutral_reviews)*100);
  neg = (negative_reviews/(negative_reviews+positive_reviews+neutral_reviews)*100);
  neu = (neutral_reviews/(negative_reviews+positive_reviews+neutral_reviews)*100);
  document.getElementById('Positive').innerHTML = ("Positive: "+(pos.toFixed(2))+"%");
  document.getElementById('Negative').innerHTML = ("Negative: "+(neg.toFixed(2))+"%");
  document.getElementById('Neutral').innerHTML = ("Neutral: "+(neu.toFixed(2))+"%");

});
}

function get_sentiment(reviews){
  positive = [];
  negative =[];
  neutral = [];
  positive_reviews = 0;
  negative_reviews =0;
  neutral_reviews =0;
  for(i=0;i<reviews.length;i++){
    lines = reviews[i].split(".");
    //console.log(lines);
    result = sentiment(lines[0]);
    positive.push.apply(positive,result['positive']);
    negative.push.apply(negative,result['negative']);
    neutral.push.apply(neutral,result['neutral']);

    if (result['verdict'] == "POSITIVE"){
      positive_reviews += 1;
    }
    if (result['verdict'] == "NEGATIVE"){
      negative_reviews += 1;
    }
    if (result['verdict'] == "NEUTRAL"){
      neutral_reviews += 1;
    }
  }
  console.log(positive_reviews);
  console.log(negative_reviews);
  console.log(neutral_reviews);
  console.log(positive);
  console.log(negative);
  console.log(neutral);
  return positive,negative,neutral,positive_reviews,negative_reviews,neutral_reviews;

}

function tokenize(input) {
  // convert negative contractions into negate_<word>
  return $.map(input.replace('.', '')
    .replace('/ {2,}/', ' ')
    .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '')
    .toLowerCase()
    .replace(/\w+['’]t\s+(a\s+)?(.*?)/g, 'negate_$2')
    .split(' '), $.trim);
}

function sentiment(phrase) {
  //console.log(phrase);

  var tokens = tokenize(phrase),
    score = 0,
    words = [],
    positive = [],
    negative = [];
    neutral = []; 
    //console.log(tokens);

  // Iterate over tokens
  var len = tokens.length;
  while (len--) {
    var obj = tokens[len];
    var negate = obj.startsWith('negate_');

    if (negate) obj = obj.slice("negate_".length);

    if (!afinn.hasOwnProperty(obj)) continue;

    var item = afinn[obj];
    //console.log(item);

    words.push(obj);
    if (negate) item = item * -1.0;
    if (item > 0) positive.push(obj);
    if (item < 0) negative.push(obj);
    if(item == 0) neutral.push(obj);

    score += parseInt(item);
  }

  var verdict = score == 0 ? "NEUTRAL" : score < 0 ? "NEGATIVE" : "POSITIVE";

  var result = {
    verdict: verdict,
    score: score,
    comparative: score / tokens.length,
    positive: [...new Set(positive)],
    negative: [...new Set(negative)],
    neutral: [...new Set(neutral)]
  };

  return result;
}

function create_pie(positive_reviews,negative_reviews,neutral_reviews){
  // set the dimensions and margins of the graph
var width = 300
    height = 300
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#Ring_Chart11")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
var data = {positive: positive_reviews, negative:negative_reviews , neutral:neutral_reviews}
console.log(data);
// set the color scale
var color = d3.scaleOrdinal()
  .domain(data)
  .range(["#00EBC8", "#FF5470", "#6C63FF"])

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('whatever')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(50)         // This is the size of the donut hole
    .outerRadius(radius)
  )
  .attr('fill', function(d){ return(color(d.data.key)); })
    .attr('class','Pie')
    .append('text')
  .text( function(d) { return d.data.value; } )
  //.attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
  .style("text-anchor", "middle")
  .style("font-size", 17)
  //.attr("stroke", "black")
  //.style("stroke-width", "2px")
  //.style("opacity", 0.7)
}



function extract_reviews(dict){
  reviews = dict.map(d => d.text);
  //console.log(reviews);
  return reviews;
}
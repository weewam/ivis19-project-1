import React, { Component } from 'react';

import * as d3 from 'd3';
import dataset from "./data/students.json";

const interest_directory = [
  { id : 1, name: "Art", color : "#55efc4" },
  { id : 2, name: "Design", color : "#00b894" },
  { id : 3, name: "Development", color : "#81ecec" },
  { id : 4, name: "Drawing", color : "#00cec9" },
  { id : 5, name: "Film", color : "#74b9ff" },
  { id : 6, name: "Football", color : "#0984e3" },
  { id : 7, name: "Gaming", color : "#a29bfe" },
  { id : 8, name: "Music", color : "#6c5ce7" },
  { id : 9, name: "Nature", color : "#ffeaa7" },
  { id : 10, name: "Photography", color : "#fdcb6e" },
  { id : 11, name: "Socialising", color : "#fab1a0" },
  { id : 12, name: "Sports", color : "#e17055" },
  { id : 13, name: "Travel", color : "#ff7675" },
  { id : 14, name: "Working out", color : "#d63031" },
  { id : 15, name: "N/A", color : "#b2bec3" }
]

class RadarChart extends Component {
  componentDidMount() {
    var width = 300,
        height = 300;

    // Config for the Radar chart
    var config = {
        w: width,
        h: height,
        levels: 5,
        maxValue: 10,
        ExtraWidthX: 300
    }

    var svg = d3.select('body')
      .selectAll('svg')
      .append('svg')
      .attr("width", width)
      .attr("height", height);

    this.drawChart("#chart", dataset, config);
  }

  drawChart(id, d, options) {
    var cfg = {
      radians: 2 * Math.PI,
      radius: 5,
      w: 1024,
      h: 1024,
      factor: 1,
      factorLegend: .85,
      levels: 3,
      maxValue: 0,
      ToRight: 5,
      opacityArea: 0.5,
      TranslateX: 155,
      TranslateY: 60,
      ExtraWidthX: 100,
      ExtraWidthY: 100,
      color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"])
    };
  
    if('undefined' !== typeof options) {
      for(var i in options){
        if('undefined' !== typeof options[i]){
          cfg[i] = options[i];
        }
      }
    }

    const dps = d.map(function(i) {
      return i.values
    }) 

    
    var allAxis = dps[0].map(i => i.axis);
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    d3.select(id).select("svg").remove();

    var g = d3.select(id)
        .append("svg")
        .attr("width", cfg.w+cfg.ExtraWidthX)
        .attr("height", cfg.h+cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
  
    //Circular segments
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    //Text indicating at what % each level is
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data([1]) //dummy data
       .enter()
       .append("svg:text")
       .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
       .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
       .attr("class", "legend")
       .style("font-size", "12px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
       .attr("fill", "#737373")
       .text((j+1)*cfg.maxValue/cfg.levels);
    }

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w/2)
      .attr("y1", cfg.h/2)
      .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
      .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text(function(d){return d})
      .style("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.25em")
      .attr("transform", function(d, i){return "translate(0, -10)"})
      .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
      .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});


    let polygonDictionary = []

    dps.forEach(function(i, j) {
      //Setup
      g.selectAll(".setup")
        .data(i, function(k, l) {
          polygonDictionary[j] = { };
        });


      //Calculate polygon points
      let polygon = []
      g.selectAll(".nodes")
        .data(i, function(k, l) {
          let x = cfg.w/2*(1-(parseFloat(Math.max(k.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(l*cfg.radians/total));
          let y = cfg.h/2*(1-(parseFloat(Math.max(k.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(l*cfg.radians/total));

          polygon.push([ x, y ]);
        });

      polygonDictionary[j].polygon = polygon;
      polygon = [ ...polygon, polygon[0] ] //Closes the polygon


      //Create polygon
      let area = g.selectAll(".area")
        .data([ polygon ])
        .enter()
        .append("polygon")
        .style("fill", interest_directory[dataset[j].interest - 1].color)
        .style("fill-opacity", 0 )
        .style("stroke", interest_directory[dataset[j].interest - 1].color)
        .style("stroke-opacity", 0)
        .style("stroke-width", "2px")
        .attr("class", "radarArea-" + j)
        .attr("data-series", j)
        .attr("pointer-events", "none")
        .attr("points", (d) => {
          var str="";

          for(var pti=0;pti<d.length;pti++){
           str=str+d[pti][0]+","+d[pti][1]+" ";
          }

          return str;
        });

      //Calculate radius
      g.selectAll(".radiuses")
        .data([ i ], function(k, l) {
          let sum = k.reduce((a, b) => { return a + b.value }, 0);

          polygonDictionary[j].radius = 1.5 * sum / i.length;
        })
      

      //Calculate centroid
      var hull = d3.polygonHull(polygon); 
      g.datum(hull).attr("d", (d) => { return "M" + d.join("L") + "Z"; });
      let centroid = d3.polygonCentroid(hull);
      polygonDictionary[j].x = centroid[0];
      polygonDictionary[j].y = centroid[1];
    });
    
    var simulation = d3.forceSimulation(polygonDictionary)
      .force('charge', d3.forceManyBody().strength(-0.2))
      .force('collision', d3.forceCollide().radius((d) => d.radius ))
      .on('tick', ticked);

    function ticked() {
      var u = g.selectAll('circle')
        .data(polygonDictionary)

      u.enter()
        .append('circle')
        .merge(u)
        .attr("class", (i, j) => `radarCircle radarCircle-${ j }`)
        .attr("data-series", (i, j) => j)
        .style("fill", (i, j) => interest_directory[dataset[j].interest - 1].color)
        .style("fill-opacity", 0.5)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.radius)
        .on('mouseover', function (d){
          let element = d3.select(this);

          element.transition(200).style("fill-opacity", 1)

          let series = element.attr("data-series");
          let z = `polygon.radarArea-${ series }`;

          g.selectAll(z)
           .transition(200)
           .style("fill-opacity", .1)
           .style("stroke-opacity", .7);

          d3.select(".student.student-" + series).attr("data-opacity", 1)
        })
        .on('mouseout', function(){
          let element = d3.select(this)

          let stick = element.attr("data-stick");

          if (!stick) {
            element.transition(200).style("fill-opacity", 0.5)

            let series = element.attr("data-series");
            let z = "polygon.radarArea-" + series;

            g.select(z)
             .transition(200)
             .style("fill-opacity", 0)
             .style("stroke-opacity", 0);

            d3.select(".student.student-" + series).attr("data-opacity", 0)
          }
        })
        .on('click', function(){
          let element = d3.select(this);

          let stick = 1 - element.attr("data-stick");

          element.attr("data-stick", stick)
           .transition(200)
           .style("fill-opacity", stick ? 0.95 : 0.5)

          let series = element.attr("data-series");
          g.select("polygon.radarArea-" + series)
           .transition(200)
           .style("fill-opacity", stick * .1)
           .style("stroke-opacity", stick * .7);


          d3.select(".student.student-" + series)
           .attr("data-opacity", stick)
        });

      u.exit().remove()
    }
  }
        
  render() {
    let legend = interest_directory.map((interest) => {
      return (
        <li >
          <figure style={{ backgroundColor: interest.color }} data-interest={ interest.id }></figure>
          { interest.name }
        </li>
      );
    })

    let studentList = dataset.map((student) => {
      return <li className={ `student student-${ student.id }` } data-opacity="0">{ student.name }</li>;
    })

    return (
      <main>
          <div className="legend-container">
            <h2>Interests</h2>
            <ul className="legend">{ legend }</ul>
          </div>

          <div className="chart-container">
            <h2>Students</h2>
            <div id="chart"></div>
          </div>

          <div className="selection-container">
            <h2>Current Selection</h2>
            <ul className="students">{ studentList }</ul>
          </div>
      </main>
    )
  }
}
    
export default RadarChart;
console.clear();

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";


const svgWidth = 800; //Width of SVG.
const svgHeight = 500; //Height of SVG.
const svgPadding = 60; //Padding from edge of SVG.

const timeFormat = d3.timeFormat("%M:%S");


d3.json(url, function(err, data) { //Gets the data from the json file.
	//   const justTheYears = data.map(function (item) {
	//     return item.Year.toString();
	// });
  // console.log(justTheYears);
  
	// const justTheTime = data.map(function(item) {
	// 	return item.Time //.replace(/:/g, '')
	// });
	// console.log(justTheTime);

  
	//Scale for the horizontal x-axis. Finds the smallest year and biggest year. Adds extra year before & after.
	const xScale = d3.scaleLinear()
		.domain([d3.min(data, (d) => d["Year"]) - 1, d3.max(data, (d) => d["Year"]) + 1]) 
		.range([svgPadding, svgWidth - svgPadding]);

	//The vertical y-axis. Finds the longest time and shortest time.
	const yScale = d3.scaleTime()
		.domain([d3.max(data, (d) => d["Seconds"]), d3.min(data, (d) => d["Seconds"])])
		.range([svgHeight - svgPadding, svgPadding]);
  
  //The horzintal x-axis for years. Uses ticks.
  	const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

   //The vertical y-axis for time.
	//const yAxis = d3.axisLeft(yScale)//.ticks(d3.time.seconds, 15).tickFormat(d3.time.format("%M:%S"));

  
  
  var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
  
  
  //This is the main SVG file.
	const svg = d3.select("body")
		.append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight);


	//These are the scatterplot dots.
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("class", "dot")
		.attr("cx", (d) => xScale(d["Year"]))
		.attr("cy", (d) => yScale(d["Seconds"]))
		.attr("r", (d) => 5)
		.attr("data-xvalue", (d) => d["Year"]) //Xvalue visible in chrome dev tools.
		.attr("data-yvalue", (d) => new Date(d["Seconds"] * 1000)) //Yvalue visible in chrome dev tools.



	// Format data for Y Axis
	//        var specifier = "%M:%S";
	//        var parsedTime = justTheTime.map(function(d) {
	//          return d3.timeParse(specifier)(d)
	//        })

	//        var y = d3.scaleTime()
	//                  .range([svgHeight, 0])
	//                  .domain(d3.extent(parsedTime));

	//   //Also Y-Axis
	//  svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	//          g.append("g")
	//         .call(d3.axisLeft(y)
	//              .tickFormat(function(d,i) {
	//     return times[i]
	// }))
	//         .attr("stroke-width", 2)
	//            .style("font-size", ".6em")



// 	svg.selectAll("text")
// 	 .data(data)
// 	 .enter()
// 	 .append("text")
// 	 .text((d) =>  (d[0] + "," + d[1]))
// 	 .attr("x", (d) => xScale(d[0] + 10))
// 	 .attr("y", (d) => yScale(d[1]))



	//The horizontal x-axis.
	svg.append("g")
		.attr("id", "x-axis")
		.attr("transform", "translate(0," + (svgHeight - svgPadding) + ")")
		.call(xAxis)


//The vertical y-axis.
	svg.append("g")
		.attr("id", "y-axis")
		.attr("transform", "translate(" + (svgPadding) + ",0)")
		.call(yAxis)



	//   legend = svg.append("g")
	//    .attr("class","legend")
	//    .attr("transform","translate(50,30)")
	//    .style("font-size","12px")

	//   .selectAll('circle')
	//       .data(data)
	//       .enter()
	//   // .call(d3.legend)


	console.log(data[0])
	console.log("Time", data[0]["Time"])
	console.log("justTheTime", justTheTime[0])



})

console.log("end of app")

console.clear();

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"; //Data source.

const svgWidth = 800; //Width of SVG.
const svgHeight = 500; //Height of SVG.
const svgPadding = 60; //Padding from edge of SVG.

const timeFormat = d3.timeFormat("%M:%S"); //Y-axis uses "12:34" format for time.

// let colour = d3.scaleOrdinal()
//       .domain(["Doping", "No Doping"])
//       .range(["#FF0000", "#0000FF"]);

const createDate = (min,s) => { 
            let d = new Date();
            d.setMinutes(min);
            d.setSeconds(s);
            return d;
}



d3.json(url, function(err, data) { //Gets the data from the json file.
		let xScale = d3.scaleLinear() //Scale for the x-axis.
		             .domain([d3.min(data, (d) => d.Year) - 1, d3.max(data, (d) => d.Year) + 1]) //Uses smallest and biggest years. Adds 1 year before & after.
		             .range([svgPadding, svgWidth - svgPadding])

		let xAxis = d3.axisBottom(xScale) //The x-axis.
                .tickFormat(d3.format("d")) //Formats years as "1994" instead of "1,994".
  
  
  
		let milliseconds = data.map(function(d, i){ //An array of data from Seconds.
      	return data[i].Seconds * 1000; //Multiplied by 1000 to convert to miliseconds.
		});
    
  	let minutes = data.map(function(d,i){ //An array of data from Time.
				return data[i].Time
  	});
   
		const yScale = d3.scaleTime() //Scale for the y-axis.
		//							 .domain([d3.max(data, (d) => d["Seconds"]), d3.min(data, (d) => d["Seconds"])])
  									 .domain([d3.max(milliseconds), d3.min(milliseconds)]) //Uses longest and shortest times from the seconds array.
										 .range([svgHeight - svgPadding, svgPadding]);
  
		//The vertical y-axis for time.
		//const yAxis = d3.axisLeft(yScale)//.ticks(d3.time.seconds, 15).tickFormat(d3.time.format("%M:%S"));
		//var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

		let yAxis = d3.axisLeft(yScale) //The y-axis.
                  .tickFormat(timeFormat); //Y-axis uses "12:34" format for time.

  
  
		const svgContainer = d3.select("body") //This is the main SVG element.
		                     	 .append("svg")
		                       .attr("width", svgWidth)
	                         .attr("height", svgHeight);

		svgContainer.selectAll("circle") //These are the scatterplot dots.
								.data(data)
								.enter()
								.append("circle")
	// 						.attr("class", "dot hoverDot")
		 						.attr("cx", (d) => xScale(d["Year"])) //Controls x-value for dots. Uses Year from data.
	//						.attr("cy", (d) => yScale(d["Seconds"]))
								.attr('cy', function(d,i){ return yScale(milliseconds[i]) }) //Controls y-value for dots. Uses milliseconds array.
  							.attr("r", (d) => 5) //Radius of dots.
								.attr("data-xvalue", (d) => d["Year"]) //X-value only visible in chrome dev tools.
		//					.attr("data-yvalue", (d) => new Date(d["Seconds"] * 1000)) //Yvalue visible in chrome dev tools.
                .attr('data-yvalue', (d) => createDate( Number(d.Time.split(':')[0]), Number(d.Time.split(':')[1]) )) //Yvalue visible in chrome dev tools.
                .attr("class", (d) => {
		                return (d["Doping"]) ? "dot allgedDoping" : "dot noDoping";
		            });

	// svg.selectAll("text")
	//  .data(data)
	//  .enter()
	//  .append("text")
	//  .text((d) =>  (d[0] + "," + d[1]))
	//  .attr("x", (d) => xScale(d[0] + 10))
	//  .attr("y", (d) => yScale(d[1]))

		svgContainer.append("g") //Appends the x-axis to the SVG file.
								.attr("id", "x-axis")
								.attr("transform", "translate(0," + (svgHeight - svgPadding) + ")")
								.call(xAxis)

		svgContainer.append("g") //Appends the y-axis to the SVG file.
  	   					.call(yAxis)
		 						.attr("id", "y-axis")
		 						.attr("transform", "translate(" + (svgPadding) + ",0)")

  
	var legend = svgContainer.selectAll(".legend") //This is the Legend element.
		              				 .data("YN")
		              				 .enter().append("g")
	              					 .attr("class", "legend")
		              				 .attr("transform", function(d, i) {
			                        return "translate(0," + i * 20 + ")";
													 });

	legend.append("rect") //Appends the rectangles to the Legend.
		    .attr("x", svgWidth - 18)
		    .attr("width", 18)
		    .attr("height", 18)
		    .style("fill", "red");

	legend.append("text") //Appends the text to the Legend.
		    .attr("x", svgWidth - 24)
		    .attr("y", 9)
		    .attr("dy", ".35em")
		    .style("text-anchor", "end")
		    .text(function(d) {
			      return d;
		    })

	//console.log(data[0])
	//console.log("Time", data[0]["Time"])
})

console.log("end of app");

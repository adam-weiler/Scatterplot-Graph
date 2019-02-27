console.clear();

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"; //Data source.

const svgWidth = 900; //Width of SVG.
const svgHeight = 500; //Height of SVG.
const svgPadding = 70; //Padding from edge of SVG.

const timeFormat = d3.timeFormat("%M:%S"); //Y-axis uses "12:34" format for time.

let colourScale = d3.scaleOrdinal()
               .domain(["Alleged Doping", ""])
               .range(["#ed561b", "#50b432"]);

const createDate = (min,s) => { 
                                let d = new Date();
                                d.setMinutes(min);
                                d.setSeconds(s);
                                return d;
                              }

let tooltipDiv = d3.select("body") //This is the div that holds the tooltip.
                   .append("div")
                   .attr("id", "tooltip")
                   //.style("opacity", 0);


d3.json(url, function(err, data) { //Gets the data from the json file.
    //Defines elements for the x-axis.
		let xScale = d3.scaleLinear() //Scale for the x-axis.
		               .domain([d3.min(data, (d) => d.Year) - 1,
                            d3.max(data, (d) => d.Year) + 1]) //Uses smallest and biggest years. Adds 1 year before & after.
		               .range([svgPadding, svgWidth - (svgPadding / 1.5)])

		let xAxis = d3.axisBottom(xScale) //The x-axis.
                  .tickFormat(d3.format("d")) //Formats years as "1994" instead of "1,994".
  
    
    //Defines elements for the y-axis.
		let milliseconds = data.map(function(d, i){ //An array of data from Seconds.
      	return data[i].Seconds * 1000; //Multiplied by 1000 to convert to miliseconds.
		});
    
  	// let minutes = data.map(function(d,i){ //An array of data from Time.
  	// return data[i].Time
  	// });
   
		let yScale = d3.scaleTime() //Scale for the y-axis.
  							   .domain([d3.max(milliseconds), 
                            d3.min(milliseconds)]) //Uses longest and shortest times from the seconds array.
									 .range([svgHeight - svgPadding, svgPadding]);
  
		let yAxis = d3.axisLeft(yScale) //The y-axis.
                  .tickFormat(timeFormat) //Y-axis uses "12:34" format for time.

    
    //Defines the main SVG element.
		let svgContainer = d3.select("body")
		                     .append("svg")
		                     .attr("width", svgWidth)
	                       .attr("height", svgHeight);
  
		svgContainer.append("text") //Appends the Title element.
                .attr("transform", "translate(100,0)")
                .attr("x", svgWidth/4.5)
                .attr("y", svgPadding/1.5)
                .text("Scatterplot Graph")
                .attr("id", "title")
  
  
		svgContainer.append("text") //X-Axis label.
                .attr("transform", "translate(100,0)")
                .attr("x", svgWidth / 2.8)
                .attr("y", svgHeight - 20)
                .text("Year")  
    
		svgContainer.append("text") //Y-Axis label.
        				.attr("transform", "rotate(-90)")
        				.attr("x", 0 -(svgHeight / 1.65))
        				.attr("y", 20)
        				.text("Time in Minutes")
  

  
  
		svgContainer.selectAll("circle") //Appends all of the Scatterplot dots.
								.data(data)
								.enter()
								.append("circle")
		 						.attr("cx", (d) => xScale(d["Year"])) //Controls x-value for dots. Uses Year from data.
								.attr("cy", function(d,i){ //Controls y-value for dots. Uses milliseconds array.
                    return yScale(milliseconds[i]) 
                })
  							.attr("r", (d) => 6) //Radius of dots.
								.attr("data-xvalue", (d) => d["Year"]) //X-value only visible in chrome dev tools.
  	//		    	.attr("data-yvalue", (d) => d["Time"]) //Yvalue visible in chrome dev tools.
		//					.attr("data-yvalue", (d) => new Date(d["Seconds"] * 1000)) //Yvalue visible in chrome dev tools.
                .attr("data-yvalue", (d) => createDate( Number(d.Time.split(":")[0]), Number(d.Time.split(":")[1]) )) //Yvalue visible in chrome dev tools.
                .attr("class", (d) => { //If there is any data in Doping, class set to allegedDoping. Otherwise, class set to noDoping.
		                return (d["Doping"]) ? "dot allegedDoping" : "dot noDoping";
		            })
  
  
                .on("mouseover", function(d) { //When user mouse's over a dot.
                    tooltipDiv.style("opacity", .9); //Tooltip div is made visible.
                    tooltipDiv.attr("data-year", d.Year) 
                    //Populates tooltip div with data Name, Nationality, Year, Time, and Doping if there is data.
                    tooltipDiv.html("<p><strong>" + d.Name + "</strong> - " + d.Nationality + "</p>" 
                                    + "<p>Year: " +  d.Year + ", Time: " + d.Time + "</p>"
                                    + (d.Doping ? "<p>" + d.Doping + ".</p>" : "No doping allegations."))
                              .style("left", (d3.event.pageX + 25) + "px") //Div appears to the right of the dot.
                              .style("top", (d3.event.pageY -10) + "px");
                })
                .on("mouseout", function(d) { //When user mouses's away from dot.
                    tooltipDiv.style("opacity", 0); //Tooltip div is made invisible.
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
  
  
		//Defines the elements for the Legend.
  	var legend = svgContainer.selectAll(".legend") //This is the Legend element.
		              				   .data(colourScale.domain())
		              				   .enter()
                             .append("g")
	              					   .attr("class", "legend")
		              				   .attr("transform", function(d, i) {
			                          return "translate(0," + i * 20 + ")";
													   });

		legend.append("rect") //Appends the rectangles to the Legend.
          .attr("id", "legend")
		      .attr("x", svgWidth - 38)
  				.attr("y", 17)
		      .attr("width", 18)
		      .attr("height", 18)
		      .attr("class", function(d) {
              if (d) return "allegedDoping";
              else {
                  return "noDoping";
              };
          });

		legend.append("text") //Appends the text to the Legend.
		      .attr("x", svgWidth - 44)
		      .attr("y", 25)
		      .attr("dy", ".35em")
		      .style("text-anchor", "end")
				  .text(function(d) {
              if (d) return "Alleged Doping";
              else {
                  return "No Doping";
              };
          });
    
// 	 let legend = svgContainer.selectAll(".legend") //This is the Legend element.
// 	 	              				 //.data(color.domain())
  
// 	 .style('fill', function(d) {
// 	 	return colourScale(d);
// 	 })
// 		              				 .enter().append("g")
// 													 .attr("class", "legend")
// 													 .attr("transform", function(d, i) {
// 													 return "translate(0," + i * 20 + ")";
// 													 });

// 	legend.append("rect") //Appends the rectangles to the Legend.
// 		    .attr("x", svgWidth - 18)
// 		    .attr("width", 18)
// 		    .attr("height", 18)
// 		    .style("fill", "red");

// 	legend.append("text") //Appends the text to the Legend.
// 		    .attr("x", svgWidth - 24)
// 		    .attr("y", 9)
// 		    .attr("dy", ".35em")
// 		    .style("text-anchor", "end")
// 		    .text(function(d) {
// 			      return d;
// 		    })

	//console.log(data[0])
	//console.log("Time", data[0]["Time"])
})

console.log("end of app");

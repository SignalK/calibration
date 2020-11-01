import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function Chart(props) {
  const { values } = props
  const ref = useRef();
  const xValue = (d) => d.in
  const yValue = (d) => d.out - d.in

  const outerWidth = props.width, outerHeight = props.height
  const margin = { top: 10, right: 10, bottom: 30, left: 30 }
  const width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr("width", outerWidth)
      .attr("height", outerHeight)
      .style("border", "1px solid black")
  }, []);

  useEffect(() => {
    draw();
  }, [props.values]);

  const draw = () => {

    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()
    const plotArea = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const xScale = d3.scaleLinear()
      .domain(d3.extent(values, xValue))
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain(d3.extent(values, yValue))
      .range([height, 0]);
      console.log(d3.extent(values, yValue))

    const line = d3.line()
      .x((d) => xScale(xValue(d)))
      .y((d) => yScale(yValue(d)))

    const boundPaths = plotArea.selectAll('path').data([values])
    boundPaths
      .enter().append('path')
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', 'blue')
    boundPaths.exit().remove()
    boundPaths.attr('d', line)

    const xAxis = d3.axisBottom(xScale).ticks(5)
    plotArea.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height+ ")")
      .call(xAxis)
      console.log(yScale)
    const yAxis = d3.axisLeft(yScale).ticks(5)
      plotArea.append("g")
        .attr("class", "y axis")
        .call(yAxis)
  
  }

  return (
    <div className="chart">
      <svg ref={ref}>
      </svg>
    </div>
  )
}


export default Chart

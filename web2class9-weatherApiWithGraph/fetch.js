const api = '8bd32c8b25477b92c6a32c7c6b7faa13',
    unit = 'metric',
    chartData = [],
    margin = {top: 0, right: 0, bottom: 0, left: 40},
    rectWidth = 40,
    rectPadding = 10,
    height = 400 - margin.top - margin.bottom,
    width = 600 - margin.left - margin.right;

let lat = '-22.9028',
    long = '-43.2075',
    url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely,alerts&appid=${api}&units=${unit}`;

    
console.log(url);

document.querySelector('#cities').addEventListener('change', function(){
    let cityValue = document.querySelector('#cities').value;
    if(cityValue == 'NYC') {
        lat = '40.714272';
        long = '-74.005966';
        url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely,alerts&appid=${api}&units=${unit}`;
        createFetch(url)
    } if(cityValue == 'Beijing') {
        lat = '39.907501';
        long = '116.397232';
        url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely,alerts&appid=${api}&units=${unit}`;
        createFetch(url)
    } if(cityValue == 'Taipei') {
        lat = '24.94702';
        long = '121.581749';
        url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely,alerts&appid=${api}&units=${unit}`;
        createFetch(url)
    }  else {
        lat = '-22.9028';
        long = '-43.2075';
        url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely,alerts&appid=${api}&units=${unit}`;
        createFetch(url)
    }
});

function createFetch(url) {
    fetch(url)

    .then(function(response) {
        console.log(response);
        return response.json();
    })
    .then(function(data) {
    
        return updateUI(data);
    
    })
    
    .catch(function(error) {
    
        // console.log(error);
    
    });
}

function updateUI(data) {

    document.querySelector('.current .temperature').innerHTML = `${Math.round(data.current.temp)}˚C`;
    document.querySelector('.current .advice').innerHTML = `${data.current.weather[0].main}`;
    document.querySelector('.current .icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" />`;
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    document.querySelector('.current .weekday').innerHTML = 'Current';

    let output = '';
    for(let i = 0; i < data.daily.length; i++) {
        // document.querySelectorAll('.forecast .icon')[i].innerHTML = `<img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" />`;
        // document.querySelectorAll('.forecast .temperature')[i].innerHTML = `${Math.round(data.daily[i].temp.day)}˚C`;
        // document.querySelectorAll('.forecast .weekday')[i].innerHTML = daysOfWeek[new Date(data.daily[i].dt * 1000).getDay()];
        // document.querySelectorAll('.forecast .advice')[i].innerHTML = data.daily[i].weather[0].main;
    }

    console.log(data);

    console.log('test');

    for (var i = 0; i<data.daily.length; i++) {
        chartData.push(data.daily[i].temp.day);
    }  

    console.log('test');

    const tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('top', '0px')
        .style('background', '#FFFFFF');
        
    const colors = d3.scaleLinear()
        .domain([d3.min(chartData), d3.max(chartData)])
        .range(['#424ef5', '#f54242']);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(chartData)])
        .range([0, height]);

    const yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(chartData)])
        .range([height, 0]);

    const yAxisMap = d3.axisLeft(yAxisScale);

    const xScale = d3.scaleBand()
        .domain(chartData)
        .padding(0.1)
        .range([0, width]);

    d3.select('svg').remove();

    const viz = d3.select('#viz')
        .append('svg')
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right)
        .append('g')
        .attr('transform', 'translate('+margin.left+',0)')
        .selectAll('rect')
        .data(chartData)
        .enter().append('rect')
        .attr('height', 0)
        .attr('width', xScale.bandwidth())
        .attr('x', function(d, i) { return xScale(d); })
        .attr('y', function(d, i) { return height; } )
        .attr('fill', function(d) { return colors(d); })

        //working tooltip
        .on('mouseover', function(e, d){
            tooltip.html(`${d}&deg;`)
                .style('top', `${event.layerY}px`)
                .style('left', `${event.layerX}px`)
            d3.select(this)
                .style('opacity', '0.5')
        })
        
        .on('mouseout', function(d) {
            tooltip.html('')
            d3.select(this)
                .style('opacity', '1')
        });

    const yCall = d3.select('#viz svg').append('g')
            .attr('transform', 'translate('+margin.left+',0)')
            .call(yAxisMap);

    viz.transition()
            .delay(400)
            .attr('height', function(d) { return yScale(d); })
            .attr('y', function(d) { return height - yScale(d); });
}

function handleErrors(response) {
    if(!response.ok) {
        throw new Error((response.status + ': ' + response.statusText));
    }
    return response.json();
}

function updateFail(error) {
    console.log(error);
    
}

function createRequest(url, succeed, fail) {
    fetch(url)
    .then((response) => handleErrors(response))
    .then((data) => succeed(data))
    .catch((error) => fail(error));
};

window.addEventListener('DOMContentLoaded', () => {
    createRequest(url, updateUI, updateFail);
});
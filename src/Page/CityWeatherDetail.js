/*********************************************************************************
* BTI425 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Daniel Thai  Student ID: 151900198  Date: 2/23/2021
*
********************************************************************************/

import React from 'react';
import Card from 'react-bootstrap/Card';
import moment from 'moment';
import './Page.css';

/**
 * Takes the wind direction in degrees and returns a string
 * representation in the form "Direction (DirectionCode Degrees)"
 */
function windDirection(deg) {
    if (deg > 348.75 && deg <= 11.25) 
        return `North (N ${deg})`;
     else if (deg > 11.25 && deg <= 33.75) 
        return `North-northeast (NNE ${deg})`;
     else if (deg > 33.75 && deg <= 56.25) 
        return `Northeast (NE ${deg})`;
     else if (deg > 56.25 && deg <= 78.75) 
        return `East-northeast (ENE ${deg})`;
     else if (deg > 78.75 && deg <= 101.25) 
        return `East (E ${deg})`;
     else if (deg > 101.25 && deg <= 123.75) 
        return `East-southeast (ESE ${deg})`;
     else if (deg > 123.75 && deg <= 146.25) 
        return `Southeast (SE ${deg})`;
     else if (deg > 146.25 && deg <= 168.75) 
        return `South-southeast (SSE ${deg})`;
     else if (deg > 168.75 && deg <= 191.25) 
        return `South (S ${deg})`;
     else if (deg > 191.25 && deg <= 213.75) 
        return `South-southwest (SSW ${deg})`;
     else if (deg > 213.75 && deg <= 236.25) 
        return `Southwest (SW ${deg})`;
     else if (deg > 236.25 && deg <= 258.75) 
        return `West-southwest (WSW ${deg})`;
     else if (deg > 258.75 && deg <= 281.25) 
        return `West (W ${deg})`;
     else if (deg > 281.25 && deg <= 303.75) 
        return `West-northwest (WNW ${deg})`;
     else if (deg > 303.75 && deg <= 326.25) 
        return `Northwest (NW ${deg})`;
     else if (deg > 326.25 && deg <= 348.75) 
        return `North-northwest (NNW ${deg})`;
     else 
        return deg;
}


/**
 * City weather detailed information. Expects a prop named city. This prop
 * should contain the weather information for a city.
 * 
 * Moment.js used to convert the time.
 */
function CityWeatherDetail({ city })
{
    //Some cities are missing the timezone.
    if (!city.sys.timezone)
        console.log("Time in GMT");

    return(
        <Card.Body>
            <p>Temperature will range from <b>{city.main.temp_min}&deg;C</b> to <b>{city.main.temp_max}&deg;C</b></p>
            <p>
                <b>Sunrise:</b> {moment.unix(city.sys.sunrise).utcOffset(city.sys.timezone/60).format("h:mmA")} &nbsp;
                <b>Sunset:</b> {moment.unix(city.sys.sunset).utcOffset(city.sys.timezone/60).format("h:mmA")}
            </p>
            <p><b>Cloudiness:</b> {city.clouds.all}%</p>
            <p>
                <b>Humidity:</b> {city.main.humidity}% &nbsp;
                <b>Pressure:</b> {city.main.pressure} hPa
            </p>
            <p><b>Wind:</b> {city.wind.speed}m/s {windDirection(city.wind.deg)}</p>
            <p><b>Geographic Coordinates:</b> {city.coord.lat}&deg; {city.coord.lon}&deg;</p>
        </Card.Body>
    );
}
 
export default CityWeatherDetail;
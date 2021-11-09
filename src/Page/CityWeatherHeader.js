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
import './Page.css';

/**
 * City weather information summary. Expects a prop named city. This prop
 * should contain the weather information for a city.
 */
function CityWeatherHeader({ city })
{
    return(
        <>
        <div className="col-md-8">
            <p>
               <img src={`http://openweathermap.org/images/flags/${city.sys.country.toLowerCase()}.png`} 
                    alt={`${city.sys.country.toLowerCase()} flag`} className="flag"/>
                <span>
                    <b className="city"> {city.name}, {city.sys.country}</b>
                </span>
            </p>
                <p>Feels like <b>{city.main.feels_like}&deg;C</b>, {city.weather[0].description}.</p>
            <p>
                <img src={`https://openweathermap.org/img/wn/${city.weather[0].icon}.png`} alt={city.weather[0].main} className="weather-img"/>
                <span id="temp">{city.main.temp}&deg;C</span>
            </p>
        </div>
        <div className="col-md-1 col align-self-end">
            <p className="indicator"><b id={`indicator-${city.id}`}>+</b></p>
        </div>
        </>
    );
}
 
export default CityWeatherHeader;
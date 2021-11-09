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
import './HomeWeather.css';

/**
 * Gets and displays the weather at the browser location. The location is obtained from 
 * the parent Home component. It expects as props the history object as history and 
 * the latitude and longitude as lat and lon. 
 * 
 * It can send the app to the /city/:id path when it is clicked, where id is the 
 * id of the city closest to the browser location.
 * 
 * Has a state weather object storing the weather information 
 */
class HomeWeather extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {weather: false};
        this.getWeather = this.getWeather.bind(this);
        this.toDetailedWeather = this.toDetailedWeather.bind(this);
    }

    //Start getting the weather after the component mounts
    componentDidMount()
    {
        this.getWeather(this.props.lat, this.props.lon);
    }

    coordToStr(coord)
    {
        return Number.parseFloat(coord).toFixed(2);
    }

    /**
     * Gets the weather at the given coordinates
     */
    getWeather(lat, lon) 
    {
        let appid = process.env.REACT_APP_OPENWEATHER_KEY;
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.coordToStr(lat)}&lon=${this.coordToStr(lon)}&units=metric&appid=${appid}`;
        //console.log(this.props);
        fetch(url, {method: "GET"}).then((resData)=>{ 
            if (resData.ok) //Checks if the response is ok
                return resData.json();
            else 
                return { error: true }
         }).then(data => {
            if (data)
                this.setState({weather: data, error: false});
        }).catch((err)=>{
            console.log("Unable to get resources due to:" + err);
            this.setState({weather: false, error: true});
        })
    };

    //Sends the app to the /city/:id path with the detailed weather information.
    //Sends the already found data along to reduce API calls
    //Triggered on click of the rendered element
    toDetailedWeather()
    {
        //console.log(this.state.weather);
        this.props.history.push(`/city/${this.state.weather.id}`, {weather: [this.state.weather]});
    }

    /**
     * Changes the background color on hover. 
     */
    forceHoverStyle(e)
    {
        e.currentTarget.style.backgroundColor = "lavender";
    }

    /**
     * Changes the background color on mouse off. 
     */
    forceHoverOffStyle(e)
    {
        e.currentTarget.style.backgroundColor = "white";
    }

    render()
    {
        let weatherData = this.state.weather;
        let dateOpt = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        //Renders the data if retrieved, otherwise prints waiting message. Will redirect to error page
        //if fetch fails.
        if (weatherData) {
            return(
                <Card className="location-weather col-md-8" onClick={this.toDetailedWeather} 
                                                            onMouseOver={this.forceHoverStyle} 
                                                            onMouseLeave={this.forceHoverOffStyle}>
                    <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                    <p>{new Date().toLocaleDateString('en-CA', dateOpt)}</p>
                    <h1>{weatherData.main.temp}&deg;C</h1>
                    <h3>
                        <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} alt={weatherData.weather[0].main} className="weather-img"/>
                        <b>{weatherData.weather[0].description}</b>
                    </h3>
                    <p>{weatherData.main.temp_max}&deg;C/{weatherData.main.temp_min}&deg;C</p>
                </Card>
            )
        } else if (this.state.error) {
            this.props.history.push("/error", {msg: "Could not obtain weather from OpenWeatherMap."});
        } else {
            return <div>Retrieving weather data</div>
        }
        
    }

}
export default HomeWeather;
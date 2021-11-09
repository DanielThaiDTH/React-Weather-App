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
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Error from '../Error';
import CityWeatherHeader from './CityWeatherHeader';
import CityWeatherDetail from './CityWeatherDetail';
import PageNav from './PageNav.js';

/**
 * Represents a page of weather data. It expects history, location and match objects as props. It also expects
 * the returnID prop to be a function that takes an object representing a city.
 * The Component has several state variables: 
 *   weather is an array that contains objects with weather information.
 *   activeCity stores a string storing the id of the most recently visited city
 *   activeCityIsOpen is a boolean indicating if the activeCity panel is opened
 *   singlecity is a boolean indicating if the page nav needs to be rendered
 *   id is an optional string storing the city id
 * 
 * Uses CityWeatherHeader for the summary panel, CityWeatherDetail for the detail panel and PageNav
 * for the page navigation
 */
class Page extends React.Component
{
    constructor(props)
    {
        super(props);
        //console.log(props);

        if (props.singleCity)
            this.state = {weather: null, activeCity: null, activeCityIsOpen: false, singleCity: props.singleCity, id: props.match.params.id};
        else if (props.weather)
            this.state = {weather: props.weather, activeCity: null, activeCityIsOpen: false, singleCity: false};
        else
            this.state = {weather: null, activeCity: null, activeCityIsOpen: false, singleCity: false};

        this.cardStyle = { margin: "30px auto", borderWidth: "1px", borderStyle: "solid", borderColor: "lightgrey", padding: "0px 12px" };
        this.cardHeadStyle = { backgroundColor: "white", borderWidth: "1px", borderStyle: "solid", borderColor: "lightgrey", padding: "0px" };
        this.pageEndStyle = { backgroundColor: "white" };
        //console.log(this.state);
        this.saveVisit = this.saveVisit.bind(this);
        this.getCityWeather = this.getCityWeather.bind(this);
        this.validWeather = this.validWeather.bind(this);
    }

    
    /**
     * Lifecycle function that is called immediately before render. Called when the props are changed (React does not recall the constructor 
     * when props are changed,so this is necessary)
     */
    static getDerivedStateFromProps(props, state)
    {
        // console.log("Getting Props: ");
        // console.log(props);

        //Case where Page was accessed with a history.push with a weather array and no id parameter 
        //This happens when the WeatherApp gets the results from search uses history.push to the first page 
        if (props.location && props.location.state && props.location.state.weather && !props.match.params.id) {
            return {weather: props.location.state.weather, singleCity: false};
        //Case where Page was accessed with a history.push with a weather array and and a id parameter, set single city state to remove pagination
        //Only happens when HomeWeather redirects here. The weather array means another fetch is unnecessary, data already found by HomeWeather.
        } else if (props.location && props.location.state && props.location.state.weather && props.match.params && props.match.params.id) {
            return {weather: props.location.state.weather, singleCity: true, id: parseInt(props.match.params.id)}; //params passed as string, Json id will be an int
        //Case where Page was accessed with a link and a page number was given, generally by clicking the page number, meaning weather is passed as props.weather
        } else if (props.weather && props.match.params && props.match.params.num) {
            return {weather: props.weather, singleCity: false};
        //Case where Page is accessed with a link (location is not needed, Page will fetch city weather matching the id)
        //Happens when use clicks on a previously visited city in the dropdown
        } else if (props.match.params && props.match.params.id) {
            return {singleCity: true, id: parseInt(props.match.params.id)}; //params passed as string, Json id will be an int
        }
        console.log("Missing location, location.state, weather, id parameter or page parameter in updated props.");
        return {};
    }

    /**
     * Gets the city weather for a single city. Only called when visiting a previously visited city, that is using the 
     * path '/city/:id'. Saves new weather state when successful, otherwise redirects to the error page.
     */
    getCityWeather() {
        let appid = process.env.REACT_APP_OPENWEATHER_KEY;
        let url = `https://api.openweathermap.org/data/2.5/weather?id=${this.state.id}&units=metric&appid=${appid}`;

        // Only call the API when the current weather object is null, the size of current weather array > 1 or the currect city is differnet from the new city
        // Will replace the old weather data. Only called when visiting a previously visited city.
        // Prevents constant calls to API when a single city is displayed
        if (!this.state.weather || (this.state.weather[0].id !== this.state.id && this.state.weather.length === 1) || this.state.weather.length > 1) {
            fetch(url, {method:"GET"}).then(data=>{ return data.json();})
            .then(data=>{
                //console.log(data);
                if (data.cod===200) {
                    this.setState({weather: [data]});
                }  else if (parseInt(data.cod)===404)  {
                    this.props.history.push('/error', {msg: "This city was not found."});
                }  else  {
                    this.props.history.push('/error', {msg: "Could not connect to OpenWeatherMap."});
                }
            }).catch(err=>{
                console.log("Error accessing OpenWeatherMap due to: "+err);
                this.props.history.push('/error', {msg: "Error accessing OpenWeatherMap" });
            });
        } else {
            console.log("No fetch, same city");
        }
    };

    /**
     * Does two functions, it sends the id of the newly visited city if it is not the 
     * same as the one before, and it toggles the open close indicator on the city
     * weather panels. The indicator is in CityWeatherHeader.
     * Expects and event, so it must be attached to an element. Attached to the Card in
     * this case.
     * 
     * No return, but it calls the returnID callback passed from the WeatherApp, returning
     * the new visited id and city name.
     */
    saveVisit(e)
    {
        let ele, oldid = this.state.activeCity, newid = e.currentTarget.id;
        //Checks if a previous city was visited
        if (oldid) {
            ele = document.getElementById(`indicator-${oldid}`);
            //Only toggle the indicator if it is present on screen and if it is either 
            //the same panel or a previous panel that is open
            if (ele && ((this.state.activeCityIsOpen && oldid !== newid) || oldid === newid)) 
                ele.innerHTML = this.toggleIndicator(ele.innerHTML);
        }
 
        //If a new city is clicked, set the open state and save the new id
        if (oldid !== newid) {
            this.setState({activeCity: newid, activeCityIsOpen: true}, ()=>{
                //Finds the matching city name for the new id
                let match = this.state.weather.find(city=>city.id===parseInt(newid));
                let cityStr = match.name+", "+match.sys.country;
                //Toggle the new city indicator
                ele = document.getElementById(`indicator-${newid}`);
                if (ele)
                    ele.innerHTML = this.toggleIndicator(ele.innerHTML);
                this.props.returnID({id: newid, name: cityStr});
            });
        } else {
            //Toggles the open state when the same panel is clicked again
            this.setState( prevState => ({activeCityIsOpen: !prevState.activeCityIsOpen}) );
        }
    }

    toggleIndicator(current)
    {
        return (current === "+")?"-":"+";
    }

    /**
     * Checks if the state weather object is valid for rendering.
     * Will return false if it is not a valid array or the id 
     * does not exist or has a length of 0.
     */
    validWeather()
    {
        if (Array.isArray(this.state.weather)) {
            if (!this.state.weather[0].id || this.state.weather.length === 0)
                return false;
            else
                return true;
        } else {
            console.log("Not an array");
            return false;
        }
    }

    /**
     * Changes the background color on hover. For the city weather header.
     */
    forceHoverStyle(e)
    {
        e.currentTarget.style.backgroundColor = "lavender";
    }

    /**
     * Changes the background color on mouse off. For the city weather header.
     */
    forceHoverOffStyle(e)
    {
        e.currentTarget.style.backgroundColor = "white";
    }

    render()
    {
        // console.log(this.props.history);
        // console.log("Rendering: ");
        // console.log(this.state.weather);
        if (this.state.singleCity)
            this.getCityWeather();

        if (!this.validWeather()) {
            return(<Error msg="Nothing searched"/>);
        } else {
            return(
                <div>
                    {/* Page navigation. Will not appear when visiting a previous city using the dropdown*/}
                    {!this.state.singleCity && <PageNav pageNum={this.props.match.params.num} pages={this.props.pages}/>}
                    {/* Main content of the page */}
                    <Accordion className="city-info justify-content-left text-start col-md-9">
                        {this.state.weather.map(city => 
                            //Weather info for a single city. Inline styles used to override default bootstrap styles
                            <Card key={city.id} style={this.cardStyle}>
                                {/* The panel will expand when it is clicked. Also has hover styles and an event to record 
                                    the id when a new city is clicked. */}
                                <Accordion.Toggle as={Card.Header} eventKey={city.id} id={city.id} 
                                                                    style={this.cardHeadStyle} onClick={this.saveVisit} 
                                                                    onMouseOver={this.forceHoverStyle} 
                                                                    className="row justify-content-between" 
                                                                    onMouseLeave={this.forceHoverOffStyle}>
                                    <CityWeatherHeader city={city}/>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={city.id}>
                                    <CityWeatherDetail city={city}/>
                                </Accordion.Collapse>
                            </Card>
                        )}
                    </Accordion>
                    {/* Page navigation. Will not appear when visiting a previous city using the dropdown*/}
                    {!this.state.singleCity && <PageNav pageNum={this.props.match.params.num} pages={this.props.pages}/>}
                </div>
            );
        }
    }
}

export default Page;
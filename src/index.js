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
import ReactDOM from 'react-dom';
import { Route,
         Router,
         Switch
      } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { createBrowserHistory } from 'history';
import './index.css';
import Home from "./Home";
import Search from './Search';
import Page from './Page/Page';
import Error from './Error';

let g_cityList = [];

var history = createBrowserHistory(); //create a history object, will be used in the app.

/**
 * The main component of the app. Gets weather information according to 
 * user input and displays the results. Uses OpenWeatherMap. Has a home 
 * page, error page, results pages and city pages. Has a link to the 
 * home route and a dropdown menu linking previously visited cities.
 * 
 * Has the state variable weather  which stores the weather objects for each 
 * city grouped into three.
 * Has the state variable recentlyViewed storing objects with ids and names 
 * for cities that were most recently opened. Max size is 10 by default.
 * 
 * Takes a cityList prop storing the list of cities from the JSON
 * Takes a history prop which is the history object used for redirection
 * Takes a maxHistory prop which is the max array size of the previously visited cities
 * Takes a citiesPerPage prop which the number of cities displayed per page
 */
class WeatherApp extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = { weather:[], recentlyViewed:[], searchId:"" };
        this.getResults = this.getResults.bind(this);
        this.newVisitedCity = this.newVisitedCity.bind(this);
    }

    /**
     * This function takes in an array of weather data objects, splits it into
     * groups of three and stores them in the state.weather array. Once it is stored,
     * it redirects to the path '/page/1' and passes the first group of results to the 
     * Page component.
     * If no results or not a proper array, will redirect to the error message.
     * 
     * This function will be passed as a prop to subcomponents to allow them to 
     * communicate with the main component.
     */
    getResults(results)
    {
        if (results && Array.isArray(results)) {
            results = this.splitResults(results);
            this.setState({weather: results}, ()=>{
                this.props.history.push('/page/1', {weather: this.state.weather[0], pages: this.state.weather.length});
                // console.log("Updated: ");
                // console.log(this.state.weather);
            });
        } else {
            this.props.history.push('/error', {msg: "No cities matching your search."});
        }
    }

    /**
     * Splits the array of city weather into groups of three, which are then
     * placed inside another array. Each group represents one page of weather.
     * Returns that array.
     * 
     * Expects an array of weather objects.
     */
    splitResults(results)
    {
        var pageArr = [];
        let count = 0;

        while(results.length > 0) {
            pageArr.push([]);

            for (let i = 0; i < this.props.citiesPerPage; i++) {
                if (results.length > 0)
                    pageArr[count].push(results.shift());
            }

            if (pageArr[count].length === 0)
                pageArr.pop();

            count++;
        }

        //console.log(pageArr);
        return pageArr;
    }

    /**
     * Adds a city to the list of visited cities.
     */
    newVisitedCity(id)
    {
        // console.log("Pushing " + id);
        // console.log(this.state.recentlyViewed);
        this.setState((prevSt)=>{
            if (prevSt.recentlyViewed.push(id) > this.props.maxHistory)
                prevSt.recentlyViewed.shift();
            return {recentlyViewed: prevSt.recentlyViewed};
        });
    }

    render() {
        return (
        <div>
            <Router history={this.props.history}>
                {/* The navigation bar containing the home link and the dropdown menu with visited cities */}
                <div>
                    <Navbar className="navbar" variant="light">
                        <LinkContainer to="/">
                            <Navbar.Brand>BTI425 - Weather</Navbar.Brand>
                        </LinkContainer>
                        <Navbar.Collapse>
                            <Nav>
                                <NavDropdown title="Previously Viewed" id="basic-nav-dropdown">
                                    {/* Spread operator used because the reverse was affecting the order of the viewed array */}
                                    {/* Reverse used to place most recent city at the top of the dropdown */}
                                    {this.state.recentlyViewed.length > 0 ? this.state.recentlyViewed.slice().reverse().map((city,index)=>
                                        <LinkContainer to={`/city/${city.id}`} key={index} className="item-container">
                                            <NavDropdown.Item className="visited-city-item">{city.id+": "+city.name}</NavDropdown.Item>
                                        </LinkContainer>
                                    ):<NavDropdown.Item className="visited-city-item">...</NavDropdown.Item>}
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <Search cityList= {this.props.cityList} returnResults= {this.getResults}/>
                </div>
                {/* Main content div */}
                <div className="content container-fluid col-md-10 justify-content-center text-center">
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/page" render={props=>{
                            let routeProps = {...props, returnID: this.newVisitedCity};
                            return (<Page {...routeProps}/>)
                        }}/>
                        <Route exact path="/page/:num" render={props=>{
                            let pgNum = parseInt(props.match.params.num);
                            if (isNaN(pgNum)) {
                                let routeProps = {...props, msg: "Not a proper page number."};
                                return (<Error {...routeProps}/>);
                            } else if (pgNum <= this.state.weather.length && pgNum > 0) {
                                //Since the page number is indexed starting at 1, the assocated group of weather objects is at index page number - 1
                                let routeProps = {...props, returnID: this.newVisitedCity, weather: this.state.weather[pgNum-1], pages: this.state.weather.length};
                                return (<Page {...routeProps}/>);
                            } else if (this.state.weather.length !== 0){
                                let routeProps = {...props, msg: "Page number out of range."};
                                return (<Error {...routeProps}/>);
                            } else {
                                let routeProps = {...props, msg: "No results to display."};
                                return (<Error {...routeProps}/>);
                            }
                        }}/>
                        <Route exact path="/city/:id" render={props=>{
                            let routeProps = {...props, returnID: this.newVisitedCity, singleCity: true};
                            return (<Page {...routeProps}/>)
                        }}/>
                        <Route exact path="/error" component={Error}/>
                        <Route render={props=>{
                            let routeProps = {...props, msg: "Not a proper url."};
                            return (<Error {...routeProps}/>)
                        }}/>
                    </Switch>
                </div>
            </Router>
        </div>);
    }
}

 //full path used to prevent bug with a refresh on a /city/:id
 //causing fetch to be http://localhost:3000/city/city.list.min.json
fetch("http://localhost:3000/city.list.min.json")
.then(data=>data.json())
.then( (data) => {
    data.forEach((cityJSON)=>{
        g_cityList.push({id: cityJSON.id, name: cityJSON.name.toLowerCase(), country: cityJSON.country.toLowerCase()}) ;
    });
    //Obtains the list of cities before rendering the page
    ReactDOM.render(
        <WeatherApp cityList={g_cityList} history={history} maxHistory={10} citiesPerPage={3}/>
        ,
        document.getElementById('root')
    );
}).catch((err)=>console.log(err));



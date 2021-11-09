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
import './Search.css';

/**
 * This component provides the search functionality for the app. The search ignores leading and 
 * trailing spaces and uses the format "city_name,country_code". Has a search field and a button.
 * 
 * It expects as a prop a cityList that contains an array of city information.
 * It also expects a prop called returnResults will contain a function that will 
 * take an array of weather data objects as an argument. This function is the only
 * way to communicate back to the parent component.
 */
class Search extends React.Component 
{
    constructor(props) {
        super(props);
        this.searchCity = this.searchCity.bind(this);
        this.singleCityWeather = this.singleCityWeather.bind(this);
        this.findWeather = this.findWeather.bind(this);
        this.buildDataList = this.buildDataList.bind(this);
    }

    getCityIDs = function(query) {
        var cityIDs = [];
    
        //Removes regex characters (. is used by city names)
        //Otherwise a search of .* would return thousands of cities
        query = query.replace(/[*+()]/g,""); 
        let queryArr = query.split(","); //Split string at the comma
        queryArr[0] = queryArr[0].trim();
        if (queryArr[1]) //If country code is included
            queryArr[1] = queryArr[1].trim();
    
        //Regex to match whole word or with comma at the end to names formatted in a certain way (ex. Paso, El)
        let reCityQuery = "^" + queryArr[0].toLowerCase() + "($|,)"; 
        let reCountryQuery = "";
    
        //First case:country code given and not blank, build regex
        if (queryArr.length > 1 && queryArr[1])
            reCountryQuery += "^" + queryArr[1].toLowerCase() + "$";
        else //otherwise match any country
            reCountryQuery += ".*";
    
        this.props.cityList.forEach(cityJSON => {
            if (cityJSON.name.match(reCityQuery) && cityJSON.country.match(reCountryQuery))
                cityIDs.push(cityJSON.id);
        });
    
        return cityIDs;
    };

    singleCityWeather(query)
    {
        let appid = process.env.REACT_APP_OPENWEATHER_KEY;
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&cnt=5&appid=${appid}`;
        console.log(url);
        fetch(url, {method:"GET"}).then(data=>{return data.json()})
        .then(data=>{
            if (data.cod===200) //checks Success code
                this.props.returnResults([data]);
            else
                this.props.returnResults(null);
        }).catch(err=>{
            console.log("Error accessing OpenWeatherMap due to: "+err);
            this.props.returnResults(null);
        });
    }

    findWeather(idQuery) {
        let appid = process.env.REACT_APP_OPENWEATHER_KEY;
        let url = `https://api.openweathermap.org/data/2.5/group?id=${idQuery}&units=metric&appid=${appid}`;
        //console.log("Searching using: "+idQuery);
        fetch(url, {method:"GET"}).then(data=>data.json())
        .then(data=>{
            this.props.returnResults(data.list);
        }).catch(err=>{
            console.log("Error accessing OpenWeatherMap due to: "+err);
            this.props.returnResults(null);
        });
    };

    splitGetWeather = function(idList) {
        let listOfList = [];
        let numOfLoops = Math.floor(idList.length/20);
        // console.log("Searching using: ");
        // console.log(idList);
        for (let loops = 0; loops < numOfLoops; loops++) {
            let tempList = [];
            //Loop breaks out idList has no more elements
            for (let i = 0; i < 20; i++) {
                if (idList.length === 0)
                    break;
                tempList.push(idList.pop()); //move IDs from idList to the group
            }
            listOfList.push(tempList);
        }
    
        listOfList.push(idList);
        this.buildDataList(listOfList);
    };

    buildDataList(listOfList, dataList=[]) {
        let appid = process.env.REACT_APP_OPENWEATHER_KEY;
        if (listOfList.length === 0) {
            this.props.returnResults(dataList);
        } else {
            let idQuery = listOfList.pop().join(","); //Take group of IDs from array and create valid API string
            let url = `https://api.openweathermap.org/data/2.5/group?id=${idQuery}&units=metric&appid=${appid}`;

            fetch(url ,{method: "GET"}).then(data=>data.json())
            .then(data=>{
                dataList = dataList.concat(data.list); //Bulding array of results
                this.buildDataList(listOfList, dataList); //Passing the remaining IDs and results
            }).catch(err=>{
                console.log("Error accessing OpenWeatherMap due to: "+err);
                this.props.returnResults(null);
            });
        }
    };

    searchCity(e) {
        e.preventDefault();
        let ids = this.getCityIDs(e.target.cityQuery.value); // Gets the city IDs matching the query
        if (ids.length > 0 && ids.length<= 20)
            this.findWeather(ids.join(",")); //Regular ajax call to the API
        else if (ids.length > 20)  // API limits 20 queries per call
            this.splitGetWeather(ids);
        else 
            this.singleCityWeather(e.target.cityQuery.value);
    }

    render() {
        return (<div className="text-center row justify-content-center search container-fluid">
            <form id="search-form" className="col-md-8"
                onSubmit={this.searchCity}>
                <input type="text" name="cityQuery" id="cityQuery" className="col-md-6 search-field" placeholder="Enter the city and country"/>
                <input value="Search" type="submit" className="btn btn-primary col-md-2 search-button"/>
            </form>
        </div>);
    }
}


export default Search;
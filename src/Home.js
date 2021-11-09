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
import HomeWeather from './HomeWeather';

/**
 * The Home component for the home route. Wraps HomeWeather and provides 
 * the location data to it.
 */
class Home extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {pos: null};
    }

    //Get the location after mounting
    componentDidMount()
    {
        navigator.geolocation.getCurrentPosition((position)=>{
            this.setState({pos: position});
        }, err=>console.log(err), {enableHighAccuracy: true});
    }

    render()
    {
        if (this.state.pos) {
            return(
                <HomeWeather lat={this.state.pos.coords.latitude} 
                             lon={this.state.pos.coords.longitude} 
                             history={this.props.history}/>
            );
        } else {
            //Waiting message
            return <div>Obtaining weather at your location.</div>
        }
    }
}
export default Home;
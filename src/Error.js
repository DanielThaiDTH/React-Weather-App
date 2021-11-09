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
import './Error.css';

/**
 * The error component that displays an error message highlighted in red.
 * Can be rendered with a history.push or as a component directly.
 * 
 * If called with history.push, there needs to be an object passed 
 * with a property msg containing the error message.
 * 
 * If used as a component, there needs to be a string msg prop that contains
 * the error message. 
 */
function Error(props)
{
    let errMsg = "No error message given.";

    if (props.msg) {
        errMsg = props.msg;
    } else if (props.location.state && props.location.state.msg) {
        errMsg = props.location.state.msg;
    }
    
    return(
        <Card className="error align-self-center col-md-6 justify-content-center text-center error alert-danger">
            {errMsg}
        </Card>
    );
}

export default Error;
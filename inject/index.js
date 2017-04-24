import React from 'react'
import ReactDOM from 'react-dom'

import init from './init'
import View from './view'

// Initialize the app tied to the window object for communicating with the runner
init()

try {
    // Render the view controller to DOM
    ReactDOM.render(
        <View />,
        document.getElementById('gutsyView')
    )
} catch (err) {
    console.error(err)
}

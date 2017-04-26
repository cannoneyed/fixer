import React, { Component } from 'react'
import controller from '../../controller'

export default class Finish extends Component {
    render() {
        return (
            <div>
                <button onClick={ () => controller.finish() }>
                    Finish
                </button>
            </div>
        )
    }
}

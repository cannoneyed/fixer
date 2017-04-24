import React, { Component } from 'react'
import controller from '../../controller'

export default class LoadComponents extends Component {
    render() {
        return (
            <div>
                <button onClick={ () => controller.loadComponents() }>
                    Load Components
                </button>
            </div>
        )
    }
}

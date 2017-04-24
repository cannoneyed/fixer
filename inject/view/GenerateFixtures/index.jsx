import React, { Component } from 'react'
import controller from '../../controller'

export default class GenerateFixtures extends Component {
    render() {
        return (
            <div>
                <button onClick={ () => controller.generateFixtures() }>
                    Generate Fixtures
                </button>
            </div>
        )
    }
}

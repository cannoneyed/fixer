import React, { Component } from 'react'
import { observer } from 'mobx-react'

import controller from '../../controller'

@observer
export default class LoadComponents extends Component {
    render() {
        const { areComponentsLoaded } = controller

        return (
            <div>
                <button onClick={ () => controller.loadComponents() }>
                    Load Components
                </button>
                { areComponentsLoaded && (
                    <button onClick={ () => controller.generateFixtures() }>
                        Generate Fixtures
                    </button>
                ) }
                { areComponentsLoaded && (
                    <button onClick={ () => controller.quickSelect() }>
                        Quick Select
                    </button>
                ) }
                <button onClick={ () => controller.finish() }>
                    Finish
                </button>
            </div>
        )
    }
}

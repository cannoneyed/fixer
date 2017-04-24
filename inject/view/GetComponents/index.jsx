import React, { Component } from 'react'
import controller from '../../controller'

import styles from './styles.css'

export default class GetComponents extends Component {
    render() {
        return (
            <div className={ styles.getComponentsContainer }>
                <button onClick={ () => controller.getComponents() }>
                    Get Components
                </button>
            </div>
        )
    }
}

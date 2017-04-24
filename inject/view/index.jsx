import React, { Component } from 'react'
import { observer } from 'mobx-react'

// import Components from './Components'
import GetComponents from './GetComponents'
import controller from '../controller'

import styles from './styles.css'

@observer
export default class View extends Component {
    render() {
        const { areComponentsLoaded } = controller

        return (
            <div className={ styles.appContainer }>
                { areComponentsLoaded ? (
                    <span>Loaded</span>
                ) : (
                    <GetComponents />
                )}
            </div>
        )
    }
}

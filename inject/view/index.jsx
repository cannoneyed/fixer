import React, { Component } from 'react'

import styles from './styles.css'

export default class View extends Component {
    render() {
        console.log('🍕 heyeyeye', styles.appContainer)
        return (
            <div className={ styles.appContainer }>
                <h1>FUCK YOU</h1>
            </div>
        )
    }
}

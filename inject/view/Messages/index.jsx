import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { StyleSheet, css } from 'aphrodite'

import controller from '../../controller'

@observer
export default class Messages extends Component {
    render() {
        const { message } = controller

        return (
            <div className={ css(styles.message) }>
                { message }
            </div>
        )
    }
}

const styles = StyleSheet.create({
    message: {
        fontWeight: 'bold',
    },
})

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { StyleSheet, css } from 'aphrodite'

import ConfigEditor from './ConfigEditor'
import ComponentList from './ComponentList'
import Controls from './Controls'
import Messages from './Messages'
import controller from '../controller'

@observer
export default class View extends Component {
    render() {
        const { areComponentsLoaded } = controller

        return (
            <div className={ css(styles.appContainer) }>
                <ConfigEditor />
                <Messages />
                { areComponentsLoaded && <ComponentList /> }
                <Controls />
            </div>
        )
    }
}


const styles = StyleSheet.create({
    appContainer: {
        position: 'fixed',
        zIndex: 99999,
        top: 20,
        left: 20,
        padding: 5,

        backgroundColor: 'white',
        boxShadow: '10px 10px 50px black',
        borderRadius: 5,
    },
})

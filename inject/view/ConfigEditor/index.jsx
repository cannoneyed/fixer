import React, { Component } from 'react'
import map from 'lodash.map'
import { observer } from 'mobx-react'
import { StyleSheet, css } from 'aphrodite'

import controller from '../../controller'

window.map = map

@observer
export default class ConfigEditor extends Component {
    onPageNameChange = (event) => {
        controller.config.pageName = event.target.value
    }

    onRootSelectorChange = (event) => {
        controller.config.rootSelector = event.target.value
    }

    render() {
        if (!controller.config) {
            return null
        }

        const { pageName, rootSelector } = controller.config
        return (
            <div className={ css(styles.section) }>
                <div className={ css(styles.row) } >
                    <span>Page Name</span>
                    <input
                        type='text'
                        value={ pageName }
                        onChange={ this.onPageNameChange }
                    />
                </div>
                <div className={ css(styles.row) } >
                    <span>Root Selector</span>
                    <input
                        type='text'
                        value={ rootSelector }
                        onChange={ this.onRootSelectorChange }
                    />
                </div>
            </div>
        )
    }
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 5,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})

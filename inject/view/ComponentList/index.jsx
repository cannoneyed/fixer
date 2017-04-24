import React, { Component } from 'react'
import map from 'lodash.map'
import { observer } from 'mobx-react'
import { StyleSheet, css } from 'aphrodite'

import controller from '../../controller'

import ComponentListing from '../ComponentListing'

@observer
export default class ComponentList extends Component {
    render() {
        const { components } = controller

        return (
            <div className={ css(styles.section) }>
                { map(components, (instances, fileName) => (
                    <ComponentListing key={ fileName } instances={ instances } />
                )) }
            </div>
        )
    }
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 5,
    },
})

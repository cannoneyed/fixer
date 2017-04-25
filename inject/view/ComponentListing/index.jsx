import React, { Component, PropTypes } from 'react'
import { map, filter } from 'lodash'
import { observer } from 'mobx-react'
import { StyleSheet, css } from 'aphrodite'

import Instance from '../Instance'

@observer
export default class ComponentListing extends Component {
    static propTypes = {
        instances: PropTypes.object,
    }

    state = {
        isOpen: false,
        isSelected: false,
        isHighlighted: false,
    }

    setHighlightElements = (isHighlighted) => {
        const { instances } = this.props
        map(instances, instance => {
            const { element } = instance
            element.style.border = isHighlighted ? '4px solid orange' : 'none'
        })
        this.setState({
            isHighlighted,
        })
    }

    clickComponentHeader = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        })
    }

    handleCheckmarkChange = (event) => {
        const { instances } = this.props
        const { target } = event

        this.setState({
            isSelected: target.checked,
        })

        // Deselect all child instances
        map(instances, instance => {
            instance.isSelected = target.checked
        })
    }

    renderNumber = () => {
        const { instances } = this.props
        const selectedInstances = filter(instances, instance => instance.isSelected).length

        /* eslint-disable prefer-template */
        return (
            <span className={ css(selectedInstances ? styles.instancesSelected : null) }>
                {` (${ selectedInstances ? selectedInstances + ' / ' : '' }${ instances.length })`}
            </span>
        )
        /* eslint-enable */
    }

    render() {
        const { isOpen, isHighlighted, isSelected } = this.state
        const { instances } = this.props

        const { name } = instances[0]

        return (
            <div
                className={ css(styles.section) }
            >
                <span
                    onMouseEnter={ () => this.setHighlightElements(true) }
                    onMouseLeave={ () => this.setHighlightElements(false) }
                >
                    <input
                        type='checkbox'
                        checked={ isSelected }
                        onChange={ this.handleCheckmarkChange }
                        className={ css(styles.checkmark) }
                    />
                    <span
                        onClick={ this.clickComponentHeader }
                        className={ css(styles.title, isHighlighted && styles.highlighted) }
                    >
                        { name }
                        { this.renderNumber() }
                    </span>
                </span>
                { isOpen && map(instances, (instance, index) => {
                    return <Instance instance={ instance } key={ index } index={ index } />
                }) }
            </div>
        )
    }
}

const styles = StyleSheet.create({
    section: {
        cursor: 'default',
    },
    checkmark: {
        marginRight: 5,
    },
    highlighted: {
        color: '#F96854',
    },
    instancesSelected: {
        color: '#006375',
    },
    title: {
        fontWeight: 'bold',
    },
})

import React, { Component, PropTypes } from 'react'
import { observer } from 'mobx-react'
import { StyleSheet, css } from 'aphrodite'

@observer
export default class Instance extends Component {
    static propTypes = {
        index: PropTypes.number,
        instance: PropTypes.object,
    }

    state = {
        isHighlighted: false,
        isEditing: false,
    }

    setHighlightElement = (isHighlighted) => {
        const { instance } = this.props
        instance.element.style.border = isHighlighted ? '4px solid orange' : 'none'
        this.setState({
            isHighlighted,
        })
    }

    clickInstance = () => {
        const { instance } = this.props
        instance.isSelected = !instance.isSelected
    }

    handleCheckmarkChange = (event) => {
        const { instance } = this.props
        const { target } = event

        this.setState({
            isSelected: target.checked,
        })

        // Deselect all child instances
        instance.isSelected = target.checked
    }

    render() {
        const { isHighlighted } = this.state
        const { instance, index } = this.props
        const { isSelected, nameOverride } = instance

        const name = nameOverride || `Instance ${ index + 1 }`

        return (
            <div
                className={ css(styles.section) }
                onMouseEnter={ () => this.setHighlightElement(true) }
                onMouseLeave={ () => this.setHighlightElement(false) }
            >
                <input
                    type='checkbox'
                    checked={ isSelected }
                    onChange={ this.handleCheckmarkChange }
                    className={ css(styles.checkmark) }
                />
                <span
                    onClick={ this.clickInstance }
                    className={ css(isHighlighted && styles.highlighted) }
                >
                    { name }
                </span>
            </div>
        )
    }
}

const styles = StyleSheet.create({
    section: {
        cursor: 'default',
        marginLeft: 10,
    },
    checkmark: {
        marginRight: 5,
    },
    highlighted: {
        color: 'orange',
    },
})

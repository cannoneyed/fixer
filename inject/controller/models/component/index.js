import { map } from 'lodash'
import { observable } from 'mobx'

export default class ComponentModel {
    @observable isSelected = false
    @observable nameOverride = null

    constructor(data) {
        map(data, (attribute, key) => {
            this[key] = attribute
        })
    }
}

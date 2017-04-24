import map from 'lodash.map'
import { observable } from 'mobx'

export default class ComponentModel {
    @observable selected = false

    constructor(data) {
        map(data, (attribute, key) => {
            this[key] = attribute
        })
    }
}

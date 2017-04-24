import { map } from 'lodash'
import { observable } from 'mobx'

import ComponentModel from './models/component'

import generateTestJSON from './parse'
import traverseReactDOM from './traverse'

class GutsyController {
    @observable components = []
    @observable fixtures = []
    @observable areComponentsLoaded = false

    addComponent = (component) => {
        this.components.push(new ComponentModel(component))
    }

    addFixture = (fixture) => {
        // this.components.push(new FixtureModel(fixture))
    }

    // Externally defined methods
    traverseReactDOM = traverseReactDOM
    generateTestJSON = generateTestJSON

    initialize = (params) => {
        const {
            rootSelector,
            fnPlaceholder,
            reactElementPlaceholder,
            rootDirName,
        } = params

        this.rootSelector = rootSelector
        this.fnPlaceholder = fnPlaceholder
        this.reactElementPlaceholder = reactElementPlaceholder
        this.rootDirName = rootDirName

        console.log('🌵 gutsy inititalized 🌵')
    }

    getComponents = () => {
        const components = this.traverseReactDOM()
        map(components, (instances) => {
            map(instances, instance => {
                this.addComponent(instance)
            })
        })

        this.areComponentsLoaded = true
        console.log('🌵 components loaded 🌵')
    }

    generateFixures = () => {
        const fixtures = {}
        map(this.components, (componentList, key) => {
            const component = this.components[0]

            fixtures[key] = {
                name: component.name,
                json: this.generateTestJSON(component.props),
                filename: key,
            }
        })
    }
}

const gutsyController = new GutsyController()
export default gutsyController

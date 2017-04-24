import { map } from 'lodash'
import { observable } from 'mobx'

import ComponentModel from './models/component'

import generateTestJSON from './parse'
import traverseReactDOM from './traverse'

class GutsyController {
    fixtures = {}
    @observable config = null
    @observable components = {}
    @observable areComponentsLoaded = false
    @observable areFixturesGenerated = false

    // Externally defined methods
    traverseReactDOM = traverseReactDOM
    generateTestJSON = generateTestJSON

    log = (message) => console.log(`🌵 ${ message } 🌵`)

    initialize = (config) => {
        this.config = observable(config)
        this.log('inititalized')
    }

    loadComponents = () => {
        const instances = this.traverseReactDOM()

        // Map the returned instances to a map by component filename
        const components = {}
        map(instances, instance => {
            const { fileName } = instance
            const component = new ComponentModel(instance)
            components[fileName] = components[fileName] || []
            components[fileName].push(component)
        })

        this.components = observable(components)
        this.areComponentsLoaded = true
        this.log('components loaded')
    }

    generateFixtures = () => {
        map(this.components, (instances, fileName) => {
            const fixtures = {}

            instances
                .filter(instance => instance.isSelected)
                .map((instance, index) => { // eslint-disable-line
                    const instanceName = instance.nameOverride || index
                    const fixtureName = `${ this.config.pageName }-${ instanceName }`
                    fixtures[fixtureName] = {
                        name: instance.name,
                        json: this.generateTestJSON(instance.props),
                        fileName,
                    }
                })
            if (Object.keys(fixtures).length) {
                this.fixtures[fileName] = fixtures
            }
        })
        this.areFixturesGenerated = true
        this.log('fixtures generated')
    }
}

const gutsyController = new GutsyController()
export default gutsyController

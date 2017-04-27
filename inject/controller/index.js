import { map } from 'lodash'
import { action, observable } from 'mobx'

import ComponentModel from './models/component'

import generateTestJSON from './parse'
import traverseReactDOM from './traverse'

class FixerController {
    status = null
    fixtures = {}
    @observable config = null
    @observable components = {}
    @observable areComponentsLoaded = false
    @observable areFixturesGenerated = false

    @observable message = null
    @action setMessageFromScript = (_message) => {
        this.message = _message
    }

    // Externally defined methods
    traverseReactDOM = traverseReactDOM
    generateTestJSON = generateTestJSON

    log = (message) => console.log(`🌵 ${ message } 🌵`)

    initialize = (config) => {
        this.config = observable(config)
        this.log('inititalized')
    }

    resetComponents = () => {
        this.components = observable({})
        this.areComponentsLoaded = false
    }

    loadComponents = () => {
        const instances = this.traverseReactDOM()

        if (instances.length === 0) {
            this.message = `No components for selector ${ this.config.rootSelector }`
            return
        }

        // Map the returned instances to a map by component filename
        const components = {}
        map(instances, instance => {
            const { fileName } = instance
            const component = new ComponentModel(instance)
            components[fileName] = components[fileName] || []
            components[fileName].push(component)
        })

        this.message = `Loaded ${ instances.length } component${ instances.length === 1 ? '' : 's' }`
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
                    const fixtureName = `${ this.config.pageName }_${ instanceName }`
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
        this.resetComponents()
        this.status = 'fixtures_generated'
        this.log('fixtures generated')
    }

    quickSelect = () => {
        // Quickly select only the first instance of every component on the page
        map(this.components, instances => {
            map(instances, instance => instance.isSelected = false)
            instances[0].isSelected = true
        })
    }

    finish = () => {
        this.status = 'finished'
    }
}

const fixerController = new FixerController()
export default fixerController

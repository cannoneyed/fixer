import { map } from 'lodash'

import generateTestJSON from './parse'
import traverseReactDOM from './traverse'

class GutsyController {
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
    }

    loadComponents = () => {
        this.components = traverseReactDOM(this.rootSelector)
    }

    generateFixures = () => {
        const fixtures = {}
        map(this.components, (componentList, key) => {
            const component = this.components[0]

            fixtures[key] = {
                name: component.name,
                json: generateTestJSON(component.props),
                filename: key,
            }
        })
    }
}

export default new GutsyController()

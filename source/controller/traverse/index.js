import { each } from 'lodash'
import findReact from './find-react'

export default function traverseReactDOM(rootSelector) {
    const rootElement = document.querySelector(rootSelector)
    const all = rootElement.getElementsByTagName('*')

    const instances = new WeakMap()
    const components = {}

    // Traverse over each element, selecting the React component instance for the element and
    // processing it into a map of react components
    each(all, element => {
        const component = findReact(element)

        if (component === null || instances.has(component)) {
            return
        }

        let name = component.constructor.name || component.constructor.displayName

        const { props, _source } = component

        if (!_source) {
            return
        }

        if (name === 'StatelessComponent') {
            const { rootDirName } = window.__testTackle
            name = _source.fileName
                .replace(`${ rootDirName }/`, '')
                .replace(/\/index.jsx?/, '')
        }

        const { fileName } = _source

        instances.set(component, true)

        components[fileName] = components[fileName] || []
        components[fileName].push({
            component,
            name,
            element,
            props,
            _source,
        })
    })

    return components
}

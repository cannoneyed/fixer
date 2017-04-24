import findReact from './find-react'

export default function traverseReactDOM() {
    const rootElement = document.querySelector(this.rootSelector)
    const all = rootElement.getElementsByTagName('*')

    const instances = new WeakMap()
    const components = {}

    // Traverse over each element, selecting the React component instance for the element and
    // processing it into a map of react components
    for (let index in all) { // eslint-disable-line
        const element = all[index]
        const instance = findReact(element)

        if (instance === null || instances.has(instance)) {
            continue // eslint-disable-line
        }

        let name = instance.constructor.name || instance.constructor.displayName
        const { props, source } = instance


        if (!source) {
            continue // eslint-disable-line
        }
        const { fileName } = source

        if (name === 'StatelessComponent') {
            name = fileName
                .replace(`${ this.rootDirName }/`, '')
                .replace(/\/index.jsx?/, '')
        }

        instances.set(instance, true)

        components[fileName] = components[fileName] || []
        components[fileName].push({
            instance,
            name,
            element,
            props,
            source,
        })
    }

    return components
}

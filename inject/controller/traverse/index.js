import findReact from './find-react'

export default function traverseReactDOM() {
    let rootElement
    let all
    try {
        rootElement = document.querySelector(this.config.rootSelector)
        all = rootElement.getElementsByTagName('*')
    } catch (err) {
        return []
    }

    const instancesMap = new WeakMap()
    const instances = []

    // Traverse over each element, selecting the React component instance for the element and
    // processing it into a map of react components
    for (let index in all) { // eslint-disable-line
        const element = all[index]
        const instance = findReact(element)

        if (instance === null || instancesMap.has(instance)) {
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
                .replace(`${ this.config.rootDirName }/`, '')
                .replace(/\/\w+.jsx?/, '') // Replace filename
                .split('/')
                .pop()
        }

        instancesMap.set(instance, true)

        instances.push({
            instance,
            name,
            element,
            props,
            fileName,
            localFileName: fileName.replace(`${ this.config.rootDirName }/`, ''),
        })
    }

    return instances
}

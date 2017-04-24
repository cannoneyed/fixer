export default function findReact(domElement) {
    for (let key in domElement) { // eslint-disable-line
        if (key.startsWith('__reactInternalInstance$')) {
            const compInternals = domElement[key]._currentElement

            // Get the source code file and line numbers from the internals
            const { _source } = compInternals

            const compWrapper = compInternals._owner
            const instance = compWrapper._instance

            // Attach the source code file and line numbers to the instance
            instance.source = _source
            return instance
        }
    }
    return null
}

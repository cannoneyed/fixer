import { map } from 'lodash'

export default function findReact(domElement) {
    map(domElement, (value, key) => {
        if (key.startsWith('__reactInternalInstance$')) {
            const compInternals = value._currentElement

            // Get the source code file and line numbers from the internals
            const { _source } = compInternals

            const compWrapper = compInternals._owner
            const comp = compWrapper._instance

            // Attach the source code file and line numbers to the instance
            comp._source = _source
            return comp
        }
        return null
    })
}

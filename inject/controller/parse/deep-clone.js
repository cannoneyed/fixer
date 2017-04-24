import map from 'lodash.map'
import { isReactElementOrElements } from './is-react-element'

export default function deepClone(obj, hash = new WeakMap()) {
    if (Object(obj) !== obj) {
        return obj // primitives
    }

    if (typeof obj === 'function') {
        return this.config.fnPlaceholder
    }

    if (isReactElementOrElements(obj)) {
        const placeholder = this.config.reactElementPlaceholder
        return obj instanceof Array ? obj.map(() => placeholder) : placeholder
    }

    let result
    try {
        if (Array.isArray(obj)) {
            result = []
        } else if (obj.constructor) {
            result = new obj.constructor()
        } else {
            result = {}
        }
    } catch (e) {  // The constructor failed, create without running it
        result = Object.create(Object.getPrototypeOf(obj))
    }
    hash.set(obj, result)

    const output = map(obj, (val, key) => {
        if (hash.has(val)) {
            return undefined
        }
        return {
            [key]: deepClone.call(this, val, hash),
        }
    }).filter(val => val !== undefined)
    return Object.assign(result, ...output)
}

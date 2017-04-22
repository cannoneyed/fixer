// Somewhat hacky way of filtering out react elements as props
export function isReactElement(obj) {
    return obj.$$typeof && obj.$$typeof.toString() === 'Symbol(react.element)'
}

export function isReactElementOrElements(obj) {
    if (obj instanceof Array) {
        return obj.reduce((is, item) => {
            return is || isReactElement(item)
        }, false)
    }
    return isReactElement(obj)
}

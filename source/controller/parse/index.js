import deepClone from './deep-clone'

export default function generateTestJSON(props) {
    // Occlude all functions / nodes with generic placeholders and intercept circular references
    const cloned = deepClone(props)
    return JSON.stringify(cloned, null, 4)
}

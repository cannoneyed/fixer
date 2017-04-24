export const getAbsFilePath = (name) => {
    const rootDirName = __dirname.replace('/lib/script/helpers/', '')
    console.log('🐸 rootDirName', rootDirName)
    return `${ rootDirName }/${ name }`
}
export const getInjectPath = (name) => {
    return getAbsFilePath(`injected/${ name }`)
}

export const getNameFromFile = (rootDirName, filename) => {
    return filename
        .replace(`${ rootDirName }/`, '')
        .replace(/\/index.jsx?/, '')
}

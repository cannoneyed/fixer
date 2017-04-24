export const getScriptFilePath = (name) => {
    const rootDirName = __dirname.replace('/helpers', '')
    return `${ rootDirName }/${ name }`
}

export const getRootFilePath = (name) => {
    const rootDirName = __dirname.replace('/lib/script/helpers', '')
    return `${ rootDirName }/${ name }`
}

export const getInjectPath = (name) => {
    return getRootFilePath(`build/${ name }`)
}

export const getNameFromFile = (rootDirName, filename) => {
    return filename
        .replace(`${ rootDirName }/`, '')
        .replace(/\/index.jsx?/, '')
}

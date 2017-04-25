import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

export const getTemplateFilePath = (name) => {
    const rootDirName = __dirname.replace('lib/script/helpers', 'templates')
    return `${ rootDirName }/${ name }`
}

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

export const getNameFromFile = (filename) => {
    return filename
        .replace(`${ process.cwd() }/`, '')
        .replace(/\/index.jsx?/, '')
}

export const writeFile = (filename, file) => {
    mkdirp.sync(path.dirname(filename))
    const wstream = fs.createWriteStream(filename)
    wstream.write(file)
    wstream.end()
}

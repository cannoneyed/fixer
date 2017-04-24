import P from 'bluebird'
import { map } from 'lodash'
import fs from 'fs'
import Nightmare from 'nightmare'
import {
    processFixture,
    processTest,
    fnPlaceholder,
    reactElementPlaceholder,
} from './process'

import { getInjectPath, getNameFromFile } from './helpers'
import defaultNightmareOptions from './nightmare-options'

export const processPage = async function (params) {
    const {
        page = 'app',
        rootSelector = 'body',
        url,
        nightmareOptions,
    } = params

    const browser = Nightmare({
        ...defaultNightmareOptions,
        ...nightmareOptions,
    })

    // Go to page and wait to load
    await browser.goto(url)
        .wait(3000)

    const init = {
        rootSelector,
        fnPlaceholder,
        reactElementPlaceholder,
        rootDirName: process.cwd(),
    }

    console.log('🔥', getInjectPath('inject.js'))

    // await browser
    //     .evaluate((_init) => {
    //         window.gutsyController.initialize(_init)
    //     }, init)
    //     .inject('css', getInjectPath('style.css'))
    //     .inject('js', getInjectPath('app.js'))
    //     .wait('#gutsyGetComponentStart')
    //
    // // await browser
    // //     .inject('js', getInjectPath('execute.js'))
    // //     .wait('#testTackleGenerateStart')
    //
    // const output = await browser
    //     .evaluate(() => {
    //         return window.__testTackle.output
    //     })
    //
    // const written = []
    // map(output.fixtures, item => {
    //     const { json, filename } = item
    //
    //     const fileComponentName = getNameFromFile(filename)
    //
    //     const fixtureFile = processFixture(json, page)
    //     const testFile = processTest(fileComponentName, page)
    //
    //     // If the test fixture already exists, don't write one
    //     const dirname = filename.replace(/\/index.jsx?/, '')
    //     const fixturePath = `${ dirname }/fixture.auto.js`
    //     const testPath = `${ dirname }/auto.test.js`
    //     // if (fs.existsSync(fixturePath) || fs.existsSync(testPath)) {
    //     //     return
    //     // }
    //
    //     if (testPath.indexOf('app/components/Pager/auto.test.js') === -1) {
    //         return
    //     }
    //
    //     const writeFile = (path, file) => {
    //         const wstream = fs.createWriteStream(path)
    //         wstream.write(file)
    //         wstream.end()
    //     }
    //
    //     writeFile(fixturePath, fixtureFile)
    //     writeFile(testPath, testFile)
    //
    //     written.push(fileComponentName)
    // })
    //
    // console.log(`Wrote ${ written.length } test${ written.length === 1 ? '' : 's' }`)
    // console.log(written)

    console.log('🍕', process.cwd())

    await P.delay(1000)

    await browser.end()
}

// processPage({
//     url: 'https://www.patreon.com',
//     page: 'index',
//     rootSelector: '#reactTargetIndex',
// })

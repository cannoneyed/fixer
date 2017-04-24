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

const writeFile = (path, file) => {
    const wstream = fs.createWriteStream(path)
    wstream.write(file)
    wstream.end()
}

export const processPage = async function (params) {
    const {
        pageName,
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

    const init = {
        rootSelector,
        fnPlaceholder,
        reactElementPlaceholder,
        rootDirName: process.cwd(),
        pageName,
    }

    const scriptString = fs.readFileSync(getInjectPath('inject.js'), {
        encoding: 'utf8',
    })

    await browser
        .evaluate((_scriptString, _init) => {
            // Append and execute the script
            const script = document.createElement('script')
            script.setAttribute('type', 'text/javascript')
            script.appendChild(document.createTextNode(_scriptString))
            const body = document.querySelector('body')
            body.appendChild(script)

            // Initialize gutsy
            window.gutsyController.initialize(_init)
        }, scriptString, init)
        .wait(() => {
            return window.gutsyController.areFixturesGenerated
        })

    const output = await browser
        .evaluate(() => {
            return {
                fixtures: window.gutsyController.fixtures,
                pageName: window.gutsyController.config.pageName,
            }
        })

    console.log('🐸', 'generating fixtures....')
    const written = []

    map(output.fixtures, (fixtures, fileName) => {
        map(fixtures, (fixture, fixtureName) => {
            const { json, } = fixture
            const { fixturePageName } = output

            const fileComponentName = getNameFromFile(fileName)

            const fixtureFile = processFixture(json, fixturePageName)
            const testFile = processTest(fileComponentName, fixturePageName, fixtureName)

            // If the test fixture already exists, don't write one
            const dirname = fileName.replace(/\/index.jsx?/, '')
            const fixturePath = `${ dirname }/auto-fixtures/fixture.auto.${ fixtureName }.js`
            const testPath = `${ dirname }/auto.test.js`
            if (fs.existsSync(fixturePath) || fs.existsSync(testPath)) {
                return
            }


            writeFile(fixturePath, fixtureFile)
            // writeFile(testPath, testFile)
            //
            written.push(fileComponentName)
            written.push(true)
        })
    })



    console.log(`Wrote ${ written.length } test${ written.length === 1 ? '' : 's' }`)
    console.log(written)

    await P.delay(120000)

    await browser.end()
}

// processPage({
//     url: 'https://www.patreon.com',
//     page: 'index',
//     rootSelector: '#reactTargetIndex',
// })

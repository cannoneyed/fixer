import { map } from 'lodash'
import fs from 'fs'
import Nightmare from 'nightmare'
import {
    processFixture,
    processTest,
    fnPlaceholder,
    reactElementPlaceholder,
} from './process'

import {
    getInjectPath,
    getNameFromFile,
    writeFile,
} from './helpers'
import defaultNightmareOptions from './nightmare-options'

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

    const written = []
    map(output.fixtures, (fixtures, fileName) => {
        const count = Object.keys(fixtures).length
        let round = 0
        map(fixtures, (fixture, fixtureName) => {
            const { json } = fixture
            const fixturePageName = output.pageName

            const fileComponentName = getNameFromFile(fileName)

            const fixtureFile = processFixture(json, fixturePageName)

            // If the test fixture already exists, don't write one
            const dirname = fileName.replace(/\/index.jsx?/, '')
            const fixturePath = `${ dirname }/auto-fixtures/fixture.auto.${ fixtureName }.js`

            writeFile(fixturePath, fixtureFile)
            written.push(fileComponentName)

            // We'll only be writing thes test file on the last cycle through the group of fixtures
            round++
            if (round !== count) {
                return
            }

            // Read all fixtures in the directory and generate the auto test file
            const testFiles = fs.readdirSync(`${ dirname }/auto-fixtures`)
            const testFile = processTest(fileComponentName, fixturePageName, testFiles)
            const testPath = `${ dirname }/auto.test.js`
            writeFile(testPath, testFile)
        })
    })

    console.log(`Wrote ${ written.length } test${ written.length === 1 ? '' : 's' }`)
    console.log(written)

    await browser.end()
}

// processPage({
//     url: 'https://www.patreon.com',
//     page: 'index',
//     rootSelector: '#reactTargetIndex',
// })

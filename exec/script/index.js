import { map } from 'lodash'
import fs from 'fs'
import Nightmare from 'nightmare'
import {
    processFixture,
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

            // Initialize pomello
            window.pomelloController.initialize(_init)
        }, scriptString, init)

    while (true) { // eslint-disable-line
        const status = await browser.wait(() => {
            return !!window.pomelloController.status
        }).evaluate(() => {
            const _status = window.pomelloController.status
            window.pomelloController.status = null
            return _status
        })

        if (status === 'finished') {
            await browser.end()
            break
        } else if (status === 'fixtures_generated') {
            const output = await browser
                .evaluate(() => {
                    return {
                        fixtures: window.pomelloController.fixtures,
                        pageName: window.pomelloController.config.pageName,
                    }
                })

            const written = []
            map(output.fixtures, (fixtures, fileName) => {
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
                })
            })

            console.log(`Wrote ${ written.length } test${ written.length === 1 ? '' : 's' }`)
            console.log(written)
        }
    }
}

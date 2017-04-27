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

const generatePromise = () => {
    let resolvePromise
    const promise = new Promise((resolve) => {
        resolvePromise = resolve
    })
    promise.resolve = (toResolve) => {
        resolvePromise(toResolve)
    }
    return promise
}

const injectScript = async function (browser, init) {
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

            // Initialize fixer
            window.fixerController.initialize(_init)
        }, scriptString, init)
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

    // Set up our event listeners for reloading the script onto the page on navigation
    let loadPromise = null
    browser.on('will-navigate', () => {
        loadPromise = generatePromise()
    })

    browser.on('did-finish-load', () => {
        if (loadPromise) {
            setTimeout(() => loadPromise.resolve(), 500)
        }
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

    await injectScript(browser, init)

    while (true) { // eslint-disable-line
        // When navigating, wait until the new page is loaded before reinjecting the script
        if (status === 'detached') {
            await loadPromise
            await injectScript(browser, init)
        }

        const status = await browser.wait(() => {
            try {
                return !!window.fixerController.status
            } catch (err) {
                // Catch the disconnection error and handle later
                return true
            }
        }).evaluate(() => {
            // If we've left the page the controller no longer exists
            if (!window.fixerController) {
                return 'detached'
            }

            const _status = window.fixerController.status
            window.fixerController.status = null
            return _status
        })

        if (status === 'finished') {
            await browser.end()
            break
        } else if (status === 'fixtures_generated') {
            const output = await browser
                .evaluate(() => {
                    return {
                        fixtures: window.fixerController.fixtures,
                        pageName: window.fixerController.config.pageName,
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

            const message = `Wrote ${ written.length } fixture${ written.length === 1 ? '' : 's' }`

            await browser
                .evaluate((_message) => {
                    window.fixerController.setMessageFromScript(_message)
                }, message)

            console.log(message)
            console.log(written)
        }
    }
}

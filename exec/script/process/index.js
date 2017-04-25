export const fnPlaceholder = '__testFixture_method_replace__'
export const fnString = '() => {}'

export const reactElementPlaceholder = '__testFixture_reactElementPlaceholder_replace__'
export const reactElementString = '<div />'

function makeComment(page) {
    const date = new Date().toLocaleString()
    return `// generated automatically from ${ page } on ${ date }\n`
}

export function replaceQuotes(input) {
    return input
        // Replace attribute name quotes
        .replace(/"([^(")"]+)":/g, '$1:')
        // Replace all single quotes with escaped quotes
        .replace(/'/g, '\\\'')
        // Replace remaining double quotes at beginning and end of property with single quotes
        .replace(/: "/g, ': \'')
        .replace(/",\n/g, '\',\n')
        .replace(/"\n/g, '\'\n')
}

export function replaceFunctionPlaceholders(input) {
    return input
        .replace(new RegExp(`"${ fnPlaceholder }"`, 'g'), fnString)
        .replace(new RegExp(`"${ reactElementPlaceholder }"`, 'g'), reactElementString)
}

export function injectHead(input, page, useReact) {
    let output = input
    output = `export default ${ input }`
    if (useReact) {
        output = `import React from 'react'\n\n${ output }`
    }
    output = makeComment(page) + output
    return output
}

export function processFixture(json, pageName) {
    let output = json
    const useReact = output.indexOf(reactElementPlaceholder) !== -1

    output = replaceFunctionPlaceholders(output)
    output = replaceQuotes(output)
    output = injectHead(output, pageName, useReact)

    return output
}

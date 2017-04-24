#! /usr/bin/env node
import program from 'commander'
import { processPage } from './script'

program
    .arguments('<url>')
    .option('-p, --page <page>', 'The name of the page to generate tests for')
    .option('-r, --root <rootSelector>', 'The root selector to find components from')
    .action((url) => {
        const { page, rootSelector } = program
        return processPage({
            url,
            page,
            rootSelector,
        })
    })
    .parse(process.argv)

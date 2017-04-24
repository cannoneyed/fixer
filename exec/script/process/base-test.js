jest.mock('@patreon/analytics-js', () => {})
import Component from './index'

import { RenderShallow } from 'libs/testing/enzyme-helpers'

import base from './fixture.auto'

describe('$COMPONENT_NAME$', () => {
    let Wrapped

    describe('base props', () => {
        it('Renders correctly', () => {
            Wrapped = RenderShallow(Component, base)
            expect(Wrapped.exists()).toBe(true)
        })
    })
})

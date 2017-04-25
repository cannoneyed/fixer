    describe('$FIXTURE_NAME$', () => {
        it('Renders correctly', () => {
            Wrapped = RenderShallow(Component, $FIXTURE_IMPORT$)
            expect(Wrapped.exists()).toBe(true)
        })
    })

    describe('$FIXTURE_NAME$', () => {
        it('Renders correctly', () => {
            Wrapped = shallow(<Component { ...$FIXTURE_IMPORT$ } />)
            expect(Wrapped.exists()).toBe(true)
        })
    })

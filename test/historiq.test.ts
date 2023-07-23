import historiq from '../src'

describe('historiq must be initialized.', () => {
    const badQ = historiq<number>()
    test('not initialized historiq should be error', () => {
        expect(() => badQ.add(1)).toThrow()
        expect(() => badQ.getCurrent()).toThrow()
        expect(() => badQ.overwrite(2)).toThrow()
    })
    test('initialized should not be error', () => {
        badQ.init(0)
        expect(() => badQ.add(1)).not.toThrow()
        expect(badQ.getCurrent()).toBe(1)
    })
    const goodQ = historiq<number>({
        defaultValue: 0
    })
    test('defaultValue option should not be error', () => {
        expect(() => goodQ.add(1)).not.toThrow()
        expect(goodQ.getCurrent()).toBe(1)
    })
})

describe('go forward and backward.', () => {
    test('can backward', () => {
        const q = historiq<number>()
        let v: number
        q.init(3)
        q.add(2)
        q.add(1)
        expect(q.getCurrent()).toBe(1)
        expect(q.canBackward()).toBe(true)
        expect(q.backwardItemCount()).toBe(2)
        v = q.backward()
        expect(v).toBe(2)
        expect(q.getCurrent()).toBe(2)
        expect(q.canBackward()).toBe(true)
        expect(q.backwardItemCount()).toBe(1)
        v = q.backward()
        expect(v).toBe(3)
        expect(q.getCurrent()).toBe(3)
        expect(q.canBackward()).toBe(false)
        expect(q.backwardItemCount()).toBe(0)
        expect(() => q.backward()).toThrow()
    })
    test('can forward', () => {
        const q = historiq<number>()
        let v: number
        q.init(3)
        q.add(2)
        q.add(1)
        expect(q.getCurrent()).toBe(1)
        expect(q.canForward()).toBe(false)
        expect(q.forwardItemCount()).toBe(0)
        expect(() => q.forward()).toThrow()
        v = q.backward()
        expect(v).toBe(2)
        expect(q.getCurrent()).toBe(2)
        expect(q.canForward()).toBe(true)
        expect(q.forwardItemCount()).toBe(1)
        v = q.forward()
        expect(v).toBe(1)
        expect(q.getCurrent()).toBe(1)
        expect(q.canForward()).toBe(false)
        expect(q.forwardItemCount()).toBe(0)
        v = q.backward()
        expect(v).toBe(2)
        expect(q.forwardItemCount()).toBe(1)
        v = q.backward()
        expect(v).toBe(3)
        expect(q.forwardItemCount()).toBe(2)
        // addすると、forwardできなくなる
        q.add(4)
        expect(q.getCurrent()).toBe(4)
        expect(q.canForward()).toBe(false)
        expect(q.forwardItemCount()).toBe(0)
        expect(() => q.forward()).toThrow()
    })
})

describe('reset historiq', () => {
    const q = historiq<number>()
    test('after reset(), must be init()', () => {
        q.init(1)
        q.add(2)
        expect(q.getCurrent()).toBe(2)
        q.reset();
        expect(() => q.add(1)).toThrow()
        expect(() => q.getCurrent()).toThrow()
        expect(() => q.overwrite(2)).toThrow()
        q.init(3)
        expect(() => q.add(4)).not.toThrow()
        expect(q.getCurrent()).toBe(4)
        expect(q.backward()).toBe(3)    
    })
})

describe('add and overwrite', () => {
    const q = historiq<number>()
    test('overwrite changes current value', () => {
        q.init(1)
        q.add(2)
        expect(q.getCurrent()).toBe(2)
        q.overwrite(4);
        expect(q.getCurrent()).toBe(4)
        expect(q.backward()).toBe(1)
        expect(q.forward()).toBe(4)
    })
})
// describe('empty means there is no history item without defaultValue.', () => {
//     const q = historiq<number>()
//     test('', () => {
//         q.init(1)
//         expect(q.isEmpty()).toBe(true)
//         q.add(2)
//         expect(q.isEmpty()).toBe(false)
//         expect(q.backward()).toBe(1)
//         expect(q.isEmpty()).toBe(false)
//         q.reset()
//         expect(q.isEmpty()).toBe(true)
//         q.init(3)
//         expect(q.isEmpty()).toBe(true)
//     })
// })


describe('options', () => {
    test('over maxItem And Error', () => {
        const q = historiq<number>({
            maxItem: 3,
            errorAtOverMax: true,
        })
        q.init(1)
        q.add(2)
        q.add(3)
        expect(() => q.add(4)).toThrow()
        expect(q.getCurrent()).toBe(3)
    })

    test('over maxItem And Not Error', () => {
        const q = historiq<number>({
            maxItem: 3,
        })
        q.init(1)
        q.add(2)
        q.add(3)
        expect(() => q.add(4)).not.toThrow()
        expect(q.getCurrent()).toBe(3)
    })

})
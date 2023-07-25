# historiq

Package for Undo/Redo History Management.

# Usage

You can push/pop values of any type, FILO style like Stack.

```typescript
import historiq from "@takamiyaatusi/historiq";

const q = historiq<string>();
// Historiq instance MUST be initialized first. This value become 'oldest' item stored in the instance.
q.init("oldest");
q.add("second");
q.add("third");
console.log(q.getCurrent()); // => third
// You should check before backward()/forward() by canBackward()/canForward(),
// otherwise may throw error.
if (q.canBackward())  {
    console.log(q.backward()); // => second
}
if (q.canForward()) {
    console.log(q.forward()); // => third
}
// if execute barkward() and add(), newer item will be overwritten by add()
console.log(q.backward()); // => second
q.add("fourth")
console.log(q.getCurrent()); // => fourth
console.log(q.canForward()); // => false
console.log(q.backward()); // => second

// You also can create and initialize instance by `defaultValue` option.
const numberQ = historiq<number>({
    defaultValue: 1
})

// You can push/pop values of any type
type myState = {
    page: number
    event: any
}

const stateQ = historiq<myState>({
    defaultValue: {
        page: 0,
        event: null,
    }
})
stateQ.add({ page: 0, event: "click next page button" })
stateQ.add({ page: 1, event: "click image" })
stateQ.add({ page: 1, event: "click download button" })
console.log(stateQ.getCurrent().event); // => click download button
let s: myState;
while (stateQ.canBackward()) {
    s = stateQ.backward()
    console.log(s);
    //  => { page: 1, event: "click image" }
    //  => { page: 0, event: "click next page button" }
    //  => { page: 0, event: null }
}
```

# Other method

```typescript
const q2 = historiq<number>({
    defaultValue: 1
})
// overwrite() method overwrite current value
q2.add(2)
console.log(q2.getCurrent()); // => 2
q2.overwrite(3)
console.log(q2.getCurrent()); // => 3
console.log(q2.backward()); // => 1

// reset() method clear all items. Instance must be init() again.
q2.reset()
// q.getCurrent() will be error, because q2 instance is not initialized
q2.init(10)
console.log(q2.getCurrent()); // => 10
console.log(q2.canForward()); // => false
console.log(q2.canBackward()); // => false

// backwardItemCount() indicates the number of times you can backward().
// if backwardItemCount() is 0, it is same as canBackward() is false.
console.log(q2.backwardItemCount()); // => 0
console.log(q2.canBackward()); // => false
q2.add(11)
console.log(q2.backwardItemCount()); // => 1
console.log(q2.canBackward()); // => true
q2.add(12)
console.log(q2.backwardItemCount()); // => 2
console.log(q2.canBackward()); // => true

// forwardItemCount() indicates the number of times you can forward().
// if forwardItemCount() is 0, it is same as canForward() is false.
console.log(q2.forwardItemCount()); // => 0
console.log(q2.canForward()); // => false
q2.backward()
console.log(q2.forwardItemCount()); // => 1
console.log(q2.canForward()); // => true
q2.backward()
console.log(q2.forwardItemCount()); // => 2
console.log(q2.canForward()); // => true
// add() reset forwardItemCount.
q2.add(13)
console.log(q2.forwardItemCount()); // => 0
console.log(q2.canForward()); // => false

```
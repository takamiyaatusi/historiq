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

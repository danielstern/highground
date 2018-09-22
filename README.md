# [WIP]

# Highground.js [ALPHA]

## Get The Highground

## Introduction

Highground.js is a simple testing library.
- Tiny code base which is easy to understand
- Written in ES6 for ES6
- Familiar syntax - based on standard `describe`, `it` syntax
- Native `async / await` support, no support for callbacks
- Supports tests in browser or Node with no configuration
- `describe`, `it` and other helpers are added to the scope with `import` statements like everything else, and are not magically inserted
- Custom reporters allow for more sophisticated feedback, if desired 

### Why Highground?
Your applications are complex, but your testing framework shouldn't be. By eliminating compatibility with outdated conventions that are common to existing frameworks (mainly, injecting methods into the scope)



<!-- It is pretty cool how Jest and Mocha inject `describe` and `it`, *etc*, into the scope of your tests. But if you then try to run your tests in a context that is not controlled by these test runners, `describe` and `it` are `undefined`. This is at the core of a troubling divide between the functioning of these test runners-->

<!--All the above libraries are terrific for their respective uses, and all have evolved over long periods of time to support large-scale application development.
 
 
 As a result, and due to their extensive features and plugin libraries, it may be difficult to quickly use them to test your code in whatever context makes sense - the node command line, an ES6 application, in the browser, on a microcomputer. *etc*-->

##Usage

```
npm install --save-dev highground
```

### Test Running in Node
```javascript
//index.spec.js
import { describe, it } from 'highground';
describe("A simulation inside a simulation",()=>{
    let world = {
        world: {
            world:true
        }
    };
    
  it("Should be inside another simulation [Passing Test]",()=>{
      if (!world.world.world) throw new Error();      
  });
    
  it("But inside that simulation should be another simulation [Failing Test]",()=>{
      if (!world.world.world.world) throw new Error();
  })
}) 
```

```
babel-node index.spec.js
```

### Without ES6

# Highground.js [BETA]
*Highground is in Beta and can be used as a testing framework for your small, one-off or prototype projects. It is not yet recommended for full-scale applications. The author finds it to be their first choice for ES6 prototyping, and hope you do too.*

> ### ˈhī ˌɡround/
> 1. Terrain that provides strategic oversight of the surrounding area
> 2. A position of intellectual, moral or technical superiority

### What is Highground?  

Highground is a fast, easy way to test your ES6 applications. It is inspired by Mocha and Jest, but written for simplicity in ES6.

I used to use Mocha or Jest when testing my small or prototype projects, but was frustrated by their lack of simplicity and native support for ES6. I eventually just started writing my tests in ES6 files and running them myself. 
 
 Enter Highground - the missing link between testing frameworks like Mocha and the most basic of testing methodologies, which is just writing the assertion and hoping it doesn't throw an error [or, when it does throw an error, it indicates to you clearly what changed or went wrong.].
## Introduction

Highground.js is a simple testing library.
- Tiny code base which is easy to understand
- Written in ES6 for ES6
- Familiar syntax - based on standard `describe`, `it` syntax
- Native `async / await` support, no support for callbacks
- Supports tests in browser or Node with no configuration
- `describe`, `it` and other helpers are added to the scope with `import` statements like everything else, and are not magically inserted
- Custom reporters allow for more sophisticated feedback, if desired 

 
### How is Highground Different from Mocha or Jest?

Mocha and Jest are run from the command line. They use an algorithm to determine what files to run as tests and in what order. They inject methods into the scope like *describe* and *it*, in an opaque process, and the test files are not valid ES6 since the injected methods may or may not be available.

Highground is different - 
- Highground was written to support **async / await** syntax *from the very beginning*, and it does
- Highground is **not** run from the command line: You write your tests in normal JavaScript files and then simply run those files using *babel-node* or *webpack*
- Highground does **not** use an algorithm to determine what files are tests: instead you import any tests you would like to run into a main test file, using normal ES6
- Highground does **not** support mocking, snapshot testing 

**Note: Jest and Mocha contain many great features that Highground does not. Only choose Highground if you are certain you do not want these features** 

#### Why should I use Highground and not Mocha or Jest?
If you have never used Jest or Mocha and thought that the way that methods are injected into the scope or outdated and not suitable for ES6, then you do not need Highground - Jest is a better choice.

If you've tried using Mocha or Jest with your ES6 project, only to realize that you need some arcane combination of *babel*, *webpack*, *babel-jest*, etc, as well as verbose and mysterious config file just to even get your tests working, then Highground is for you. It's written in ES6, and **doesn't support ES5**. Highground considers methods appearing in the scope of your application without being imported to be pure nonsense.

##Usage

```
npm install --save-dev highground
```

### Test Running in Node
```javascript
//index.spec.js
import { describe, it } from 'highground';
describe("A simulation inside a simulation", () => {
  let world = {
      world: {
          world: true
      }
  };
    
  it("Should be inside another simulation [Passing Test]", () => {
      if (!world.world.world) {
        throw new Error();      
      }
  });
    
  it("But inside that simulation should be another simulation [Failing Test]", () => {
      if (!world.world.world.world) {
        throw new Error();
      }
  });
}); 
```

```
babel-node index.spec.js
```

### Exported Methods
#### describe(async fn)
Defines a suite of tests. Skipped if no tests are defined within using *it*.
```javascript
import { describe, it } from 'highground';
describe("A suite", () => {
    it("A test", () => {
        throw new Error("Welcome to the real world, Summer.");      
    });
}); 
```


#### fdescribe(async fn)
Defines a suite of higher priority.
#### xdescribe(async fn)
Defines a suite of lower priority (will usually be skipped.)
#### it(async fn)
Defines a test. Test passes if no errors are thrown during its execution, otherwise it fails.

##### fit(async fn)
Defines a test of higher priority. 

##### xit(async fn)
Defines a test of lower priority (will usually be skipped.)

```javascript
import { describe, it } from 'highground';
describe("A suite", () => {
    xit("This test has priority -1 and is skipped", () => {});
    it("This test has priority 0 and is skipped, too.", () => {});
    fit("This test has priority 1, the highest priority, and is run", () => {
        throw new Error("There's a plasma shard in the Abadongo cluster...");
    });
    
    fit("This test has priority 1 as well, and it's also run", () => {
        throw new Error("... if I get it, I'll be awesome.");
    });
});
```

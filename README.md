#Highground.js [ALPHA]
## Get The Highground

## Introduction
Highground.js is a simple testing library for those who find the existing selection of test libraries too complex or magical.
- ES6 friendly supporting import statements
- No magic - describe, it and the rest need to be imported
- Class-based 

##Usage
```$xslt
npm install --save-dev highground
```

```javascript
//index.spec.js
import { describe, it } from 'highground';
describe("A simulation inside a simulation",()=>{
  it("Should be inside another simulation",()=>{
      
  });
})
```
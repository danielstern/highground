(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.highground = {})));
}(this, (function (exports) { 'use strict';

    const delay = duration => {
      return new Promise(resolve => setTimeout(resolve, duration));
    };
    function* iterateTree(treeLevel) {
      yield treeLevel;

      for (let suite of treeLevel.suites) {
        yield* iterateTree(suite.children);
      }
    }
    function* iterateSuites(suites) {
      for (let suite of suites) {
        yield suite;
        yield* iterateSuites(suite.children.suites);
      }
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var rngBrowser = createCommonjsModule(function (module) {
    // Unique ID creation requires a high quality random # generator.  In the
    // browser this is a little complicated due to unknown quality of Math.random()
    // and inconsistent support for the `crypto` API.  We do the best we can via
    // feature-detection

    // getRandomValues needs to be invoked in a context where "this" is a Crypto
    // implementation. Also, find the complete implementation of crypto on IE11.
    var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                          (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

    if (getRandomValues) {
      // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
      var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

      module.exports = function whatwgRNG() {
        getRandomValues(rnds8);
        return rnds8;
      };
    } else {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var rnds = new Array(16);

      module.exports = function mathRNG() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
          rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return rnds;
      };
    }
    });

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */
    var byteToHex = [];
    for (var i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 0x100).toString(16).substr(1);
    }

    function bytesToUuid(buf, offset) {
      var i = offset || 0;
      var bth = byteToHex;
      // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
      return ([bth[buf[i++]], bth[buf[i++]], 
    	bth[buf[i++]], bth[buf[i++]], '-',
    	bth[buf[i++]], bth[buf[i++]], '-',
    	bth[buf[i++]], bth[buf[i++]], '-',
    	bth[buf[i++]], bth[buf[i++]], '-',
    	bth[buf[i++]], bth[buf[i++]],
    	bth[buf[i++]], bth[buf[i++]],
    	bth[buf[i++]], bth[buf[i++]]]).join('');
    }

    var bytesToUuid_1 = bytesToUuid;

    // **`v1()` - Generate time-based UUID**
    //
    // Inspired by https://github.com/LiosK/UUID.js
    // and http://docs.python.org/library/uuid.html

    var _nodeId;
    var _clockseq;

    // Previous uuid creation time
    var _lastMSecs = 0;
    var _lastNSecs = 0;

    // See https://github.com/broofa/node-uuid for API details
    function v1(options, buf, offset) {
      var i = buf && offset || 0;
      var b = buf || [];

      options = options || {};
      var node = options.node || _nodeId;
      var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

      // node and clockseq need to be initialized to random values if they're not
      // specified.  We do this lazily to minimize issues related to insufficient
      // system entropy.  See #189
      if (node == null || clockseq == null) {
        var seedBytes = rngBrowser();
        if (node == null) {
          // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
          node = _nodeId = [
            seedBytes[0] | 0x01,
            seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
          ];
        }
        if (clockseq == null) {
          // Per 4.2.2, randomize (14 bit) clockseq
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
        }
      }

      // UUID timestamps are 100 nano-second units since the Gregorian epoch,
      // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
      // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
      // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
      var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

      // Per 4.2.1.2, use count of uuid's generated during the current clock
      // cycle to simulate higher resolution clock
      var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

      // Time since last uuid creation (in msecs)
      var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

      // Per 4.2.1.2, Bump clockseq on clock regression
      if (dt < 0 && options.clockseq === undefined) {
        clockseq = clockseq + 1 & 0x3fff;
      }

      // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
      // time interval
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
        nsecs = 0;
      }

      // Per 4.2.1.2 Throw error if too many uuids are requested
      if (nsecs >= 10000) {
        throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
      }

      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;

      // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
      msecs += 12219292800000;

      // `time_low`
      var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
      b[i++] = tl >>> 24 & 0xff;
      b[i++] = tl >>> 16 & 0xff;
      b[i++] = tl >>> 8 & 0xff;
      b[i++] = tl & 0xff;

      // `time_mid`
      var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
      b[i++] = tmh >>> 8 & 0xff;
      b[i++] = tmh & 0xff;

      // `time_high_and_version`
      b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
      b[i++] = tmh >>> 16 & 0xff;

      // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
      b[i++] = clockseq >>> 8 | 0x80;

      // `clock_seq_low`
      b[i++] = clockseq & 0xff;

      // `node`
      for (var n = 0; n < 6; ++n) {
        b[i + n] = node[n];
      }

      return buf ? buf : bytesToUuid_1(b);
    }

    var v1_1 = v1;

    function v4(options, buf, offset) {
      var i = buf && offset || 0;

      if (typeof(options) == 'string') {
        buf = options === 'binary' ? new Array(16) : null;
        options = null;
      }
      options = options || {};

      var rnds = options.random || (options.rng || rngBrowser)();

      // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
      rnds[6] = (rnds[6] & 0x0f) | 0x40;
      rnds[8] = (rnds[8] & 0x3f) | 0x80;

      // Copy bytes to buffer, if provided
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }

      return buf || bytesToUuid_1(rnds);
    }

    var v4_1 = v4;

    var uuid = v4_1;
    uuid.v1 = v1_1;
    uuid.v4 = v4_1;

    var uuid_1 = uuid;

    const Status = Object.freeze({
      PENDING: `PENDING`,
      RUNNING: `RUNNING`,
      SKIPPED: `SKIPPED`,
      PASSED: `PASSED`,
      FAILED: `FAILED`
    });

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css = "#HighgroundHTMLReporterTarget {\r\n    height:100%;\r\n    width: 350px;\r\n    background-color: hsla(0, 0%, 9%, 1);\r\n    color: hsla(224, 65%, 93%, 1);\r\n    font-size: 10px;\r\n    position: absolute;\r\n    right: 0;\r\n    font-family: 'Lucida Console';\r\n    top: 0;\r\n    overflow-y: scroll;\r\n    padding: 2em;\r\n}\r\n\r\n#HighgroundHTMLReporterTarget .error {\r\n    color: #ff2871;\r\n}\r\n\r\ndiv {\r\n    margin-top: 2px;\r\n}\r\n\r\n.red {\r\n    color: hsla(0,83%,75%,1);\r\n}\r\n\r\n.yellow {\r\n    color: hsla(48, 92%, 63%, 1);\r\n}\r\n\r\n.green {\r\n    color: hsla(92, 29%, 87%, 1);\r\n}";
    styleInject(css);

    class HTMLReporter {
      StatusToIcon(status) {
        switch (status) {
          case Status.PASSED:
            return `✓`;

          case Status.PENDING:
            return `…`;

          case Status.SKIPPED:
            return `(SKIPPED)`;

          case Status.FAILED:
            return `✘`;

          case Status.RUNNING:
            return `→`;
        }

        return status;
      }

      Indent(suite, isTest) {
        return `style="margin-left:${suite.depth + (isTest ? 1 : 0)}em"`;
      }

      GetTestBullet(test) {
        return test.status == Status.SKIPPED ? `▹` : `▸`;
      }

      GetSummaryClass(passedTests, failedTests, allTests) {
        if (failedTests.length > 0) return 'red';
        if (passedTests.length == allTests.length) return 'green';
        return 'yellow';
      }

      GetSuiteSummary(suite, tests) {
        if (suite.children.tests.find(id => tests[id].status === Status.FAILED)) return Status.FAILED;
        if (suite.children.tests.find(id => tests[id].status === Status.PENDING)) return Status.PENDING;
        return Status.PASSED;
      }

      GetAllChildTests(suite) {
        // let tests = [...suite.tests];
        let tests = [];

        for (let treeLevel of iterateTree(suite.children)) {
          // console.log("Iterating...",treeLevel);
          tests = [...tests, ...treeLevel.tests];
        }

        return tests;
      }

      GatherUnskippedSuites(tree, tests) {
        let suites = [];
        let skipped = [];

        for (let suite of iterateSuites(tree.suites)) {
          let childTests = this.GetAllChildTests(suite);
          let suiteTestsStatuses = childTests.map(testID => tests[testID].status);
          (suiteTestsStatuses.find(status => status !== Status.SKIPPED) ? suites : skipped).push(suite);
        }

        return [suites, skipped];
      }

      update(tree, tests) {
        if (!this.target) {
          document.body.innerHTML += `<div id="HighgroundHTMLReporterTarget"/>`;
          this.target = document.getElementById("HighgroundHTMLReporterTarget");
        }

        const passedTests = Object.values(tests).filter(t => t.status == Status.PASSED || t.status == Status.SKIPPED);
        const failedTests = Object.values(tests).filter(t => t.status == Status.FAILED);
        const allTests = Object.values(tests);
        let [suites, skipped] = this.GatherUnskippedSuites(tree, tests);
        this.target.innerHTML = '';
        this.target.innerHTML += `<div class='${this.GetSummaryClass(passedTests, failedTests, allTests)}'>${passedTests.length}/${allTests.length}</div>`;

        if (skipped.length > 0) {
          this.target.innerHTML += `<p>${skipped.length} Skipped Suites Hidden</p>`;
        }

        for (let suite of suites) {
          this.target.innerHTML += `<div ${this.Indent(suite)}>• ${suite.name} ${this.StatusToIcon(this.GetSuiteSummary(suite, tests))}</div>`;

          for (let id of suite.children.tests) {
            const test = tests[id];
            this.target.innerHTML += `
                <div
                    ${this.Indent(suite, 1)}>
                    ${this.GetTestBullet(test)}
                    ${test.name}
                    ${this.StatusToIcon(test.status)}
                </div>`;

            if (test.error) {
              this.target.innerHTML += `<p class="red" ${this.Indent(suite, 1)}>${test.error} <code>${test.error.stack}</code>$</p>`;
            }
          }
        }
      }

    }

    class TestManager {
      constructor(init = true) {
        this.reporters = [new HTMLReporter()];
        this.describeQueue = [];
        this.calledHookRecord = {};
        this.tree = {
          suites: [],
          tests: []
        };
        this.describing = {
          children: this.tree,
          priority: 0,
          before: [],
          after: [],
          depth: 0
        };
        this.tests = {};
        this.maxPriority = 0;
        if (init) this.take();
      }

      async take() {
        await delay();
        await this.exhaustDescribeQueue();

        for (let treeLevel of iterateTree(this.tree)) {
          for (let id of treeLevel.tests) {
            await this.runTest(id);
          }
        }
      }

      async describe(name, unfold, priority = 0) {
        let describing = this.describing;
        let suite = {
          name,
          id: uuid_1(),
          unfold,
          priority: priority + describing.priority,
          children: {
            suites: [],
            tests: []
          },
          before: [...describing.before],
          after: [...describing.after],
          depth: describing.depth + 1
        };
        describing.children.suites.push(suite);
        this.describeQueue.push(suite);
      }

      async it(name, fn, localPriority = 0) {
        let describing = this.describing;
        let priority = localPriority + describing.priority;
        this.maxPriority = Math.max(priority, this.maxPriority);
        const test = {
          name,
          fn,
          id: uuid_1(),
          before: [...describing.before],
          priority,
          error: null,
          after: [...describing.after],
          status: priority >= this.maxPriority && fn ? Status.PENDING : Status.SKIPPED
        };
        describing.children.tests.push(test.id);
        this.tests[test.id] = test;
      }

      async exhaustDescribeQueue() {
        while (this.describeQueue.length > 0) {
          let suite = this.describeQueue.shift();
          this.describing = suite;

          if (suite.unfold) {
            await suite.unfold();
          }

          this.describing = null;
        }
      }

      updateReporters() {
        this.reporters.forEach(reporter => reporter.update(this.tree, this.tests));
      }

      async runTest(id) {
        const test = this.tests[id];

        if (test.status === Status.PENDING) {
          test.status = Status.RUNNING;
          this.updateReporters();
          await this.callHooks(test.before);

          try {
            await test.fn();
            test.status = Status.PASSED;
          } catch (e) {
            test.error = e;
            test.status = Status.FAILED;
          }

          await this.callHooks(test.after);
        } else {
          test.status = Status.SKIPPED;
        }

        this.updateReporters();
        return test;
      }

      async callHooks(hooks) {
        for (let hook of hooks) {
          if (!hook.once || !this.calledHookRecord[hook.id]) {
            this.calledHookRecord[hook.id] = true;
            await hook.fn();
          }
        }
      }

      async fdescribe(name, unfold) {
        await this.describe(name, unfold, 2);
      }

      async xdescribe(name, unfold) {
        await this.describe(name, unfold, -2);
      }

      async fit(name, test) {
        await this.it(name, test, 2);
      }

      async xit(name, test) {
        await this.it(name, test, -2);
      }

      beforeAll(fn, once = true) {
        this.describing.before.push({
          fn,
          once,
          id: uuid_1()
        });
      }

      beforeEach(fn) {
        this.beforeAll(fn, false);
      }

      afterAll(fn, once = true) {
        this.describing.after.push({
          fn,
          once,
          id: uuid_1()
        });
      }

      afterEach(fn) {
        this.afterAll(fn, false);
      }

    }

    let Manager = new TestManager();
    const describe = Manager.describe.bind(Manager);
    const fdescribe = Manager.fdescribe.bind(Manager);
    const beforeEach = Manager.beforeEach.bind(Manager);
    const beforeAll = Manager.beforeAll.bind(Manager);
    const fit = Manager.fit.bind(Manager);
    const it = Manager.it.bind(Manager); // export default Manager;

    const test = 42;
    console.log(`0.0.1`); // return Manager;

    exports.describe = describe;
    exports.fdescribe = fdescribe;
    exports.beforeEach = beforeEach;
    exports.beforeAll = beforeAll;
    exports.fit = fit;
    exports.it = it;
    exports.test = test;
    exports.delay = delay;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

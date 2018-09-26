(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-dom')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-dom'], factory) :
    (factory((global['highground-react-reporter'] = {}),global.React,global.ReactDOM));
}(this, (function (exports,React,ReactDOM) { 'use strict';

    React = React && React.hasOwnProperty('default') ? React['default'] : React;
    ReactDOM = ReactDOM && ReactDOM.hasOwnProperty('default') ? ReactDOM['default'] : ReactDOM;

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

    var css = "#HighgroundReactReporterTarget {\r\n    height:100%;\r\n    min-width: 375px;\r\n    background-color: hsla(0, 0%, 9%, 1);\r\n    color: hsla(224, 65%, 93%, 1);\r\n    font-size: 10px;\r\n    position: absolute;\r\n    right: 0;\r\n    font-family: 'Lucida Console';\r\n    top: 0;\r\n    overflow-y: scroll;\r\n    padding: 2em;\r\n}\r\n\r\n#HighgroundReactReporterTarget .error {\r\n    color: #ff2871;\r\n}\r\n\r\ndiv {\r\n    margin-top: 2px;\r\n}\r\n\r\n.red {\r\n    color: hsla(0,83%,75%,1);\r\n}\r\n\r\n.yellow {\r\n    color: hsla(48, 92%, 63%, 1);\r\n}\r\n\r\n.green {\r\n    color: hsla(92, 29%, 87%, 1);\r\n}";
    styleInject(css);

    function StatusToIcon(status) {
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
    function Indent(suite, isTest) {
      return {
        marginLeft: `${suite.depth + (isTest ? 1 : 0)}em`
      };
    }
    function GetTestBullet(test) {
      return test.status == Status.SKIPPED ? `▹` : `▸`;
    }
    function GetSuiteTestDetails(suite, tests) {
      return suite.children.tests.map(id => tests[id]);
    }
    function GetSuiteSummary(suite, tests) {
      if (suite.children.tests.find(id => tests[id].status === Status.FAILED)) return Status.FAILED;
      if (suite.children.tests.find(id => tests[id].status === Status.PENDING)) return Status.PENDING;
      return Status.PASSED;
    }
    function CountTests(tests) {
      const passedTests = Object.values(tests).filter(t => t.status == Status.PASSED || t.status == Status.SKIPPED).length;
      const failedTests = Object.values(tests).filter(t => t.status == Status.FAILED).length;
      const allTests = Object.values(tests).length;
      return {
        passedTests,
        failedTests,
        allTests
      };
    }

    class ReactReporter {
      constructor() {
        // todo... gotta be a better way
        let target = document.getElementById("HighgroundReactReporterTarget");

        if (target) {
          this.target = target;
        } else {
          document.body.innerHTML += `<div id="HighgroundReactReporterTarget"/>`;
          this.target = document.getElementById("HighgroundReactReporterTarget");
        }
      }

      update(suites, tests) {
        const {
          passedTests,
          failedTests,
          allTests
        } = CountTests(tests);
        ReactDOM.render(React.createElement("div", null, React.createElement("div", null, React.createElement("div", {
          className: failedTests > 0 ? `red` : `white`
        }, passedTests, " / ", allTests), suites.map(suite => React.createElement("div", {
          key: suite.id,
          style: Indent(suite)
        }, suite.name, " ", StatusToIcon(GetSuiteSummary(suite, tests)), GetSuiteTestDetails(suite, tests).map(test => React.createElement("div", {
          key: test.id,
          style: Indent(suite),
          className: test.error ? `red` : `white`
        }, GetTestBullet(test), " ", test.name, " ", StatusToIcon(test.status), test.error ? React.createElement("pre", {
          className: "red"
        }, test.error.stack) : null)))))), this.target);
      }

    }

    exports.ReactReporter = ReactReporter;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

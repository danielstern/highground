import { Status } from './../src/constants'
export class ConsoleReporter{
    update(suites,tests){
        console.clear();
        for (let suite of suites){

            console.info(suite.name);
            console.group();
            for (let id of suite.children.tests) {

                let test = tests[id];

                console.info(test.name, test.status);

                if (test.status == Status.FAILED) {
                    console.group();
                    console.error(test.error.message);
                    console.groupEnd();
                }
            }
            console.groupEnd();
        }
    }
}
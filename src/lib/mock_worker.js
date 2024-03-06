class MockWorker {
    constructor(workerFunction, isProduction = false) {
        this.isProduction = isProduction;

        // Simulate the worker environment within this mock, initially empty
        this.workerContext = {};

        // Create a reference to the workerContext that can be used as self within the workerFunction
        this.workerContext = {
            postMessage: (message) => {
                // When the worker posts a message, call the onmessage handler if it's set
                if (typeof this.onmessage === 'function') {
                    this.onmessage({data: message});
                }
            }
            // Add any other properties or methods here that should be available as part of self in a Web Worker
        };

        // Pass the workerContext as self to the worker function
        // This enables the worker function to use _self to refer to its own context, similar to self in Web Workers
        workerFunction(this.workerContext);

        // Initialize the workerFunction with this adjusted context
        this.workerFunction = workerFunction;
    }

    postMessage(message) {
        // Simulate receiving a message in the worker
        setTimeout(() => {
            if (typeof this.workerContext.onmessage === 'function') {
                this.workerContext.onmessage({data: message});
            }
        }, 0);
    }

    onerror(ev) {
    }

    onmessage(ev) {
    }

    terminate() {
    }

}

exports.MockWorker = MockWorker;

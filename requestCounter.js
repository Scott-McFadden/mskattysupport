/*
    Usage:

    const reqyestCounterClass = require('./requestCounter');

    const rc = new requestCounterClass();

    rc.inc("name");    // increments counter
    rc.get()  // gets all stored counter values  -  only reports counters that were used.
    rc.get("name")  // returns the calling value for the named counter;
    rc.reset("name")   // zeros out named counter
    rc.resetAll()  // resets all counters

 */
class requestCounterClass
{
    constructor(props) {


    }

    counter = {};

    resetAll()
    {
        this.counter = {};
    }
    reset(name)
    {
        this.counter[name] = 0;
    }
    inc(name){
        if (this.counter[name] === undefined )
            this.counter[name] = 1;
        else
            this.counter[name] = this.counter[name] + 1 ;
    }

    get() {
        console.log(this.counter);
        return this.counter;
    }

    getNamed(name)
    {
        return this.counter[name] ?? 0;
    }

}

module.exports = requestCounterClass ;
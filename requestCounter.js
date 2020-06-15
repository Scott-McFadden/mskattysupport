
class requestCounterClass
{
    constructor(props) {


    }

    counter = {};

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
        return this.counter[name];
    }

}

module.exports = requestCounterClass ;
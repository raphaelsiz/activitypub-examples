require("dotenv").config()
class Activity {
    constructor() {
        this.jsonProps={"@context" : ["https://www.w3.org/ns/activitystreams"]}
    }
    add(props) {
        for (let prop in props)
        this.jsonProps[prop] = props[prop];
    }
    json() {
        return JSON.stringify(this.jsonProps)
    }
}
class Actor extends Activity {
    constructor(username) {
        super()
        this.add({username,id: process.env.DOMAIN + "/u/" + username})
    }
}

let a = new Actor("mergerg");
console.log(a.json())
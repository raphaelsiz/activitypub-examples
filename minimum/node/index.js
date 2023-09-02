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
    constructor(preferredUsername,type,{name,summary,icon}) {
        super()
        let id = process.env.DOMAIN + "/u/" + preferredUsername;
        let add = {preferredUsername,id,name,summary,icon};
        switch (type.toLowerCase()) {
            case "person":
                add.type = "Person";
                break;
            case "group":
                add.type = "Group";
                break;
            case "organization":
                add.type = "Organization";
                break;
            default:
                throw 'Type must be "Person", "Group", or "Organization' 
        }
        for (let collection of ["following","followers","liked","inbox","outbox"]) {
            let colId = id + "/" + collection
            add[collection] = colId
            this[collection] = new Activity()
            this[collection].add({colId})
        }
        this.add(add)
    }
}

let a = new Actor("mergerg");
console.log(a.json())
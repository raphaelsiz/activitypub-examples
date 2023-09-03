const { generateKeyPair } = require('crypto');
require("dotenv").config()
class Activity {
    constructor() {
        this.jsonProps={"@context" : ["https://www.w3.org/ns/activitystreams",
		"https://w3id.org/security/v1"]}
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
        generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem',
              cipher: 'aes-256-cbc',
              passphrase: process.env.KEY_SECRET
            }
          }, (err, publicKey, privateKey) => {
            this.keys=[publicKey,privateKey]
            this.add({
                publicKey: {
                    id: id + "#public-key",
                    owner: id,
                    publicKeyPem: publicKey
                }
            })
          });
    }
}

let a = new Actor("mergerg");
console.log(a.json())
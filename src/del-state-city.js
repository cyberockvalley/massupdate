const dotenv = require('dotenv')
const result = dotenv.config({ path: '.env' })
const fs = require('fs')
const path = require('path')

var mysql = require('mysql');

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_LIVE,
  password: process.env.DB_PASS_LIVE,
  database: process.env.DB_NAME
});

var states = []

var run = () => {
    con.connect(function(err) {
        if(err) {
            send(err)

        } else {
            con.query("SELECT id FROM states WHERE country_id=107", function (err, result, fields) {
                if(err) {
                    send(err)
        
                } else {
                    var i=0
                    while(i < result.length) {
                        states.push(result[i].id)
                        i++;
                    }
                    var filePath = path.resolve(__dirname, '../states.json')
                    saveToFile(filePath, JSON.stringify(states))
                    send(`A total of ${states.length} states saved to file`)
                    i=0
                    while(i < states.length) {
                        delCitiesThenState(con, states[i], i, states.length - 1)
                        i++;
                    }
                }
            });
        }
        
    })
}

var delCitiesThenState = (con, stateId, index, lastIndex) => {
    con.query(`DELETE FROM cities WHERE state_id=${stateId}`, function (err, result, fields) {
        if(err) {
            send({type: "citiesDelete", stateId: stateId, error: err})
            process.exit()

        } else {
            con.query(`DELETE FROM states WHERE id=${stateId}`, function (err, result, fields) {
                if(err) {
                    send({type: "stateDelete", stateId: stateId, error: err})
                    process.exit()
        
                } else {
                    send(`State with id ${stateId} deleted with all its cities`)
                    if(index == lastIndex) {
                        process.exit()
                    }
                }
            })
        }
    });
}

run();

var send = data => {
    console.log("DATA", data)
}

var saveToFile = (filePath, data) => {
    var stream = fs.createWriteStream(filePath, {flags:'a'});
    stream.write(data)
    stream.end()
}
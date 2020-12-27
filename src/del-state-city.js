const dotenv = require('dotenv')
const result = dotenv.config({ path: '.env' })


var mysql = require('mysql');

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_LIVE,
  password: process.env.DB_PASS_LIVE,
  database: process.env.DB_NAME
});

var run = () => {
    con.connect(function(err) {
        if(err) {
            send(err)

        } else {
            con.query("SELECT id FROM states WHERE country_id=107 limit 5", function (err, result, fields) {
                if(err) {
                    send(err)
        
                } else {
                    var rez = []
                    var i=0
                    while(i < result.length) {
                        rez.push(result[i].id)
                        i++;
                    }
                    send(rez)
                    process.exit()
                }
            });
        }
        
    })
}

var deleteCitiesThenState = stateId => {

}

run();

var send = data => {
    console.log("DATA", data)
}
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const mustacheExpress = require("mustache-express");
const {createConnection, Connection, getConnection} = require("typeorm");

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/Public');

const fileUpload = require('express-fileupload');
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

const port = 3000;

const connect = async () => 
{
    try {
        const connection = await createConnection({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "",
            database: "nodepartiel"
        })
    } catch ( e ) 
    {
        console.log(e);
    }   
}
connect();

app.get('/upload', (req, res) => {
    let connection = getConnection();
    connection.query(
        'SELECT * from data', function (error, results, fields) {
            return res.render('ImageUpload', { response: results });
        }
    )
});

app.listen(port, () => {
    console.log(`Exemple app listening at http://localhost:${port}`);
});

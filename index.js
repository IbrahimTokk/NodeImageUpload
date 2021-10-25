const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const {createConnection, Connection, getConnection} = require("typeorm");

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/Public');
app.use('/', express.static('Images'));

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

app.post('/upload', (req, res) => {
    let connection = getConnection();
    connection.query(
        'SELECT MAX(id) as mID from data', function (error, results, fields) {
            let photoID = 1;
            if(results != null) {
                photoID = results[0].mID + 1;
            }
            
            req.files.photo.mv(`./Images/photo${photoID}.jpg`, (err) => {
                if(err)
                   return res.status(500).send(err);
            })
            
            const title = req.body.title;
            const description = req.body.description;
            const photo = "/photo" + photoID + ".jpg";

            connection.query(`INSERT INTO data (title, description, photo) VALUES ("${title}", "${description}", "${photo}")`, function (error, resultsData, fields) {
                connection.query('SELECT title, description, photo FROM data', function (error, results, fields) {
                    console.log("results:", results)
                    return res.render('ImageUpload', { response: results });
                })
            })
        }
    )
})

app.listen(port, () => {
    console.log(`Exemple app listening at http://localhost:${port}`);
});

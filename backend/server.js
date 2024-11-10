const express = require("express");
const mysql = require('mysql2');
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json())

// type your sql database password in password:"", and database name in place of database: "storage"
// Remember, the table you've created in your database, should have the name "input", and two columns: "content" & "id"
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'hello',
    password: 'K@123hushwant'
});

app.get('/', (req, res) => {
    const sql = "SELECT * FROM movies";
    try {
        connection.query(sql, (err, result) => {
            if (err) throw err;
            return res.json(result);
        })
    } catch (err) {
        return res.json("An Error Occured")
    }
})

app.post("/comment", (req, res) => {
    const sql = "INSERT INTO input (`content`) VALUES (?)";
    const values = [req.body.content];
    if(values != "")
    connection.query(sql, [values], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    })
})

// The Update function doesn't work currently
app.put("/update/:genres", (req, res) => {
    // console.dir(req.params.genres)
    let q = "SELECT counter FROM movies where genre=?"
    let genre = req.params.genres;
    console.log(genre)
    connection.query(q, [genre], (err, result) => {
        if(err){ console.log(err)
            return res.json({Message: `Error Inside Server`})}
        else{
        console.log(result)
        let count = result[0].counter;
        count = count + 1;
        let sql = "UPDATE movies SET counter=? WHERE genre=?"
        connection.query(sql, [count, genre], (err, result) => {
            if(err) { console.log(err)
                return res.json({Message: `Error Inside Server`})}
                console.log(result)
            return res.json(result)
        })}
       
    })
})



app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM input WHERE id = ?";
    const id = req.params.id;
    connection.query(sql, [id], (err, result) => {
        if(err) return res.json({Message: `Error Inside Server`})
        return res.json(result)
    })
})


app.listen(8080, () => {
    console.log("listening");
})
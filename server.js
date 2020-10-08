// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 5000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"))

/********** Notes ******************/


const writeNotes = (newNote, res) => {
    let notes;
    fs.readFile("db/db.json", "utf8", (err, data) => {
        if (err) throw err
        else {
            notes = JSON.parse(data);
            newNote.id = uniqueId(notes);
            notes.push(newNote);
            fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
                if (err) throw err
                res.send("file written")
            })
        }
    })
}

const readNotes = (res) => {
    const data = fs.readFile("db/db.json", 'utf8', (err, data) => {
        if (err) throw err
        else res.json(JSON.parse(data))

    })
}

const deleteNote = (id, res) => {
    let notes;
    fs.readFile("db/db.json", "utf8", (err, data) => {
        if (err) throw err
        else {
            notes = JSON.parse(data);
            for (let i = 0; i < notes.length; i++) {
                if (notes[i].id === id) {
                    notes.splice(i, 1);
                }
            }
            fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
                if (err) throw err
                res.send("entry deleted")
            })
        }
    })
}

const uniqueId = (notes) => {
    let id = randomInt();
    for (let i = 0; i < notes.length; i++) {
        if (id === notes[i].id) {
            id = uniqueId(notes);
            break;
        }
    }
    return id
}

const randomInt = () => {
    return Math.floor(Math.random() * 10000)
}


/********** Routes ******************/

// Get the index.html page


// Get the notes.html page
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


// Get JSON of notes
app.get("/api/notes", function (req, res) {
    readNotes(res);
});

app.post("/api/notes", function (req, res) {
    writeNotes(req.body, res);
});

// Allow deleation of notes based on id
app.delete("/api/notes/:id", function (req, res) {
    deleteNote(parseInt(req.params.id), res)
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Starts the server 
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
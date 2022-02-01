const express = require('express');
const path = require('path');
const api = require('/db/db.json');
const fs = require('fs');
const uuid = require('./helpers/uuid');


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>
    res.json(api)
);

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        fs.readFile('/db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const parsedNote = JSON.parse(data);

                parsedNote.push(newNote);

                fs.writeFile('/db/db.json', JSON.stringify(parsedNote, null, 4), (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Added Note!')
                );
            }
        })
    };
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/pages/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}🚀`)
);
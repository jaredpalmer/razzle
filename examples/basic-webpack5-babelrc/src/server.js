
import express from 'express';

const app = express();

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(80);

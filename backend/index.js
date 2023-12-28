const express = require('express');
const cors = require('cors');
const Tasks = require('./config');
const app = express();

app.use(express.json());
app.use(cors({origin:true}));
app.get("/tasks", async (req, res) => {
    const snapshot = await Tasks.get();
    // const ids = snapshot.docs.map((doc)=>doc.id);
    const list = snapshot.docs.map((doc)=>({id: doc.id, ...doc.data()}));
    // const list = snapshot.docs
    res.send(list);
})

app.post("/tasks", async (req, res) => {
    const data = req.body;
    console.log("Data of users", data);
    await Tasks.add(data);
    res.send({msg: "Task added"});
})

app.patch("/tasks/:id", async (req, res) => {
    const id = req.params.id;
    await Tasks.doc(id).update(req.body);
    res.send({msg: "Task Updated"});
})

app.delete("/tasks/:id", async (req, res) => {
    const id = req.params.id;
    await Tasks.doc(id).delete();
    res.send({msg: "Task Deleted"});
})

app.get("/tasks/:id", async (req, res) => {
    const id = req.params.id;
    const snapshot = await Tasks.doc(id).get();
    const task = snapshot.data(); // Use data() instead of doc()

    res.send({id: id, ...task});
})
app.post("/authenticate", async (req, res) => {
    const { username } = req.body;

    try {
        const r = await axios.put(
            'https://api.chatengine.io/users/',
            {username: username, secret: username, first_name: username},
            {headers: {"private-key": "d98ff472-5f53-4586-b3ef-8ccce7a717ec"}}
        )
        return res.status(r.status).json(r.data)
    } catch (e) {
        return res.status(e.r.status).json(e.r.data)
    }


    return res.json({ username: username, secret: "sha256..." }); // secret: is a fake pasword
});
app.listen(3001, ()=> console.log(`Up and running on port 3001`));
const express = require("express")
const fs = require("fs")
const {middlewareVerification} = require("./utils")
const PORT = 3000
const app = express()
app.use(express.static("./static"))
app.use("/tasks",express.json())
let tasks = require("./database/tasks.json");

app.get("/tasks", (req, res) => {
    fs.readFile('./database/tasks.json', (err, data) => {
        if (err)
            res.status(500).json({status: "error", message: "Something went wrong"});
        else{
            tasks = JSON.parse(data.toString()).tasks;
            res.status(200).json(tasks);
        }
    });
});

app.post("/tasks",middlewareVerification, (req, res) => {

    let {task,state} = req.body

    fs.readFile("./database/tasks.json",(err,data)=>{
        if(err)
            return res.status(500).json({status: "error", msg : "Something went wrong"})

        tasks = JSON.parse(data.toString()).tasks;
        id = JSON.parse(data.toString()).lastId;

        let newTask = {
            id : id,
            task : task,
            state : state
        }
        tasks.push(newTask)
        id++
        let dataFile = {
            tasks : tasks,
            lastId : id
        }
        fs.writeFile("./database/tasks.json",JSON.stringify(dataFile,null,3),(err)=>{
            if(err)
                return res.status(500).json({status: "error", msg : "Something went wrong"})
            res.status(200).json( {status: "success", msg : "task is added with success", task : newTask})
        });
    });
});

app.delete("/tasks/:id",(req, res) => {

    let id = parseInt(req.params.id);

    fs.readFile("./database/tasks.json",(err,data)=>{
        if(err)
            return res.status(500).json({status: "error", msg : "Something went wrong"})
        let dataFile = JSON.parse(data.toString());
        tasks = dataFile.tasks;
        let task = tasks.find(t => t.id == id);
        if(!task)
            return res.status(404).json({status: "error", msg : "task not found"})
        tasks = tasks.filter(t => t.id != id);
        dataFile.tasks = tasks;
        fs.writeFile("./database/tasks.json",JSON.stringify(dataFile,null,3),(err)=>{
            if(err)
                return res.status(500).json({status: "error", msg : "Something went wrong"})
            res.status(200).json( {status: "success", msg : "task is deleted with success", task : task})
        });
    }
    );
})

app.put("/tasks/:id", middlewareVerification,(req, res) => {

    let id = parseInt(req.params.id);
    let {task,state} = req.body

    fs.readFile("./database/tasks.json",(err,data)=>{
        if(err)
            return res.status(500).json({status: "error", msg : "Something went wrong"})
        let dataFile = JSON.parse(data.toString());
        tasks = dataFile.tasks;
        let taskToUpdate = tasks.find(t => t.id == id);
        if(!taskToUpdate)
            return res.status(404).json({status: "error", msg : "task not found"})
        taskToUpdate.task = task;
        taskToUpdate.state = state;
        dataFile.tasks = tasks;
        fs.writeFile("./database/tasks.json",JSON.stringify(dataFile,null,3),(err)=>{
            if(err)
                return res.status(500).json({status: "error", msg : "Something went wrong"})
            res.status(200).json( {status: "success", msg : "task is updated with success", task : taskToUpdate})
        });
    }
    );  
})

app.use("*",(req,res)=>{
    res.status(404).json({status:"error",msg:"Not found"})
})

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})


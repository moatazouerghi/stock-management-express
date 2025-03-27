// Importer Express et créer une instance
const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const SECRET_TOKEN = "my-token-for-delete-task-1475289634";

// Pour lire le body en JSON
app.use(express.json());

const filePath = path.join(__dirname, 'tasks.json');

function readTasks() {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }
  
  function writeTasks(tasks) {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
  }

  app.get('/api/tasks', (req, res) => {
    const tasks = readTasks();
    if (tasks.length === 0) {
      res.json({ message: "Aucune tâche pour le moment." });
    } else {
      res.json({
        message: "Voici la liste de toutes les tâches",
        count: tasks.length,
        data: tasks
      });
    }
  });
  
  app.post('/api/tasks', (req, res) => {
    const tasks = readTasks();
  
    const title = req.body.title;
  
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Le champ "title" est requis.' });
    }
  
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      completed: false
    };
  
    tasks.push(newTask);
    writeTasks(tasks);
  
    res.status(201).json(newTask);
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const token = req.headers['authorization'];
  
    if (!token || token !== `Bearer ${SECRET_TOKEN}`) {
      return res.status(401).json({ message: "Accès non autorisé Token invalide ya SEREG" });
    }
  
    const id = parseInt(req.params.id);
    const tasks = readTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);
  
    if (updatedTasks.length === tasks.length) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }
  
    writeTasks(updatedTasks);
    res.json({ message: "Tâche supprimée avec succès" });
  });
  
  
  
  

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});

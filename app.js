//importar FileSystem
const fs = require("fs");
const nomArchivo = "canciones.json";
//importar express
const express = require("express");
const app = express();
//importar cors
const cors = require("cors");
const path = require('path');
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/canciones", (req, res) => {
  const canciones = JSON.parse(fs.readFileSync("canciones.json"));
  res.status(200).json(canciones);
});

app.post("/canciones", (req, res) => {
  const { artista, id, titulo, tono } = req.body;
  //todo
  //1.- leer el canciones.json y parsear
  const canciones = JSON.parse(fs.readFileSync("canciones.json"));
  const searchCancion = canciones.find((c) => c.titulo == titulo);

  // 2.- validar por el nopmbre si la cancion existe
  if (searchCancion) {
    return res.status(200).json({ message: "cancion ya existe" });
  }

  // 3.- si la cancion no existe la agrego (push)
  const data = {
    artista,
    id,
    titulo,
    tono,
  };

  canciones.push(data);
  fs.writeFileSync(nomArchivo, JSON.stringify(canciones), "utf-8");
  return res.status(201).json({
    resultado: true,
    canciones: data,
  });
  return;
});

app.delete("/canciones/:id", (req, res) => {
  const {id} = req.params
  //todo
  // 1.- leer el json de canciones
  const canciones = JSON.parse(fs.readFileSync("canciones.json"));
  
  // 2.- usar filter para devolver todos los elementos distintos del id que viene en los parametros
  const nuevasCanciones = canciones.filter((cancion) => cancion.id != id);

  // guardar nuevamente el archivo con el nuevo array 
  fs.writeFileSync("canciones.json", JSON.stringify(nuevasCanciones), "utf-8");
  return res.status(204).json()
})

app.put("/canciones/:id", (req, res) => {
  const { id } = req.params
const canciones = req.body
const cancionMod = JSON.parse(fs.readFileSync("canciones.json"));
const index = cancionMod.findIndex((cancion) => cancion.id == id)
cancionMod[index] = canciones
fs.writeFileSync("canciones.json", JSON.stringify(cancionMod), "utf8");
res.send("la canción se ha modificado con éxito")
})

app.listen(5500, () => {
  console.log("servidor corriendo en el puerto 5500");
});

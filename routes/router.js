import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import send from 'send';

const router = express.Router();
const __dirname = path.resolve();

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

router.get('/crear', (req, res) => {
    const date = new Date();
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const anio = date.getFullYear();
    const { archivo, contenido } = req.query;
    fs.writeFile(`./uploads/${archivo}`, `${dia < 10 ? '0' + dia : dia}/${mes < 10 ? '0' + mes : mes}/${anio} - ${contenido}`);
    res.send(`Archivo ${archivo} creado con exito`);
})


router.get('/leer', async(req, res) => {
    const { archivo } = req.query;

    try {
        const data = await fs.readFile(`./uploads/${archivo}`, 'utf-8');
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(`No se encontro el archivo ${archivo}`);
    }
})



router.get('/renombrar', async(req, res) => {

    const { nombre, nuevoNombre } = req.query;
    try {
        await fs.rename(`./uploads/${nombre}`, `./uploads/${nuevoNombre}`);
        res.send(`Archivo ${nombre} renombrado con exito`);
    } catch (error) {
        res.status(500).send(`No se encontro el archivo ${nombre}`);
    }
})

router.get('/eliminar', async(req, res) => {

    const { archivo } = req.query;
    try {
        await fs.unlink(`./uploads/${archivo}`);
        res.send(`Archivo ${archivo} eliminado con exito`);
    } catch (error) {
        res.send(`No se encontro el archivo ${archivo}`);
    }
})

export default router;
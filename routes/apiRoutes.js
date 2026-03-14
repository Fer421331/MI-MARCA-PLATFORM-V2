import express from 'express';
import { submitRespuesta } from '../controllers/formController.js';

const router = express.Router();

// Ruta para recibir nuevas solicitudes (servirá para los 3 formularios)
router.post('/solicitudes', submitRespuesta);

import path from 'path';
import fs from 'fs';

// Opcional: Ruta para obtener las solicitudes (solo para la vista admin simple)
router.get('/solicitudes', (req, res) => {
    try {
        const dataFilePath = path.join(process.cwd(), 'data', 'solicitudes.json');
        if (!fs.existsSync(dataFilePath)) {
            return res.json({ success: true, data: [] });
        }
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        const solicitudes = JSON.parse(fileContent);
        
        // Sorting from newest to oldest
        solicitudes.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
        res.json({ success: true, data: solicitudes });
    } catch (error) {
        console.error('Error fetching solicitudes:', error);
        res.status(500).json({ success: false, message: 'Error procesando la solicitud' });
    }
});

export default router;

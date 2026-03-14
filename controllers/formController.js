import fs from 'fs';
import path from 'path';

// Ruta al archivo de almacenamiento persistente temporal
const dataFilePath = path.join(process.cwd(), 'data', 'solicitudes.json');

// Leer datos existentes o retornar arreglo vacío
const readData = () => {
    try {
        if (!fs.existsSync(dataFilePath)) {
            fs.writeFileSync(dataFilePath, '[]');
        }
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error leyendo solicitudes:', error);
        return [];
    }
};

// Escribir datos al archivo JSON
const writeData = (data) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error guardando solicitudes:', error);
    }
};

export const submitRespuesta = (req, res) => {
    try {
        const {
            nombre,
            empresa,
            correo,
            telefono,
            servicio,
            mensaje,
            presupuesto,
            fecha_deseada,
            tipo_formulario // Para saber si es de contacto, cotización o servicio
        } = req.body;

        // Validación básica obligatoria
        if (!nombre || !correo || !mensaje) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor complete los campos obligatorios: nombre, correo y mensaje.' 
            });
        }

        const nuevaSolicitud = {
            id: Date.now().toString(),
            tipo_formulario: tipo_formulario || 'contacto',
            nombre,
            empresa: empresa || 'No especificada',
            correo,
            telefono: telefono || 'No especificado',
            servicio: servicio || 'No especificado',
            mensaje,
            presupuesto: presupuesto || 'No especificado',
            fecha_deseada: fecha_deseada || 'No especificada',
            fecha_creacion: new Date().toISOString()
        };

        const solicitudes = readData();
        solicitudes.push(nuevaSolicitud);
        writeData(solicitudes);

        return res.status(201).json({
            success: true,
            message: 'Solicitud enviada correctamente. Un agente se contactará contigo.',
            data: { id: nuevaSolicitud.id }
        });

    } catch (error) {
        console.error('Error procesando la solicitud:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor. Por favor intenta más tarde.'
        });
    }
};

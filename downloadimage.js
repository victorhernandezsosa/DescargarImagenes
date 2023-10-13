const axios = require('axios');
const fs = require('fs');
const path = require('path');

//Aqui pone la ruta en la que tenes el archivo JSON para descargar las imagenes
const archivoEntrada = require('C:/Users/vhernandez/Documents/Descargarimagen/Articulos/vst_imagenesArticulos_20231011140.json');
//Aqui pone la ruta en la que queres guardar las imagenes
const directorioGuardar = 'C:/Users/vhernandez/Documents/Descargarimagen/Articulos/imagenes';

const archivosDescargados = new Set();
const idArticulosProcesados = new Set();

//Con esto descargas las imagenes con la extension jpg
async function descargarImagen(url, idImagen) {
    const extension = 'jpg';
    const nombreArchivoLocal = `imagen_${idImagen}.${extension}`;
    const rutaGuardado = path.join(directorioGuardar, nombreArchivoLocal);

    //Si la imagen tiene el mismo nombre se ejecutara esto
    if (archivosDescargados.has(nombreArchivoLocal)) {
        console.log(`La imagen ${nombreArchivoLocal} ya existe en el directorio.`);
        return;
    }

    //Esto verifica si el idImagen es repetido
    if (idArticulosProcesados.has(idImagen)) {
        console.log(`El idarticulo ${idImagen} ya ha sido procesado.`);
        return;
    }

    try {
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'arraybuffer',
        });


        if (response.data && response.data.length > 0) {
            fs.writeFileSync(rutaGuardado, response.data);
            console.log(`Imagen descargada: ${rutaGuardado}`);
            archivosDescargados.add(nombreArchivoLocal);
            idArticulosProcesados.add(idImagen);
        } else {
            console.error(`La imagen desde ${url} está corrupta o vacía.`);
        }
    } catch (error) {
        console.error(`Error al descargar la imagen desde ${url}:`, error);
    }
}

async function procesarJSON() {
    try {
        const urls = archivoEntrada["select * from vst_imagenesArticulos via "].map(item => ({
            url: item.url.replace(/\\\//g, '/'),
            idImagen: item.idimagen,
        }));

        for (const { url, idImagen } of urls) {
            await descargarImagen(url, idImagen);
        }

        console.log('Descarga de imágenes completada.');
    } catch (error) {
        console.error('Error al procesar el JSON:', error);
    }
}

procesarJSON();
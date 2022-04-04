require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarOpcionesCiudad } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() =>{
    
    const busquedas = new Busquedas();    
    let opt;
    
    do{
        opt = await inquirerMenu();       
        
        switch(opt){
            case 1:
                const ciudadIntroducida = await leerInput('Introduzca el nombre de la ciudad');
                const opcionesCiudad = await busquedas.buscarCiudad(ciudadIntroducida);
                const idCiudadElegida =await listarOpcionesCiudad(opcionesCiudad);

                if(idCiudadElegida === '0') continue;

                const ciudadElegida =  opcionesCiudad.find(ciudadCandidata =>  ciudadCandidata.id === idCiudadElegida);
                busquedas.agregarHistorial(ciudadElegida.nombre);
                const clima = await busquedas.buscarClima(ciudadElegida.latitud, ciudadElegida.longitud);
                 console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', ciudadElegida.nombre);
                console.log('Latitud:', ciudadElegida.latitud);
                console.log('Longitud:', ciudadElegida.longitud);
                console.log('Descripcion:', clima.descripcion);
                console.log('Temperatura actual:', clima.temperatura);
                console.log('Temperatura minima:', clima.minima);
                console.log('Temperatura maxima:', clima.maxima);
            break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i+1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
            break;
        }

        if(opt !==  0) await pausa();

    } while (opt !==  0);
    
}

main();
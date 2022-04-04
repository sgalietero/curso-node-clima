const fs = require('fs');

const axios = require('axios');

class Busquedas {
    historial = ['Tegucigalpa', 'Madrid', 'San José'];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');
        });
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang:'es'
        };
    }

    async buscarCiudad(ciudad = '') {
        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre:lugar.place_name,
                longitud: lugar.center[0],
                latitud: lugar.center[1],
            }));
        } catch (error){
            return [];
        }
    }

    async buscarClima(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            });

            const resp = await instance.get();

            const {weather,main} = resp.data;

            return {
                descripcion: weather[0].description,
                minima: main.temp_min,
                maxima: main.temp_max,
                temperatura: main.temp
            };
        } catch (error){
            return [];
        }
    }

    agregarHistorial(lugar = ''){
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){
        if(!fs.existsSync(this.dbPath)){
            return [];
        }
        const info = fs.readFileSync(this.dbPath, {enconding:'utf-8'});
        const data = JSON.parse(info);
        this.historial =  data.historial;
    }

}

module.exports = Busquedas;
require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

// console.log(process.env.MAPBOX_KEY)

const main = async() => {

    const busquedas = new Busquedas();

    let opt;

    do {
        
        opt = await inquirerMenu();

        switch( opt ) {

            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                
                // Buscar el lugar
                const lugares = await busquedas.ciudad(termino);
                
                // Seleccionar el lugar
                const id = await listarLugares(lugares)
                if( id === '0') continue;

                const lugarSel = lugares.find( l => l.id === id);

                // Guardar en DB si no es igual a 0
                busquedas.agregarHistorial(lugarSel.nombre)


                // Datos del Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

                // Mostrar resultados
                console.clear()
                console.log('\nInformación del lugar\n'.green);
                console.log('Ciudad:', lugarSel.nombre );
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng );
                console.log('Temperatura:', clima.temp);
                console.log('Minima:', clima.min);
                console.log('Maxima:', clima.max )
                console.log('Como esta el clima:', clima.desc.green )

                break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1}.`.green;
                    console.log(`${idx} ${lugar}`)
                })

            break;

        }

        if(opt !== 0) await pausa();
        
    } while (opt !==0);

}

main()
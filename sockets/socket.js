const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');


// mensajes de sockets
io.on('connection', client => {
    console.log('cliente conectado');
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    console.log(valido, uid);

    // verificar autenticacion
    if(!valido) { return client.disconnect(); }

    //cliente autenticado
    usuarioConectado(uid);

    // ingresar al usuario a una sala en particular
    client.join(uid);


    // escuchar del cliente el mensaje personal
    client.on('mensaje-personal', async (payload) => {
        // grabar mensaje
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    });

    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });

    // client.on('mensaje', (payload) => {
    //     console.log("el mensaje", payload);
    //     io.emit('mensaje', {
    //         admin: 'nuevo mensaje'
    //     });
    // });

    // client.on('emitir-mensaje', (payload) => {
    //     console.log(payload);
    //     // io.emit('nuevo-mensaje', payload); //emite a todos
    //     client.broadcast.emit('nuevo-mensaje', payload);//emite a todos menos al que lo emitio
    // });
});
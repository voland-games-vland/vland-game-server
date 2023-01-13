import 'dotenv/config'
import express from 'express'
// import basicAuth from 'express-basic-auth'
import { monitor } from '@colyseus/monitor'
import { Server } from "colyseus"
import { WebSocketTransport } from '@colyseus/ws-transport'
import { createServer } from 'http'
import config from './config'

const bootstrap = async () => {
    const app = express()

    /*
    const basicAuthMiddleware = basicAuth({
        users: {
            [config.colyseus.monitor.auth.username]: config.colyseus.monitor.auth.password,
        },
        challenge: true,
    })
    */

    app.use('/colyseus', monitor())
    app.get('/', function (req, res) {
        res.send('<h1>V-Land Game Server</h1><p>Running...🏃‍♂️💨</p><a href="/colyseus">Colyseus Monitoring</a>')
    })

    const gameServer = new Server({
        transport: new WebSocketTransport({
            server: createServer(app),
        }),
    })


    const port = config.port
    gameServer.listen(port)
    console.log(`[GameServer] Listening on Port: ${port}`)
}

bootstrap()
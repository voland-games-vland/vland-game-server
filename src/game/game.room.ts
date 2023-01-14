import http from "http";
import { Room, Client } from "colyseus";
import { GameSchema } from "./game.state";
import { generateRoomId } from "../utility/generateRoomId";


export class GameRoom extends Room<GameSchema> {
    private LOBBY_CHANNEL = '$mylobby'
    // When room is initialized
    async onCreate(options: any) {
        console.log(`[GameRoom]: onCreate`)
        this.maxClients = 10
        this.roomId = await generateRoomId(this.LOBBY_CHANNEL, this.presence)
        this.setState(new GameSchema())
    }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth(client: Client, options: any, request: http.IncomingMessage) {
        console.log(`[GameRoom]: onAuth`)
        return true
    }

    // When client successfully join the room
    onJoin(client: Client, options: any, auth: any) {
        console.log(`[GameRoom]: onJoin`)
    }

    // When a client leaves the room
    onLeave(client: Client, consented: boolean) {
        console.log(`[GameRoom]: onLeave`)
    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() {
        console.log(`[GameRoom]: onDispose`)
        this.presence.srem(this.LOBBY_CHANNEL, this.roomId)
    }
}
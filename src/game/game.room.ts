import http from "http";
import { Room, Client } from "colyseus";
import { GameSchema } from "./game.state";
import { generateRoomId } from "../utility/generateRoomId";
import { GameWorld } from "./game.world";;


export class GameRoom extends Room<GameSchema> {
    private LOBBY_CHANNEL = '$mylobby'

    private gameWorld: GameWorld;
      
    // When room is initialized
    async onCreate(options: any) {
        console.log(`[GameRoom]: onCreate`)
        this.maxClients = 12
        this.roomId = await generateRoomId(this.LOBBY_CHANNEL, this.presence)
        this.setState(new GameSchema())
        this.gameWorld = new GameWorld(this.roomId)
        this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000 / 1)
        this.setPatchRate(1000 / 15)
        this.onMessage("action", (client, message) => {
            //
            // Triggers when 'action' message is sent.
            //
        });
        this.onMessage("*", (client, type, message) => {
            //
            // Triggers when any other type of message is sent,
            // excluding "action", which has its own specific handler defined above.
            //
            console.log(client.sessionId, "sent", type, message);
        });
    }

    update(deltaTime: number) {
        this.gameWorld.pipeline(this.gameWorld.worldEcs)
    }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth(client: Client, options: any, request: http.IncomingMessage) {
        console.log(`[GameRoom-${this.roomId}]: onAuth`)
        return true
    }

    // When client successfully join the room
    onJoin(client: Client, options: any, auth: any) {
        console.log(`[GameRoom-${this.roomId}]: onJoin`)
        this.gameWorld.addPlayer(client.sessionId)
    }

    // When a client leaves the room
    onLeave(client: Client, consented: boolean) {
        console.log(`[GameRoom-${this.roomId}]: onLeave`)
        this.gameWorld.removePlayer(client.sessionId)
    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() {
        console.log(`[GameRoom-${this.roomId}]: onDispose`)
        this.presence.srem(this.LOBBY_CHANNEL, this.roomId)
        this.gameWorld.dispose()
    }
}
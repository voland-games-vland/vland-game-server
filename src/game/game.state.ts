import { Schema, type } from '@colyseus/schema'

export class GameSchema extends Schema {
    @type('number') gameSpeed = 1
}
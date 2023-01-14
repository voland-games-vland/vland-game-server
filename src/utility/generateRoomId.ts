import { Presence } from "colyseus"

const LETTERS = '12345890QWERASDF'

const generateSingleRoomId = () => {
    let result = ''
    for (var i = 0; i < 4; i++) {
        result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length))
    }
    return result
}

export const generateRoomId = async (channel: string, presence: Presence): Promise<string> => {
    const currentIds = await presence.smembers(channel)
    let id
    do {
        id = generateSingleRoomId()
    } while (currentIds.includes(id))

    await presence.sadd(channel, id)
    return id
}
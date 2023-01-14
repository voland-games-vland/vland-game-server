import { addComponent, addEntity, createWorld, defineComponent, defineQuery, deleteWorld, IWorld, pipe, removeEntity, Types } from 'bitecs'
import * as CANNON from 'cannon';

export interface WorldEcs extends IWorld {
    time: {
        delta: number,
        elapsed: number,
        then: number
    },
    name: string,
    physicsWorld: CANNON.World
}

const Vector3 = { x: Types.f32, y: Types.f32, z: Types.f32 }

const MassComponent = defineComponent({
    mass: Types.f32
})
const ShapeComponent = defineComponent({
    shape: Types.i16
})
const SizeComponent = defineComponent(Vector3)
const PositionComponent = defineComponent(Vector3)
const VelocityComponent = defineComponent(Vector3)
const PlayerComponent = defineComponent()
const InputComponent = defineComponent({ horizontal: Types.f32, vertical: Types.f32 })
const MoveSpeedComponent = defineComponent({ speed: Types.i16 })
const PhysicsComponent = defineComponent()

const velocityQuery = defineQuery([VelocityComponent, InputComponent, MoveSpeedComponent])
const velocitySystem = (world: WorldEcs) => {
    const entities = velocityQuery(world)
    for (let i = 0; i < entities.length; i++) {
        const entityId = entities[i]
        let inputs = new CANNON.Vec3(0, 0, 0)
        inputs.x = InputComponent.horizontal[entityId]
        inputs.z = InputComponent.vertical[entityId]
        inputs.normalize()
        inputs.scale(1, inputs)
        const moveDirection = inputs.mult(MoveSpeedComponent.speed[entityId])
        VelocityComponent.x[entityId] = moveDirection.x
        VelocityComponent.z[entityId] = moveDirection.z
    }
    return world
}

const bodyQuery = defineQuery([MassComponent, ShapeComponent, PositionComponent, SizeComponent])
const bodySystem = (world: WorldEcs) => {
    const entities = bodyQuery(world)
    for (let i = 0; i < entities.length; i++) {
        const entityId = entities[i]
        let body = world.physicsWorld.bodies.find((body) => body.id == entityId)
        if (body) continue;
        body = new CANNON.Body({
            mass: MassComponent.mass[entityId],
            position: new CANNON.Vec3(PositionComponent.x[entityId], PositionComponent.y[entityId], PositionComponent.z[entityId]),
            shape: new CANNON.Box(new CANNON.Vec3(SizeComponent.x[entityId], SizeComponent.x[entityId], SizeComponent.x[entityId])),
        })
        body.collisionResponse = false
        body.id = entityId
        world.physicsWorld.addBody(body)
    }

    console.log(`[GameWorld-${world.name}]: physics body count ${world.physicsWorld.bodies.length}`)
    return world
}

const physicsQuery = defineQuery([MassComponent, ShapeComponent, PositionComponent, SizeComponent, VelocityComponent])
const physicsSystem = (world: WorldEcs) => {
    const entities = physicsQuery(world)
    for (let i = 0; i < entities.length; i++) {
        const entityId = entities[i]
        const body = world.physicsWorld.bodies.find((body) => body.id == entityId)
        if (!body) continue
        body.velocity.set(VelocityComponent.x[entityId], VelocityComponent.y[entityId], VelocityComponent.z[entityId])
    }
    world.physicsWorld.step(1 / 60, world.time.delta, 10)
    for (let i = 0; i < entities.length; i++) {
        const entityId = entities[i]
        const body = world.physicsWorld.bodies.find((body) => body.id == entityId)
        if (!body) continue
        PositionComponent.x[entityId] = body.position.x
        PositionComponent.y[entityId] = body.position.y
        PositionComponent.z[entityId] = body.position.z
    }
    return world
}

const loggerSystem = (world: WorldEcs) => {
    console.log(`[GameWorld-${world.name}]: time delta ${world.time.delta}`)
    console.log(`[GameWorld-${world.name}]: time elapsed ${world.time.elapsed}`)
    return world
}


const timeSystem = (world: WorldEcs) => {
    const { time } = world
    const now = performance.now()
    const delta = now - time.then
    time.delta = delta
    time.elapsed += delta
    time.then = now
    return world
}

const playerQuery = defineQuery([PlayerComponent, PositionComponent])

const testSystem = (world: WorldEcs) => {
    const entities = playerQuery(world)
    for (let i = 0; i < entities.length; i++) {
        const eid = entities[i]
        const playerX = PositionComponent.x[eid]
        const playerY = PositionComponent.y[eid]
        const playerZ = PositionComponent.z[eid]
        console.log(`[GameWorld-${world.name}]: test system - player position ${playerX} ${playerY} ${playerZ}`)
    }
    return world
}

export class GameWorld {
    worldEcs: WorldEcs;
    pipeline = pipe(bodySystem, velocitySystem, physicsSystem, testSystem, timeSystem, loggerSystem)
    playerMap = new Map<string, number>()

    constructor(id: string) {
        this.worldEcs = createWorld({
            time: {
                delta: 0,
                elapsed: 0,
                then: performance.now()
            },
            name: id,
            physicsWorld: new CANNON.World()
        })
    }

    addPlayer(sessionId: string) {
        const entityId = addEntity(this.worldEcs)
        this.playerMap.set(sessionId, entityId)
        addComponent(this.worldEcs, PlayerComponent, entityId)
        addComponent(this.worldEcs, PositionComponent, entityId)
        addComponent(this.worldEcs, VelocityComponent, entityId)
        addComponent(this.worldEcs, InputComponent, entityId)
        addComponent(this.worldEcs, MoveSpeedComponent, entityId)
        addComponent(this.worldEcs, PhysicsComponent, entityId)
        addComponent(this.worldEcs, MassComponent, entityId)
        addComponent(this.worldEcs, ShapeComponent, entityId)
        addComponent(this.worldEcs, SizeComponent, entityId)
        MoveSpeedComponent.speed[entityId] = 5
        InputComponent.horizontal[entityId] = 1
        InputComponent.vertical[entityId] = 1
        MassComponent.mass[entityId] = 1
        ShapeComponent.shape[entityId] = 1
        SizeComponent.x[entityId] = 1
        SizeComponent.y[entityId] = 1
        SizeComponent.z[entityId] = 1
    }

    removePlayer(sessionId: string) {
        const entityId = this.playerMap.get(sessionId)
        const body = this.worldEcs.physicsWorld.bodies.find((body) => body.id == entityId)
        body.world.remove(body)
        removeEntity(this.worldEcs, entityId)
    }

    dispose() {
        deleteWorld(this.worldEcs)
    }
}
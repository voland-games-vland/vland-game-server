import { MapSchema, Schema, type } from '@colyseus/schema'

export class PositionSchema extends Schema {
    @type('number')
    x: number = 1

    @type('number')
    z: number = 1
}

export class BarSchema extends Schema {
    @type('number')
    current: number

    @type('number')
    max: number
}

export enum Gender {
    Male = 'Male',
    Female = 'Female',
}

export enum Skin {
    Ninja = 'Ninja',
    Warrior = 'Warrior',
    Mummy = 'Mummy',
    Orc = 'Orc',
    Skeleton = 'Skeleton'
}


export class UnitLookSchema extends Schema {
    @type('string')
    gender: Gender

    @type('string')
    skin: Skin
}

export class UnitAttributesSchema extends Schema {
    @type('number')
    maxHealth: number = 0

    @type('number')
    maxShield: number = 0

    @type('number')
    attackDamage: number = 0

    @type('number')
    moveSpeed: number = 0
}

export enum Weapon {
    Sword = 'Sword',
    Daggers = 'Daggers',
    Hammer = 'Hammer',
    Spear = 'Spear',
    Bow = 'Bow',
    Pistols = 'Pistols',
    Sniper = 'Sniper',
}

export class WeaponSchema extends Schema {
    @type('string')
    type: Weapon
}

export class UnitSchema extends Schema {
    @type('string')
    id: string

    @type('string')
    name: string = ''

    @type(PositionSchema)
    position: PositionSchema = new PositionSchema()

    @type('number')
    rotation: number

    @type('number')
    moveSpeed: number

    @type(BarSchema)
    health: BarSchema

    @type(BarSchema)
    shield: BarSchema

    @type(BarSchema)
    energy: BarSchema

    @type('boolean')
    isAlive: boolean

    @type(WeaponSchema)
    weapon: WeaponSchema

    @type(UnitAttributesSchema)
    attributes: UnitAttributesSchema = new UnitAttributesSchema()

    @type(UnitLookSchema)
    look: UnitLookSchema = new UnitLookSchema()
}

export class PlayerSchema extends Schema {
    @type('string')
    sessionId: string

    @type('string')
    name: string

    @type('string')
    unitId: string
}

export enum Building {
    Spawn = 'Spawn',
    CapturePoint = 'CapturePoint',
    Teleporter = 'Teleporter',
    Spawner = 'Spawner',
    Pickup = 'Pickup'
}

export class BuildingMetadataSchema extends Schema {
    @type('string')
    type: Building
}

export class BuildingMetadataCapturePointSchema extends BuildingMetadataSchema {
    constructor() {
        super()
        this.type = Building.CapturePoint
    }

    @type('number')
    team: number
}

export enum Pickup {
    Health = 'Health',
    Armor = 'Armor',
    Energy = 'Energy',
}


export class BuildingMetadataPickupSchema extends BuildingMetadataSchema {
    constructor() {
        super()
        this.type = Building.Pickup
    }

    @type('number')
    team: number

    @type('string')
    typePickup: Pickup

    @type('number')
    ammount: number

    @type('number')
    health: number

    @type('number')
    respawnTime: number
}

export class BuildingMetadataSpawnSchema extends BuildingMetadataSchema {
    constructor() {
        super()
        this.type = Building.Spawn
    }

    @type('number')
    team: number
}

export class BuildingMetadataSpawnerSchema extends BuildingMetadataSchema {
    constructor() {
        super()
        this.type = Building.Spawner
    }

    @type('number')
    spawnRate: number
}

export class BuildingMetadataTeleporterSchema extends BuildingMetadataSchema {
    constructor() {
        super()
        this.type = Building.Teleporter
    }

    @type('number')
    team: number

    @type(PositionSchema)
    teleportTo: PositionSchema
}

export class BuildingSchema extends Schema {
    @type('string')
    id: string

    @type(PositionSchema)
    position: PositionSchema = new PositionSchema()

    @type(BuildingMetadataSchema)
    metadata: BuildingMetadataSchema
}

export enum Block {
    Stone = 'Stone',
    Grass = 'Grass',
    Dirt = 'Dirt',
    Wood = 'Wood',
    Bridge = 'Bridge',
    Snow = 'Snow',
    Sand = 'Sand',
    Water = 'Water',
  }

export class BlockSchema extends Schema {
    @type('string')
    id: string

    @type(PositionSchema)
    position: PositionSchema = new PositionSchema()

    @type('string')
    type: Block
}

export class GameSchema extends Schema {
    @type('number')
    gameSpeed = 1

    @type({ map: BlockSchema })
    blocks: MapSchema<BlockSchema> = new MapSchema<BlockSchema>()

    @type({ map: BuildingSchema })
    buildings: MapSchema<BuildingSchema> = new MapSchema<BuildingSchema>()

    @type({ map: PlayerSchema })
    players: MapSchema<PlayerSchema> = new MapSchema<PlayerSchema>()

    @type({ map: UnitSchema})
    units: MapSchema<UnitSchema> = new MapSchema<UnitSchema>()
}
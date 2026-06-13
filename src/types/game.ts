export type TileType =
  | 'floor'
  | 'wall'
  | 'entrance'
  | 'exit'
  | 'stone'
  | 'pressurePlate'
  | 'door'
  | 'trap'
  | 'relic'
  | 'torch'
  | 'chest'
  | 'hiddenPassage'
  | 'floodable';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface Tile {
  type: TileType;
  visible: boolean;
  lit: boolean;
  explored: boolean;
  activated?: boolean;
  doorId?: string;
  trapType?: string;
  relicId?: string;
  torchFuel?: number;
  floodLevel?: number;
}

export interface Mechanism {
  id: string;
  type: 'pressurePlate' | 'lever';
  position: Position;
  linkedDoorId: string;
  activated: boolean;
}

export interface DoorInstance {
  position: Position;
  doorId: string;
}

export interface TrapInstance {
  id: string;
  type: string;
  position: Position;
  triggered: boolean;
  visible: boolean;
}

export interface RelicInstance {
  id: string;
  relicId: string;
  position: Position;
  collected: boolean;
}

export interface Relic {
  id: string;
  name: string;
  description: string;
  weight: number;
  value: number;
  isGenuine: boolean;
  curseLevel: number;
  icon: string;
  appraisalDifficulty: number;
}

export interface Trap {
  id: string;
  name: string;
  damage: number;
  effect: string;
  visibleByDefault: boolean;
}

export interface PlayerState {
  position: Position;
  stamina: number;
  maxStamina: number;
  weight: number;
  maxWeight: number;
  brightness: number;
  maxBrightness: number;
  curse: number;
  maxCurse: number;
  gold: number;
  inventory: InventoryItem[];
  depth: number;
  torchesRemaining: number;
}

export interface InventoryItem {
  id: string;
  relicId: string;
  name: string;
  weight: number;
  value: number;
  isGenuine: boolean | null;
  curseLevel: number;
  icon: string;
  appraised: boolean;
}

export interface TideState {
  level: number;
  maxLevel: number;
  turnsPerChange: number;
  turnsSinceLastChange: number;
  direction: 'rising' | 'falling';
}

export interface GameState {
  player: PlayerState;
  room: RoomState;
  status: 'exploring' | 'escaping' | 'victory' | 'defeat';
  turn: number;
  message: string;
  escapeValue: number;
  tide: TideState;
}

export interface HiddenPassage {
  position: Position;
  revealAtLevel: number;
}

export interface RoomTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: TileType[][];
  mechanisms: Mechanism[];
  doors: DoorInstance[];
  traps: TrapInstance[];
  relics: RelicInstance[];
  torches: Position[];
  hiddenPassages: HiddenPassage[];
}

export interface RoomState {
  templateId: string;
  width: number;
  height: number;
  tiles: Tile[][];
  mechanisms: Mechanism[];
  doors: DoorInstance[];
  traps: TrapInstance[];
  relics: RelicInstance[];
  torches: { position: Position; fuel: number }[];
  entrance: Position;
  exit: Position;
  hiddenPassages: HiddenPassage[];
}

export interface ExpeditionRecord {
  id: string;
  date: string;
  depth: number;
  goldEarned: number;
  relicsCollected: number;
  survived: boolean;
  causeOfDeath?: string;
}

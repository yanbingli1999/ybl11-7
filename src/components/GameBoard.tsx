import React from 'react';
import { GameState, TideState, HiddenPassage } from '../types/game';

interface GameBoardProps {
  game: GameState;
}

const TILE_SIZE = 40;

const tileIcons: Record<string, string> = {
  wall: '🧱',
  floor: '',
  entrance: '🚪',
  exit: '⬆️',
  stone: '🪨',
  pressurePlate: '🔘',
  door: '🚪',
  trap: '⚠️',
  relic: '💎',
  torch: '🔥',
  chest: '📦',
  hiddenPassage: '🕳️',
  floodable: '',
};

const tideLevelIcons: Record<number, string> = {
  0: '',
  1: '💧',
  2: '🌊',
  3: '🌊',
  4: '🌊',
};

const tideLevelBgColors: Record<number, string> = {
  0: '#5a5a7a',
  1: '#4a6a8a',
  2: '#3a5a9a',
  3: '#2a4aaa',
  4: '#1a3abb',
};

function isPassageRevealed(hp: HiddenPassage | undefined, tide: TideState): boolean {
  return !!(hp && tide.level <= hp.revealAtLevel);
}

export const GameBoard: React.FC<GameBoardProps> = ({ game }) => {
  const { room, player } = game;

  const getTileStyle = (tile: any, x: number, y: number): React.CSSProperties => {
    const isPlayer = player.position.x === x && player.position.y === y;
    const baseStyle: React.CSSProperties = {
      width: TILE_SIZE,
      height: TILE_SIZE,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      position: 'relative',
      transition: 'all 0.2s ease',
    };

    if (!tile.visible && !tile.explored) {
      return { ...baseStyle, backgroundColor: '#1a1a2e' };
    }

    if (!tile.visible && tile.explored) {
      return { ...baseStyle, backgroundColor: '#2d2d44', opacity: 0.5 };
    }

    let bgColor = '#3d3d5c';
    switch (tile.type) {
      case 'wall':
        bgColor = '#4a4a6a';
        break;
      case 'floor':
        bgColor = tile.lit ? '#5a5a7a' : '#3d3d5c';
        break;
      case 'floodable':
        bgColor = tile.lit
          ? (tideLevelBgColors[tile.floodLevel] || '#5a5a7a')
          : '#3d3d5c';
        break;
      case 'entrance':
        bgColor = '#2d5a2d';
        break;
      case 'exit':
        bgColor = '#5a5a2d';
        break;
      case 'door':
        bgColor = tile.activated ? '#2d5a5a' : '#5a2d2d';
        break;
      case 'pressurePlate':
        bgColor = tile.activated ? '#4a7a4a' : '#5a5a5a';
        break;
      case 'hiddenPassage':
        bgColor = '#6a5a3a';
        break;
      default:
        bgColor = tile.lit ? '#5a5a7a' : '#3d3d5c';
    }

    return { ...baseStyle, backgroundColor: bgColor };
  };

  const getTileContent = (tile: any, x: number, y: number) => {
    const isPlayer = player.position.x === x && player.position.y === y;
    
    if (isPlayer) {
      return <span style={{ zIndex: 10 }}>🧙</span>;
    }

    if (!tile.visible && !tile.explored) {
      return null;
    }

    if (tile.type === 'hiddenPassage') {
      const passage = room.hiddenPassages.find(
        (hp) => hp.position.x === x && hp.position.y === y
      );
      if (isPassageRevealed(passage, game.tide)) {
        return <span style={{ fontSize: '16px', opacity: 0.9 }}>🕳️</span>;
      }
      if (tile.visible) {
        return '🧱';
      }
      return null;
    }

    if (tile.type === 'floodable' && tile.visible) {
      const floodLevel = tile.floodLevel || 0;
      if (floodLevel > 0) {
        return <span style={{ fontSize: floodLevel >= 3 ? '18px' : '14px' }}>{tideLevelIcons[floodLevel]}</span>;
      }
    }

    const trap = room.traps.find(
      (t) => t.position.x === x && t.position.y === y && t.visible
    );
    if (trap && tile.visible) {
      if (game.tide && game.tide.level >= 2) {
        return <span style={{ fontSize: '12px', opacity: 0.5 }}>⚠️🌊</span>;
      }
      return trap.triggered ? '💥' : '⚠️';
    }

    const relic = room.relics.find(
      (r) => r.position.x === x && r.position.y === y && !r.collected
    );
    if (relic && tile.visible) {
      return '💎';
    }

    const torch = room.torches.find(
      (t) => t.position.x === x && t.position.y === y && t.fuel > 0
    );
    if (torch && tile.visible) {
      return '🔥';
    }

    if (tile.type === 'door') {
      return tile.activated ? '🚪' : '🔒';
    }

    return tileIcons[tile.type] || '';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '12px',
          padding: '8px 16px',
          backgroundColor: '#252540',
          borderRadius: '6px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#88aaff' }}>🌊 潮汐</span>
        {Array.from({ length: game.tide.maxLevel + 1 }, (_, i) => (
          <div
            key={i}
            style={{
              width: '24px',
              height: '16px',
              borderRadius: '3px',
              backgroundColor: i <= game.tide.level ? '#4488cc' : '#2d2d44',
              border: i === game.tide.level ? '2px solid #88ccff' : '1px solid #3d3d5c',
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '9px',
                color: i === game.tide.level ? '#88ccff' : '#666',
              }}
            >
              {i}
            </span>
          </div>
        ))}
        <span style={{ fontSize: '12px', color: '#aaa', marginLeft: '8px' }}>
          {game.tide.direction === 'rising' ? '🔺涨潮' : '🔻退潮'}
        </span>
        <span style={{ fontSize: '11px', color: '#888', marginLeft: '4px' }}>
          ({game.tide.turnsPerChange - game.tide.turnsSinceLastChange}回合后变化)
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${room.width}, ${TILE_SIZE}px)`,
          gap: '1px',
          backgroundColor: '#1a1a2e',
          border: '3px solid #4a4a6a',
          borderRadius: '4px',
          padding: '2px',
        }}
      >
        {room.tiles.map((row, y) =>
          row.map((tile, x) => (
            <div key={`${x}-${y}`} style={getTileStyle(tile, x, y)}>
              {getTileContent(tile, x, y)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

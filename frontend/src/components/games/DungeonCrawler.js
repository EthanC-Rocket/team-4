import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DungeonCrawler.css';

function DungeonCrawler({ user, token }) {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [player, setPlayer] = useState({ x: 1, y: 1, hp: 100, maxHp: 100, attack: 10, level: 1, exp: 0 });
  const [dungeon, setDungeon] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const DUNGEON_SIZE = 15;

  useEffect(() => {
    if (gameStarted) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [gameStarted, player, enemies]);

  const startGame = () => {
    generateDungeon();
    setGameStarted(true);
    setPlayer({ x: 1, y: 1, hp: 100, maxHp: 100, attack: 10, level: 1, exp: 0 });
    setScore(0);
    setMessage('Welcome to the dungeon! Use arrow keys to move.');
  };

  const generateDungeon = () => {
    const newDungeon = Array(DUNGEON_SIZE).fill(null).map(() => Array(DUNGEON_SIZE).fill('wall'));
    
    // Create rooms
    for (let i = 0; i < 8; i++) {
      const roomWidth = Math.floor(Math.random() * 4) + 3;
      const roomHeight = Math.floor(Math.random() * 4) + 3;
      const roomX = Math.floor(Math.random() * (DUNGEON_SIZE - roomWidth - 2)) + 1;
      const roomY = Math.floor(Math.random() * (DUNGEON_SIZE - roomHeight - 2)) + 1;
      
      for (let y = roomY; y < roomY + roomHeight; y++) {
        for (let x = roomX; x < roomX + roomWidth; x++) {
          newDungeon[y][x] = 'floor';
        }
      }
    }
    
    setDungeon(newDungeon);
    
    // Generate enemies
    const newEnemies = [];
    for (let i = 0; i < 10; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * DUNGEON_SIZE);
        y = Math.floor(Math.random() * DUNGEON_SIZE);
      } while (newDungeon[y][x] !== 'floor' || (x === 1 && y === 1));
      
      newEnemies.push({
        x, y,
        hp: 20 + i * 5,
        maxHp: 20 + i * 5,
        attack: 5 + i * 2,
        type: i % 3 === 0 ? 'goblin' : i % 3 === 1 ? 'skeleton' : 'orc'
      });
    }
    setEnemies(newEnemies);
    
    // Generate items
    const newItems = [];
    for (let i = 0; i < 5; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * DUNGEON_SIZE);
        y = Math.floor(Math.random() * DUNGEON_SIZE);
      } while (newDungeon[y][x] !== 'floor' || (x === 1 && y === 1));
      
      newItems.push({
        x, y,
        type: i % 2 === 0 ? 'health' : 'weapon'
      });
    }
    setItems(newItems);
  };

  const handleKeyPress = (e) => {
    if (!gameStarted || player.hp <= 0) return;
    
    let newX = player.x;
    let newY = player.y;
    
    switch(e.key) {
      case 'ArrowUp':
        newY--;
        break;
      case 'ArrowDown':
        newY++;
        break;
      case 'ArrowLeft':
        newX--;
        break;
      case 'ArrowRight':
        newX++;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    
    if (newX >= 0 && newX < DUNGEON_SIZE && newY >= 0 && newY < DUNGEON_SIZE) {
      if (dungeon[newY][newX] === 'floor') {
        // Check for enemy
        const enemyIndex = enemies.findIndex(e => e.x === newX && e.y === newY);
        if (enemyIndex !== -1) {
          combat(enemyIndex, newX, newY);
        } else {
          // Check for item
          const itemIndex = items.findIndex(i => i.x === newX && i.y === newY);
          if (itemIndex !== -1) {
            collectItem(itemIndex);
          }
          setPlayer(prev => ({ ...prev, x: newX, y: newY }));
        }
      }
    }
  };

  const combat = (enemyIndex, newX, newY) => {
    const enemy = enemies[enemyIndex];
    const playerDamage = player.attack;
    const enemyDamage = enemy.attack;
    
    enemy.hp -= playerDamage;
    
    if (enemy.hp <= 0) {
      setMessage(`You defeated the ${enemy.type}! +${enemy.maxHp} exp`);
      const newEnemies = [...enemies];
      newEnemies.splice(enemyIndex, 1);
      setEnemies(newEnemies);
      
      const newExp = player.exp + enemy.maxHp;
      const newScore = score + enemy.maxHp;
      setScore(newScore);
      
      let newPlayer = { ...player, x: newX, y: newY, exp: newExp };
      
      if (newExp >= 100 * player.level) {
        newPlayer.level++;
        newPlayer.maxHp += 20;
        newPlayer.hp = newPlayer.maxHp;
        newPlayer.attack += 5;
        setMessage(`Level Up! You are now level ${newPlayer.level}!`);
      }
      
      setPlayer(newPlayer);
      
      if (newEnemies.length === 0) {
        endGame(newScore);
      }
    } else {
      const newPlayer = { ...player, hp: Math.max(0, player.hp - enemyDamage) };
      setPlayer(newPlayer);
      setMessage(`You hit the ${enemy.type} for ${playerDamage} damage. It hits you back for ${enemyDamage}!`);
      
      if (newPlayer.hp <= 0) {
        setMessage('You have been defeated! Game Over.');
        endGame(score);
      }
    }
  };

  const collectItem = (itemIndex) => {
    const item = items[itemIndex];
    const newItems = [...items];
    newItems.splice(itemIndex, 1);
    setItems(newItems);
    
    if (item.type === 'health') {
      setPlayer(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 30) }));
      setMessage('You found a health potion! +30 HP');
    } else {
      setPlayer(prev => ({ ...prev, attack: prev.attack + 5 }));
      setMessage('You found a weapon! +5 Attack');
    }
  };

  const endGame = async (finalScore) => {
    if (user && token) {
      try {
        await fetch('/api/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            game_name: 'Dungeon Crawler',
            score: finalScore,
            metadata: `Level ${player.level}, Score: ${finalScore}`
          })
        });
      } catch (err) {
        console.error('Failed to submit score:', err);
      }
    }
  };

  const getCellContent = (x, y) => {
    if (player.x === x && player.y === y) return '🧙';
    
    const enemy = enemies.find(e => e.x === x && e.y === y);
    if (enemy) {
      if (enemy.type === 'goblin') return '👺';
      if (enemy.type === 'skeleton') return '💀';
      return '👹';
    }
    
    const item = items.find(i => i.x === x && i.y === y);
    if (item) {
      return item.type === 'health' ? '❤️' : '⚔️';
    }
    
    return '';
  };

  return (
    <div className="game-container">
      <button className="back-btn" onClick={() => navigate('/')}>← Back to Hub</button>
      
      <div className="game-header">
        <h1>⚔️ Dungeon Crawler</h1>
      </div>

      <div className="game-content">
        {!gameStarted ? (
          <div className="start-screen">
            <h2>Enter the Dungeon</h2>
            <p>Defeat all enemies to win!</p>
            <button onClick={startGame} className="start-btn">Start Adventure</button>
          </div>
        ) : (
          <>
            <div className="game-stats">
              <div className="stat">Level: {player.level}</div>
              <div className="stat">HP: {player.hp}/{player.maxHp}</div>
              <div className="stat">Attack: {player.attack}</div>
              <div className="stat">EXP: {player.exp}</div>
              <div className="stat">Score: {score}</div>
            </div>

            <div className="dungeon-grid">
              {dungeon.map((row, y) => (
                <div key={y} className="dungeon-row">
                  {row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`dungeon-cell ${cell}`}
                    >
                      {getCellContent(x, y)}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="game-message">{message}</div>

            <div className="controls-info">
              <p>Use arrow keys to move and attack enemies</p>
              <p>🧙 Player | 👺 Goblin | 💀 Skeleton | 👹 Orc | ❤️ Health | ⚔️ Weapon</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DungeonCrawler;

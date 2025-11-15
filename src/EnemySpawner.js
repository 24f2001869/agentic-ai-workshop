// EnemySpawner.js
class EnemySpawner {
    constructor() {
        this.enemies = [];
        this.enemyCount = 0;
    }

    spawnEnemies(count) {
        for (let i = 0; i < count; i++) {
            const enemy = new Enemy(); // Your Enemy class
            enemy.flyInPattern(); // Define your flying pattern
            this.enemies.push(enemy);
        }
        this.enemyCount += count;
    }

    removeEnemy(enemy) {
        // remove enemy logic
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
            this.updateScore(100);
        }
    }

    updateScore(points) {
        // Add score updating logic
    }
}

// Usage
const spawner = new EnemySpawner();
spawner.spawnEnemies(5); // Starting wave

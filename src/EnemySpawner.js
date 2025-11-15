// Handles spawning and managing enemies in waves

class EnemySpawner {
    constructor(scene, onEnemyDestroyed) {
        this.scene = scene;
        this.waveSize = 5;
        this.enemies = [];
        this.waveNum = 1;
        this.onEnemyDestroyed = onEnemyDestroyed;
    }

    spawnWave() {
        for (let i = 0; i < this.waveSize; i++) {
            const enemy = new Enemy(this.scene, i, this.waveNum);
            this.enemies.push(enemy);
        }
    }

    update(dt) {
        this.enemies = this.enemies.filter(e => e.active);
        for (const enemy of this.enemies) enemy.update(dt);

        if (this.enemies.length === 0) {
            this.waveNum++;
            this.waveSize += 2;
            this.spawnWave();
        }
    }

    handleHit(enemy) {
        enemy.destroy();
        this.onEnemyDestroyed();
    }
}

class Enemy {
    constructor(scene, index, waveNum) {
        this.active = true;

        // 50/50 sphere vs pyramid, red
        const geometry = (Math.random() < 0.5)
            ? new THREE.SphereGeometry(0.7, 12, 12)
            : new THREE.ConeGeometry(0.7, 1.2, 8);

        this.mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshPhongMaterial({ color: 0xff3333, emissive: 0x991515 })
        );

        // Spawn in a circle, pattern depends on wave
        let radius = 18 + waveNum * 2;
        this.initAngle = Math.random() * Math.PI * 2;
        this.angle = this.initAngle;
        this.radius = radius;

        this.mesh.position.set(
            Math.cos(index * 2 * Math.PI / Math.max(7, waveNum+3)) * radius,
            12 + Math.sin(index * 2 * Math.PI / Math.max(7, waveNum+3)) * 8,
            Math.sin(index * 2 * Math.PI / Math.max(7, waveNum+3)) * radius
        );
        scene.add(this.mesh);
        this.scene = scene;
        this.pattern = (Math.random() < 0.5) ? 'circle' : 'figure8';
    }

    update(dt) {
        this.angle += dt * 0.45;
        let a = this.angle;
        if (this.pattern === 'circle') {
            this.mesh.position.x = Math.cos(a) * this.radius;
            this.mesh.position.z = Math.sin(a) * this.radius;
        } else {
            this.mesh.position.x = Math.cos(a) * this.radius;
            this.mesh.position.z = Math.sin(a*2) * this.radius * 0.6;
        }
    }

    destroy() {
        this.active = false;
        spawnExplosion(this.mesh.position, this.scene);
        this.scene.remove(this.mesh);
    }
}

function spawnExplosion(position, scene) {
    for (let i = 0; i < 18; i++) {
        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.16, 7, 7),
            new THREE.MeshBasicMaterial({ color: (Math.random() < 0.5) ? 0xffa549 : 0xff3434 })
        );
        particle.position.copy(position);
        particle.userData = {
            age: 0, dir: new THREE.Vector3(
                Math.random()-0.5,
                Math.random()-0.5,
                Math.random()-0.5
            ).normalize()
        };
        scene.explosionGroup.add(particle);
    }
    // Play explosion sound (external audio function, trigger here if implemented)
}

export { EnemySpawner, Enemy, spawnExplosion };
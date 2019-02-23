var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create, update: update, render: render
});
function preload() {
    //game.load.tilemap('level1', 'assets/games/starstruck/level1-2.json', null,Phaser.Tilemap.TILED_JSON);
    //game.load.image('tiles-1', 'assets/games/starstruck/tiles-1.png');
    game.load.tilemap('level1', 'assets/games/starstruck/thingg.json', null,Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/games/starstruck/tiles.png');
    
    game.load.spritesheet('dude', 'assets/games/starstruck/sprito.png', 41, 47);
    game.load.spritesheet('droid', 'assets/games/starstruck/droid.png', 32, 32);
    game.load.image('starSmall', 'assets/games/starstruck/star.png');
    game.load.image('starBig', 'assets/games/starstruck/star2.png');
    game.load.image('background', 'assets/games/warped city files/ENVIRONMENT/background/bg3.png');
    //game.load.image('background', 'assets/games/starstruck/background2.png');
    game.load.audio('bgm', ['assets/games/starstruck/gameplay.mp3', 'assets/games/starstruck/gameplay.ogg']);
    game.load.image('bullet', 'assets/games/starstruck/bullet.png');
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';
    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');
    map.addTilesetImage('tiles','tiles');
    //map.setCollisionByExclusion([13, 14, 15, 16, 46, 47, 48, 49, 50, 51]);
    layer = map.createLayer('Tile Layer 1');
    //layer = map.createLayer('blockedlayer');
    layer.resizeWorld();
    game.physics.arcade.gravity.y = 500;
    player = game.add.sprite(41, 47, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;
    player.body.setSize(41, 47, 0, 0);
    player.animations.add('left', [0, 1, 2, 3,4,5,6,7,8], 10, true);
    //player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [9, 10,11, 12,13,14,15,16,17], 10, true);
    game.camera.follow(player);

    //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');

    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    //MAKES IT GO RIGHT
    weapon.fireAngle = 0;
    weapon.bulletGravity = 0;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 3000;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 300;

    //  Add a variance to the bullet speed by +- this value
    weapon.bulletSpeedVariance = 200;
    game.camera.follow(player);
    weapon.trackSprite(player, 24, 10);
    
    
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.E);
    music = game.add.audio('bgm');

    music.play();
    game.input.onDown.add(changeVolume, this);

}
function update() {
    game.physics.arcade.collide(player, layer);
    player.body.velocity.x = 0;
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        if (facing != 'left') {
            player.animations.play('left');
            facing = 'left';
            face = 0;
        }
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        if (facing != 'right') {
                player.animations.play('right');
                facing = 'right';
                face = 1;
            }
        }
        else {
            if (facing != 'idle') {
                player.animations.stop();
                if (facing == 'left') {
                    player.frame = 7;
                }
                else {
                    player.frame = 10;
                }
                facing = 'idle';
            }
    }
    if (fireButton.isDown && face == 0) {
        weapon.fireAngle = 180;
        weapon.fire();
    }
    if (fireButton.isDown && face == 1) {
        weapon.fireAngle = 0;
        weapon.fire();
    }
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }
}
function render()
{
    //game.debug.soundInfo(music, 20, 32);
    //weapon.debug();

}
function changeVolume(pointer) {

    if (pointer.y < 100)
    {
        music.mute = false;
    }
    else if (pointer.y < 300)
    {
        music.volume += 0.1;
    }
    else
    {
        music.volume -= 0.1;
    }

}
var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var music;
var weapon;

var fireButton;
var face = 0;
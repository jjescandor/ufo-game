const canvas = document.querySelector('#ufoCanvas');

canvas.width = 900;
canvas.height = 750;
const ctx = canvas.getContext('2d');

function resize() {
    const height = window.innerHeight - 20;
    const ratio = canvas.width / canvas.height;
    const width = height * ratio;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
}

window.addEventListener('load', resize, false);

// Game Basics
function GameBasics(canvas) {

    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;

    // active playing field
    this.playBounderies = {
        top: 150,
        bottom: 650,
        left: 100,
        right: 100
    };

    // initial values
    this.level = 1;
    this.score = 0;
    this.shields = 2;

    this.setting = {
        // FPs: 60 frame per 1 second, 1 new frame in every 0.01666667 seconds
        updateSeconds: (1 / 60),
    };

    //we collect here the different positions, states of the game
    this.positionContainer = [];

    // pressed keys storing
    this.pressedKeys = {};
}

//Return to current game position, status. Always returns the top element of positionContainer
GameBasics.prototype.presentPosition = function () {
    return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1] : null;
};

//Move to the desired position
GameBasics.prototype.goToPosition = function (position) {

    // If we're already in a position clear the positionContainer
    if (this.presentPosition()) {
        this.positionContainer.length = 0;
    }

    // If we find an 'entry' in a given position, we call it
    if (position.entry) {
        position.entry(play);
    }

    // Setting the current game position in the positionContainer
    this.positionContainer.push(position);
};

// Push our new positin into the positionContainer
GameBasics.prototype.pushPosition = function (position) {
    this.positionContainer.push(position);
};

// Pop the position from the positionContainer
GameBasics.prototype.popPosition = function () {
    this.positionContainer.pop();
}

GameBasics.prototype.start = function () {
    //more code
    setInterval(function () {
        gameLoop(play);
    }, this.setting.updateSeconds * 1000);
    this.goToPosition(new OpeningPosition());
};

GameBasics.prototype.keyDown = function (keyboardCode) {
    // store the pressed key in 'pressedKeys'
    this.pressedKeys[keyboardCode] = true;
    //console.log(this.pressedKeys);
    // it calls the present position's keyDown function
    if (this.presentPosition() && this.presentPosition().keyDown) {
        this.presentPosition().keyDown(this, keyboardCode);
    }
};

GameBasics.prototype.keyUp = function (keyboardCode) {
    //delete the release key from 'pressedKeys'
    delete this.pressedKeys[keyboardCode];
};



function gameLoop(play) {
    let presentPosition = play.presentPosition();
    if (presentPosition) {

        // update
        if (presentPosition.update) {
            presentPosition.update(play);
        }

        // draw
        if (presentPosition.draw) {
            presentPosition.draw(play);
        }
    }
}

window.addEventListener('keydown', function (e) {
    const keyboardCode = e.which || e.keyCode || e.key;
    if (keyboardCode == 37 || keyboardCode == 39 || keyboardCode == 32) {
        play.keyDown(keyboardCode);
    }
});

window.addEventListener('keyup', function (e) {
    const keyboardCode = e.which || e.keyCode || e.key;
    play.keyUp(keyboardCode);
});

const play = new GameBasics(canvas);
play.start();
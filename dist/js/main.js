var game = (function(){
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  // Create the player object
  // Define all argument that will be used by fillRect()
  var player = {
    x:0,
    y:475,
    h: 25,
    w: 25,
    fill: '#fff',
    // Add a default direction for player movement.
    dir: 'right',
    // Add a speed property to the player this is the number of pixels the player will move each frame
    speed: 5
  }

  // Define an enemy spawn
  var spawn = {
    x: 50,
    y: 0,
    h: 10,
    w: 10,
    fill: '#ff0',
    speed: 5,
  }

  // init spawn object
  var spawns = {};
  // init var for launching spawns
  var spawner = null;

  // Create a method for launching spawns
  function launchSpawns(){
    // run spawner every 400 ms
    spawner = setInterval(() => {
      // random string identifier for spawn
      var text = "";
      var possible = "abcdefghijklmnopqrstuvwxyz";

      for (var i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      // add new spawn to object
      spawns[text] = {
        x: Math.floor(Math.random()*this.canvas.width),
        y: spawn.y,
        h: spawn.h,
        w: spawn.w,
        fill: spawn.fill,
        speed: spawn.speed
      }
    }, 400);

    ctx.fillStyle=spawn.fill;

    ctx.clearRect(
      spawn.x-1,
      spawn.y-spawn.speed,
      spawn.w+2,
      spawn.h+2
    );
    

    ctx.fillRect(
      spawn.x,
      spawn.y = (spawn.y + spawn.speed),
      spawn.w,
      spawn.h
    );
  }

  return {

    // Draw the player to the canvas
    player: function(){
      ctx.fillStyle=player.fill;

      // Add x pixels to move the player to the right
      if (player.dir === 'right') {
        // Define how many pixels the player should move each frame (i.e. speed)
        ctx.clearRect(
          player.x - player.speed,
          player.y-1,
          player.w+2,
          player.h+2
        );

        ctx.fillRect(
          player.x = (player.x + player.speed),
          player.y,
          player.w,
          player.h
        );

        // Change the player direction when the player touches the edge 
        //of the canvas.
        if((player.x + player.w) >= canvas.width){
          player.dir = 'left';
        }
      } else {
        //4. Change player.x+1 to player.x+player.speed
        ctx.clearRect(
          player.x + player.speed,
          player.y-1,
          player.w+2,
          player.h+2
        );
        // Subtract x pixels to move the player to the left
        ctx.fillRect(
          player.x = (player.x - player.speed),
          player.y,
          player.w,
          player.h
        );

        // Change the player direction when the player touches the edge of the canvas.
        if(player.x <= 0){
          player.dir = 'right';
        }
      }
    },

    // Create a setter for changing the current direction of the user.
    changeDirection: function(){
      if(player.dir === 'left'){
        player.dir = 'right';
      }else if(player.dir === 'right'){
        player.dir = 'left';
      }
    },

    // Create an animation frame
    // Redraw the player every time a frame is executed
    animate: function(){
      this.player();
      // Animate the spawns
      launchSpawns();
      window.requestAnimationFrame(this.animate.bind(this));
    },

    init: function(){
      canvas.height = 600;
      canvas.width = 800;

      this.animate();
    }
  }
})();

game.init();

// Add a listener to allow the  user to change the direction of the player sprite
window.addEventListener('keyup', function(){
  game.changeDirection();
});
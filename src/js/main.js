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
    fill: '#ffbb00',
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
    fill: '#1b14e3',
    speed: 5,
  }

  // init spawn object
  var spawns = {};
  // init var for launching spawns
  var spawner = null;
  //Add the animation frames to a variable that we can kill later
  var animation  = null;
  var gameOver = false;
  var score = 0;


  // Create a method for launching spawns
  function launchSpawns() {
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
        speed:Math.floor(Math.random() * 7),
      }
    }, 400);
  }
  
  // move all spawn
  function moveSpawns() {
    // loop spawns obj and move each spawn
    if (Object.keys(spawns).length > 0) {
      for (let spawn in spawns) {
        // move spawn if spawn not moved off-screen
        if(spawns[spawn].y <= canvas.height) {
          ctx.fillStyle = spawns[spawn].fill;
          ctx.save();
          ctx.clearRect(
            spawns[spawn].x - 1,
            spawns[spawn].y - spawns[spawn].speed,
            spawns[spawn].w + 2,
            spawns[spawn].h + 2
          );
          ctx.fillRect(
            spawns[spawn].x,
            spawns[spawn].y = (spawns[spawn].y+spawns[spawn].speed),
            spawns[spawn].w,
            spawns[spawn].h
          );
          ctx.restore();

          // When each spawn, moves detect if that spawn shares common pixels with the player
          if (player.x < spawns[spawn].x + spawns[spawn].w && spawns[spawn].x > player.x && spawns[spawn].x < (player.x + player.w) && player.y < spawns[spawn].y + spawns[spawn].h && player.y + player.h > spawns[spawn].y) {
            // If there is a collision set gameOver to true
            gameOver = true;
            // ...kill the animation frames
            cancelAnimationFrame(animation);
            // ...then kill the spawner
            clearInterval(spawner);
          }
        } else {
          // score++ when spawn moves off-screen
          score += 10;
          console.log(score);
          // Write the score to a separate div
          document.getElementById('score').innerHTML = score;
          // delete spawn if spawn moves off-screen
          delete spawns[spawn];
        }
      }
    }
  }

    // Draw the player to the canvas
    function movePlayer(){
      ctx.fillStyle=player.fill;

      // Add x pixels to move the player to the right
      if (player.dir === 'right') {
        // Define how many pixels the player should move each frame (i.e. speed)
        ctx.clearRect(
          player.x - player.speed,
          player.y - 1,
          player.w + 2,
          player.h + 2
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
          player.y - 1,
          player.w + 2,
          player.h + 2
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
    }

    // Create an animation frame
    // Redraw the player every time a frame is executed
    function animate(){
      movePlayer();
      // Animate the spawns
      moveSpawns();
      // Only animate if the game is not over.
      if(gameOver===false){
        animation = window.requestAnimationFrame(animate.bind(animation));
      }
    }


  return {

    // Create a setter for changing the current direction of the user.
    changeDirection: function(){
      if(player.dir === 'left'){
        player.dir = 'right';
      }else if(player.dir === 'right'){
        player.dir = 'left';
      }
    },

    init: function(){
      canvas.height = 600;
      canvas.width = 800;

      launchSpawns();
      animate();
    }
  }
})();

game.init();

// Add a listener to allow the  user to change the direction of the player sprite
window.addEventListener('keyup', function(){
  game.changeDirection();
});
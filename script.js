const canvas = document.getElementById('ballCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// Ball properties
const ball = {
  radius: 30,          // Ball size
  x: canvas.width / 2, // Start from center horizontally
  y: 30,               // Start from top (radius distance)
  dx: 3,               // Horizontal velocity
  dy: 2,               // Initial downward velocity
  gravity: 0.5,        // Gravity effect
  bounceFactor: 1,     // Perfect bounce (no energy loss)
  color: 'orange'
};

// Variables to detect shake
let lastX = 0, lastY = 0, lastZ = 0;
let shakeThreshold = 15; // Minimum shake threshold to trigger bounce
let lastUpdateTime = 0;

// Ball drawing function
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// Ball movement logic
function updateBall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ball
  drawBall();

  // Apply gravity
  ball.dy += ball.gravity;

  // Update ball position
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Collision with bottom wall
  if (ball.y + ball.radius >= canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.dy = -ball.dy * ball.bounceFactor;
  }

  // Collision with top wall
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    ball.dy = -ball.dy;
  }

  // Collision with side walls
  if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
    ball.dx = -ball.dx;
  }

  requestAnimationFrame(updateBall);
}

// Shake detection function
function detectShake(event) {
  let currentTime = new Date().getTime();
  let timeDiff = currentTime - lastUpdateTime;
  if (timeDiff > 100) { // Prevent detecting shake too often
    let x = event.accelerationIncludingGravity.x;
    let y = event.accelerationIncludingGravity.y;
    let z = event.accelerationIncludingGravity.z;
    
    let deltaX = x - lastX;
    let deltaY = y - lastY;
    let deltaZ = z - lastZ;

    let shakeMagnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
    
    if (shakeMagnitude > shakeThreshold) {
      // Increase ball speed when shaking
      ball.dy -= 10;  // Give a push upward when shaken
    }

    lastX = x;
    lastY = y;
    lastZ = z;
    lastUpdateTime = currentTime;
  }
}

// Start shake detection
if (window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', detectShake, false);
}

// Start animation
updateBall();
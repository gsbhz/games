var numberOfTeams = 1;

var nextMove = 0;
var gameHasBeenWon = false;
var startingHighScore = readCookie('hi');
if (!startingHighScore) startingHighScore = 0; //prevent 'null' result before cookie is created

function showNextMove()
{
  nextMove = teams[currentTeam].startTile.appendTo(teams[currentTeam].startPath);
  if ((nextMove == startTile) || (nextMove.team == 'wall'))
  {
    gameHasBeenWon = true;
    previewBoard.canvas.style.display = 'none';
    gameBoard.render();
    nextMove = false;

    var appendAd = '';
    teams[0].highScore = startingHighScore;

    if((startingHighScore < 75) && (startingHighScore >= 50))
    {
      if(teams[0].score >= 75)
      {
        appendAd = '<br />我靠你老牛B，你超越了神！！！膜拜！！！<br />';
      } else {
        appendAd = '<br />你已经无尽接近神了，继续努力有更多惊喜！<br />';
      }
    }
    if (teams[0].score > teams[0].highScore)
    {
      teams[0].highScore = teams[0].score;
      createCookie('hi', teams[0].highScore, 365);
      showMessage("更多资源尽在HTML5中文网! <a href='http://www.html5china.com/html5games/line/'>重新开始?</a><br />" + appendAd + "<br /><span style='color: " + teams[0].color + ";'>您产生了新记录! <span style='font-size: 1.4em;'>" + teams[0].highScore + "</span></span>");
    } else {
      showMessage("更多资源尽在HTML5中文网! <a href='http://www.html5china.com/html5games/line/'>重新开始?</a><br />" + appendAd + "<br /><span style='color: " + teams[0].color + ";'>您的记录: <span style='font-size: 1.4em;'>" + teams[0].highScore + "</span></span>");
    }
    drawSolitaireScore();
  } else {
    gameBoard.rescale(nextMove.x, nextMove.y);
    nextMove.render();

    teams[0].highScore = startingHighScore;
    if (teams[0].score > teams[0].highScore)
    {
      teams[0].highScore = teams[0].score;
      createCookie('hi', teams[0].highScore, 365);
    }
    showMessage("<span style='color: " + teams[0].color + ";'>您的记录: <span style='font-size: 1.4em;'>" + teams[0].highScore + "</span></span>");
      
    drawSolitaireScore();

    holdingTile.pairs = teams[0].tiles[0].pairs;
    holdingTile.render();

/* may need to change following if arrayed in the future
    if(teams[currentTeam].tiles.length > 1)
    {
      queueTile.pairs = teams[currentTeam].tiles[1].pairs;
      queueTile.render();
    } */
  }
}

function drawSolitaireScore()
{
  if (touchable) // this doesn't seem to work for iPad so we do it different
  {
    document.getElementById('scores').style.display = 'block';
    document.getElementById('scores').innerHTML = '<b style="color: ' + teams[currentTeam].color + ';">Score: ' + teams[currentTeam].score + '</b>';
  } else {
  document.getElementById('scores').style.display = 'none';
  var width = parseInt(gameBoard.scale * GRID_X);
  var height = parseInt(gameBoard.scale * GRID_Y);

  startTile.render();
  gameBoard.context.textAlign = 'center';
  gameBoard.context.textBaseline = 'middle';
  gameBoard.context.font = parseInt(height * 0.5) + 'px Arial bold';
  if(teams[0].score > 99) gameBoard.context.font = parseInt(height * 0.3) + 'px Arial';
  gameBoard.context.fillStyle = teams[currentTeam].color;
  gameBoard.context.fillText(teams[currentTeam].score, gameBoard.width / 2, gameBoard.height / 2);
  }
}

function placeTile()
{
  if (!gameHasBeenWon)
  {
    nextMove.pairs = holdingTile.pairs.slice();
    teams[currentTeam].tiles[0].generate();
    nextMove.colors = ["gray","gray","gray","gray","gray","gray","gray","gray","gray","gray","gray","gray"];
    nextMove.paint();
    nextMove.render();

    var x = 0;
    teams[0].score = teams[0].startTile.calculateScore(teams[0].startPath, 0);
    var displayScores = '<div style="color: ' + teams[0].color + ';">' + teams[0].score + '</div>';
    showScores(displayScores);

    showNextMove();
  }
}

var gameBoard;
var startTile;
var previewBoard;
var holdingTile;
/* var queueBoard;
var queueTile; */
function beginGame() {
  var title = document.getElementById('title');
  title.style.background = 'transparent';
  title.style.width = '250px';
  title.style.height = '40px';
  title.style.margin = '10px';
  title.innerHTML = '<a href="http://www.html5china.com/"><img src="i/entanglement-logo-250.png" alt="Entanglement" /></a>';
  document.getElementById("msg").innerHTML = '';
  document.getElementById("msg").style.bottom = '20px';

  gameBoard   = new aMap('game', 0, 0, WIDTH, HEIGHT, SCALE);
  previewBoard = new aMap('preview', 0, 0, 200, 200, +0.5);
//  queueBoard = new aMap('queue', 0, 0, 200, 200, +0.5);
  gameBoard.canvas.onclick = function (e)
  {
    placeTile();
  }
  gameBoard.canvas.oncontextmenu = function (e)
  {
    swapTiles();
    return false;
  }
  addRotateInput(previewBoard.canvas);

  startTile = new aTile(0, 0, 0, 'start', gameBoard);
  gameBoard.add(startTile);
  holdingTile = new aTile(0, 0, 0, 'start', previewBoard);
  previewBoard.add(holdingTile);

//  queueTile = new aTile(0, 0, 0, 'start', queueBoard);
//  queueBoard.add(queueTile);

  var team1 = new aPlayer(0, 'orange', 'orange', startTile, 0, gameBoard);
  teams = [team1];

  drawMap(3, startTile);

  gameBoard.render();

  //hand out tiles
  for (var x in teams) teams[x].addTile(new aTile(0, 0, 0, 0, previewBoard)).generate();
//  var highScore = readCookie('hi');
//  if (highScore > 15) for (var x in teams) teams[x].addTile(new aTile(0, 0, 0, 0, previewBoard)).generate();

  showNextMove();

  startStepping();
}
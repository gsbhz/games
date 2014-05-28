function aPlayer(id, team, color, startTile, startPath, parent)
{
  this.id = id;
  if (team)
  {
    this.description = id + ' - ' + team + ' team';
    this.team = team;
  } else {
    this.description = id;
    this.team = id;
  }
  if (color)
  {
    this.color = color;
  } else {
    this.color = 'rgb(' + (155 + Math.floor(Math.random()*100)) + ',' + (155 + Math.floor(Math.random()*100)) + ',' + (155 + Math.floor(Math.random()*100)) + ')'
  }
  this.startTile = startTile;
  this.startPath = startPath;
  this.startTile.colors[this.startPath] = this.color;
  this.parent = parent;

  this.update = function ()
  {
  }

  this.tiles = [];
  this.addTile = function(item)
  {
    this.tiles.splice(0,0,item);
    return item;
  }

  this.removeTile = function(item)
  {
    if (!item) item = this.tiles[0];
    for (x in this.tiles) if(item == this.tiles[x])
    {
      this.tiles.splice(x,1);
      return item;
    }
    return false;
  }

  this.swapTiles = function() //puts the last tile in the sequence at the front
  {
    if (this.tiles.length > 1)
    {
      return this.addTile(this.removeTile(this.tiles[this.tiles.length - 1]));
    }
    return false;
  }

  this.highScore = 0;
  this.score = 0;

}
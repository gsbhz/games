function aMap(canvas, x, y, width, height, scale)
{
  this.canvas = document.getElementById(canvas);
  this.canvas.code = this;
  this.maxX = 0;
  this.maxY = 0;

  this.setWindow = function(width, height)
  {
    if(width && height)
    {
      this.width = width;
      this.height = height;
    } else {
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
      this.width = this.canvas.offsetWidth;
      this.height = this.canvas.offsetHeight;
    }
  }
  this.setWindow(width, height);

  this.setFocus = function(x,y,scale)
  {
    this.scale = scale;
    this.x = x + (this.width/(2 * scale));
    this.y = y + (this.height/(2 * scale));
  }
  this.setFocus(x, y, scale);

  this.rescale = function(x,y)
  {
    if (!x && !y)
    {
      this.setWindow();
      this.setFocus(0, 0, this.scale);
      this.render();
    }
    if (Math.abs(x) > this.maxX)
    {
      this.maxX = Math.abs(x);
      if (this.scale > (this.width / (2 * (this.maxX + GRID_X))))
      {
        this.setWindow();
        this.setFocus(0, 0, this.width / (2 * (this.maxX + GRID_X)));
        this.render();
      }
    }
    if (Math.abs(y) > this.maxY)
    {
      this.maxY = Math.abs(y);
      if (this.scale > (this.height / (2 * (this.maxY + GRID_Y))))
      {
        this.setWindow();
        this.setFocus(0, 0, this.height / (2 * (this.maxY + GRID_Y)));
        this.render();
      }
    }
  }

  this.holding = false;
  this.mouseX = 0;
  this.mouseY = 0;
  this.canvas.onmousemove = function (e)
  {
    if(e.offsetX) {
        this.code.mouseX = e.offsetX;
        this.code.mouseY = e.offsetY;
    }
    else
    {
      if(e.layerX) {
        this.code.mouseX = e.layerX;
        this.code.mouseY = e.layerY;
      }
      else
      {
        this.code.mouseX = e.clientX;
        this.code.mouseY = e.clientY;
      }
    }
  }
  this.canvas.onclick = function (e)
  {
  }

  this.context = this.canvas.getContext("2d");
  this.map = new Array();

  this.add = function(item)
  {
    this.map.splice(0,0,item);
    this.isZ = false;
    return item;
  }

  this.remove = function(item)
  {
    for (x in this.map) if(item == this.map[x]) this.map.splice(x,1);
  }

// Conversions

  this.world2windowX = function(worldX, windowX) {return (this.x + worldX + windowX) * this.scale;};
  this.world2windowY = function(worldY, windowY) {return ((this.y + worldY) + windowY) * this.scale;};
  this.window2worldX = function(windowX) {return (windowX / this.scale) - this.x;};
  this.window2worldY = function(windowY) {return (windowY / this.scale) - this.y;};

  this.isZ = false; //makes sure all map items are in the right Z order
  this.update = function()
  {
    for (x in this.map)
    {
      this.map[x].update();
    }
    if (!this.isZ)
    {
      this.map.sort(function(a, b){return (a.offsetZ) - (b.offsetZ);});
      this.isZ = true;
    }
  }

  this.render = function()
  {
    this.context.clearRect(0, 0, this.width, this.height);
    for (x in this.map)
    {
      this.map[x].render();
    }
  }

  this.drawPath = function(x, y, scale, point1, point2, color1, color2, backgroundColor)
  {
   if ((color1 != 'gray') || (!gameHasBeenWon))
   {
    var oX = (this.x + x) * this.scale;
    var oY = (this.y + y) * this.scale;
    var rX = OFFSET_X * scale;
    var rY = OFFSET_Y * scale;

    var x1 = oX + getPointX(point1, rX);
    var y1 = oY + getPointY(point1, rY);
    var x2 = oX + getPointX(point2, rX);
    var y2 = oY + getPointY(point2, rY);


    // Path Border
    if (!backgroundColor)
    {
      this.context.strokeStyle = '#fff';
    } else {
      this.context.strokeStyle = backgroundColor;
    }
    this.context.lineWidth = 22 * scale;
    if (gameHasBeenWon) this.context.lineWidth = 36 * scale;
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.bezierCurveTo(oX + getBezierX(point1, rX), oY + getBezierY(point1, rY), oX + getBezierX(point2, rX), oY + getBezierY(point2, rY), x2, y2);
//  this.context.closePath();
    this.context.stroke();


    // Colorful Path
    if ((!color2) || (color1 == color2))
    {
      this.context.strokeStyle = color1;
    } else {
      var gradient = this.context.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0.1, color1);
      gradient.addColorStop(0.9, color2);
      this.context.strokeStyle = gradient;
    }
    this.context.lineWidth = 14 * scale;
    if (gameHasBeenWon) this.context.lineWidth = 28 * scale;
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.bezierCurveTo(oX + getBezierX(point1, rX), oY + getBezierY(point1, rY), oX + getBezierX(point2, rX), oY + getBezierY(point2, rY), x2, y2);
//  this.context.closePath();
    this.context.stroke();
   }
  }

  this.drawHexagon = function(x, y, scale, color)
  {
//   if (!gameHasBeenWon)
   

    var oX = (this.x + x) * this.scale;
    var oY = (this.y + y) * this.scale;
    var sY = OFFSET_Y * scale;
    var sX = OFFSET_X * scale;

    this.context.fillStyle = color;
    this.context.strokeStyle = '#aaa';
    this.context.lineWidth = this.scale;

    this.context.beginPath();
    this.context.moveTo(oX - sX, oY - sY);
    this.context.lineTo(oX + sX, oY - sY);
    this.context.lineTo(oX + 2 * sX, oY);
    this.context.lineTo(oX + sX, oY + sY);
    this.context.lineTo(oX - sX, oY + sY);
    this.context.lineTo(oX - 2 * sX, oY);
    this.context.lineTo(oX - sX, oY - sY);
    this.context.closePath();

    this.context.fill();
//    this.context.stroke();

    var bevel = +0.92;
    var clear = 'rgba(255,255,255,0)';
    var front = 'rgba(255,255,255,0.5)';
    var frontSide = 'rgba(255,255,255,0.15)';
    var back = 'rgba(0,0,0,0.5)';
    var backSide = 'rgba(0,0,0,0.15)';
    var gradient;

    gradient = this.context.createLinearGradient(oX, oY, oX, oY - sY);
    gradient.addColorStop(bevel, clear);
    gradient.addColorStop(1, frontSide);
    this.context.fillStyle = gradient;
    this.context.beginPath();
    this.context.moveTo(oX, oY);
    this.context.lineTo(oX - sX, oY - sY);
    this.context.lineTo(oX + sX, oY - sY);
    this.context.closePath();
    this.context.fill();

    gradient = this.context.createLinearGradient(oX, oY, oX + 1.5 * sX, oY - 0.5 * sY);
    gradient.addColorStop(bevel, clear);
    gradient.addColorStop(1, backSide);
    this.context.fillStyle = gradient;
    this.context.beginPath();
    this.context.moveTo(oX, oY);
    this.context.lineTo(oX + sX, oY - sY);
    this.context.lineTo(oX + 2 * sX, oY);
    this.context.closePath();
    this.context.fill();

    gradient = this.context.createLinearGradient(oX, oY, oX + 1.5 * sX, oY + 0.5 * sY);
    gradient.addColorStop(bevel, clear);
    gradient.addColorStop(1, back);
    this.context.fillStyle = gradient;
    this.context.beginPath();
    this.context.moveTo(oX, oY);
    this.context.lineTo(oX + 2 * sX, oY);
    this.context.lineTo(oX + sX, oY + sY);
    this.context.closePath();
    this.context.fill();

    gradient = this.context.createLinearGradient(oX, oY, oX, oY + sY);
    gradient.addColorStop(bevel, clear);
    gradient.addColorStop(1, backSide);
    this.context.fillStyle = gradient;
    this.context.beginPath();
    this.context.moveTo(oX, oY);
    this.context.lineTo(oX + sX, oY + sY);
    this.context.lineTo(oX - sX, oY + sY);
    this.context.closePath();
    this.context.fill();

    gradient = this.context.createLinearGradient(oX, oY, oX - 1.5 * sX, oY + 0.5 * sY);
    gradient.addColorStop(bevel, clear);
    gradient.addColorStop(1, frontSide);
    this.context.fillStyle = gradient;
    this.context.beginPath();
    this.context.moveTo(oX, oY);
    this.context.lineTo(oX - sX, oY + sY);
    this.context.lineTo(oX - 2 * sX, oY);
    this.context.closePath();
    this.context.fill();

    gradient = this.context.createLinearGradient(oX, oY, oX - 1.5 * sX, oY - 0.5 * sY);
    gradient.addColorStop(bevel, clear);
    gradient.addColorStop(1, front);
    this.context.fillStyle = gradient;
    this.context.beginPath();
    this.context.moveTo(oX, oY);
    this.context.lineTo(oX - 2 * sX, oY);
    this.context.lineTo(oX - sX, oY - sY);
    this.context.closePath();
    this.context.fill();

//    this.context.stroke();



   
  }


}
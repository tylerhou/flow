var Vector;

Vector = (function() {
  function Vector(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  Vector.prototype.reverse = function() {
    return new Vector(-this.dx, -this.dy);
  };

  Vector.prototype.length = function() {
    return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  };

  Vector.prototype.scale = function(xscalar, yscalar) {
    if (yscalar == null) {
      yscalar = xscalar;
    }
    return new Vector(this.dx * xscalar, this.dy * yscalar);
  };

  Vector.prototype.add = function(vector) {
    return new Vector(this.dx + vector.dx, this.dy + vector.dy);
  };

  Vector.prototype.dot = function(vector) {
    return this.dx * vector.dx + this.dy * vector.dy;
  };

  Vector.prototype.perpendicular = function() {
    return new Vector(-this.dy, this.dx);
  };

  Vector.prototype.copy = function() {
    return new Vector(this.dx, this.dy);
  };

  Vector.prototype.normalize = function() {
    return this.scale(1 / this.length());
  };

  return Vector;

})();

var Point;

Point = (function() {
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  Point.prototype.add = function(vector) {
    return new Point(this.x + vector.dx, this.y + vector.dy);
  };

  Point.prototype.to = function(point) {
    return new Vector(point.x - this.x, point.y - this.y);
  };

  Point.prototype.midpoint = function(point) {
    return new Point((point.x + this.x) / 2, (point.y + this.y) / 2);
  };

  Point.prototype.copy = function() {
    return new Point(this.x, this.y);
  };

  Point.prototype.toString = function() {
    return '(' + this.x + ',' + this.y + ')';
  };

  return Point;

})();

var Circle;

Circle = (function() {
  function Circle(stage, point, vector, radius, color1) {
    this.stage = stage;
    this.point = point != null ? point : new Point(0, 0);
    this.vector = vector != null ? vector : new Vector(0, 0);
    this.radius = radius != null ? radius : 0;
    this.color = color1;
    this.circle = new createjs.Shape();
    this.colorCommand = this.circle.graphics.beginFill(this.color).command;
    this.circle.graphics.drawCircle(0, 0, this.radius);
    this.visible = false;
  }

  Circle.prototype.move = function(t) {
    if (t == null) {
      t = 1;
    }
    this.point = this.point.add(this.vector.scale(t));
    this.circle.x = this.point.x;
    return this.circle.y = this.point.y;
  };

  Circle.prototype.draw = function() {
    this.stage.addChild(this.circle);
    this.move(0);
    return this.visible = true;
  };

  Circle.prototype.remove = function() {
    this.stage.removeChild(this.circle);
    return this.visible = false;
  };

  Circle.prototype.setColor = function(color) {
    this.color = color;
    return this.colorCommand.style = color;
  };

  Circle.prototype.mass = function() {
    return this.radius * this.radius;
  };

  Circle.prototype.distance = function(circle) {
    return Math.sqrt(Math.pow(circle.point.x - this.point.x, 2) + Math.pow(circle.point.y - this.point.y, 2));
  };

  Circle.prototype.intersect = function(circle) {
    return Math.pow(circle.point.x - this.point.x, 2) + Math.pow(circle.point.y - this.point.y, 2) < Math.pow(circle.radius + this.radius, 2) && circle !== this;
  };

  return Circle;

})();

var Quadrant;

Quadrant = (function() {
  function Quadrant(stage, topLeft1, bottomRight1) {
    var i;
    this.stage = stage;
    this.topLeft = topLeft1;
    this.bottomRight = bottomRight1;
    this.center = this.topLeft.midpoint(this.bottomRight);
    this.circles = [];
    this.quadrants = (function() {
      var j, results;
      results = [];
      for (i = j = 0; j < 4; i = ++j) {
        results.push(null);
      }
      return results;
    })();
    this.MAX_DEPTH = Infinity;
  }

  Quadrant.prototype.call = function(func) {
    var circle, j, k, len, len1, quadrant, ref, results;
    for (j = 0, len = circles.length; j < len; j++) {
      circle = circles[j];
      func(circle);
    }
    ref = this.quadrants;
    results = [];
    for (k = 0, len1 = ref.length; k < len1; k++) {
      quadrant = ref[k];
      if (quadrant != null) {
        results.push(quadrant.call(func));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Quadrant.prototype.index = function(circle) {
    var ref, ref1;
    if ((circle.point.x - circle.radius < (ref = this.center.x) && ref < circle.point.x + circle.radius) || (circle.point.y - circle.radius < (ref1 = this.center.y) && ref1 < circle.point.y + circle.radius)) {
      return -1;
    } else {
      return (circle.point.x > this.center.x ? 1 : 0) + (circle.point.y > this.center.y ? 2 : 0);
    }
  };

  Quadrant.prototype.insert = function(circle) {
    var bottomRight, num, topLeft;
    if (circle == null) {
      console.log(circle);
    }
    num = this.index(circle);
    if (num === -1) {
      return this.circles.push(circle);
    } else {
      if (this.quadrants[num] != null) {
        return this.quadrants[num].insert(circle);
      } else {
        topLeft = new Point((num % 2 === 0 ? this.topLeft.x : this.center.x), (num < 2 ? this.topLeft.y : this.center.y));
        bottomRight = new Point((num % 2 === 0 ? this.center.x : this.bottomRight.x), (num < 2 ? this.center.y : this.bottomRight.y));
        this.quadrants[num] = new Quadrant(this.stage, topLeft, bottomRight);
        return this.quadrants[num].insert(circle);
      }
    }
  };

  Quadrant.prototype.remove = function(circle) {
    var num;
    num = this.index(circle);
    if (num === -1) {
      return this.circles.splice(this.circles.indexOf(circle), 1);
    } else {
      return this.quadrants[num].remove(circle);
    }
  };

  Quadrant.prototype.retrieve = function(circle) {
    var num;
    num = this.index(circle);
    if (num === -1) {
      return this.circles;
    } else {
      return this.circles.concat(this.quadrants[num].retrieve(circle));
    }
  };

  Quadrant.prototype.draw = function() {
    var j, len, quadrant, ref, results;
    this.rectangle = new createjs.Shape();
    this.rectangle.graphics.beginStroke('#000000').drawRect(this.topLeft.x, this.topLeft.y, this.bottomRight.x - this.topLeft.x, this.bottomRight.y - this.topLeft.y);
    this.stage.addChild(this.rectangle);
    ref = this.quadrants;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      quadrant = ref[j];
      if (quadrant != null) {
        results.push(quadrant.draw());
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Quadrant.prototype.undraw = function() {
    var j, len, quadrant, ref, results;
    this.stage.removeChild(this.rectangle);
    ref = this.quadrants;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      quadrant = ref[j];
      if (quadrant != null) {
        results.push(quadrant.remove());
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return Quadrant;

})();

var circle, circles, collide, collideTime, colors, frame, i, j, len, randPoint, randVector, stage;

$('#flowcanvas').attr('width', $(window).width().toString());

$('#flowcanvas').attr('height', $(window).height().toString());

stage = new createjs.Stage('flowcanvas');

randPoint = function() {
  return new Point(Math.random() * $(window).width(), Math.random() * $(window).height());
};

randVector = function() {
  return new Vector(500 * (Math.random() - .5), 500 * (Math.random() - .5));
};

circles = (function() {
  var j, results;
  results = [];
  for (i = j = 0; j < 75; i = ++j) {
    results.push(new Circle(stage, randPoint(), randVector(), 20 * Math.random() + 5, 'red'));
  }
  return results;
})();

colors = [];

colors = colors.concat((function() {
  var j, results;
  results = [];
  for (i = j = 0; j <= 5; i = ++j) {
    results.push('rgb(0,0,' + (45 * i + 40) + ')');
  }
  return results;
})());

console.log(colors);

for (j = 0, len = circles.length; j < len; j++) {
  circle = circles[j];
  circle.setColor(colors[~~(Math.random() * colors.length)]);
  circle.draw();
}

stage.update();

collideTime = function(circle, other) {
  var p1x, p1y, p2x, p2y, r1, r2, v1x, v1y, v2x, v2y;
  p1x = circle.point.x;
  p1y = circle.point.y;
  v1x = circle.vector.dx;
  v1y = circle.vector.dy;
  r1 = circle.radius;
  p2x = other.point.x;
  p2y = other.point.y;
  v2x = other.vector.dx;
  v2y = other.vector.dy;
  r2 = other.radius;
  return (-p1x * v1x + p1x * v2x - p1y * v1y + p1y * v2y + p2x * v1x - p2x * v2x + p2y * v1y - p2y * v2y - Math.sqrt(-Math.pow(p1x, 2) * Math.pow(v1y, 2) + 2 * Math.pow(p1x, 2) * v1y * v2y - Math.pow(p1x, 2) * Math.pow(v2y, 2) + 2 * p1x * p1y * v1x * v1y - 2 * p1x * p1y * v1x * v2y - 2 * p1x * p1y * v1y * v2x + 2 * p1x * p1y * v2x * v2y + 2 * p1x * p2x * Math.pow(v1y, 2) - 4 * p1x * p2x * v1y * v2y + 2 * p1x * p2x * Math.pow(v2y, 2) - 2 * p1x * p2y * v1x * v1y + 2 * p1x * p2y * v1x * v2y + 2 * p1x * p2y * v1y * v2x - 2 * p1x * p2y * v2x * v2y - Math.pow(p1y, 2) * Math.pow(v1x, 2) + 2 * Math.pow(p1y, 2) * v1x * v2x - Math.pow(p1y, 2) * Math.pow(v2x, 2) - 2 * p1y * p2x * v1x * v1y + 2 * p1y * p2x * v1x * v2y + 2 * p1y * p2x * v1y * v2x - 2 * p1y * p2x * v2x * v2y + 2 * p1y * p2y * Math.pow(v1x, 2) - 4 * p1y * p2y * v1x * v2x + 2 * p1y * p2y * Math.pow(v2x, 2) - Math.pow(p2x, 2) * Math.pow(v1y, 2) + 2 * Math.pow(p2x, 2) * v1y * v2y - Math.pow(p2x, 2) * Math.pow(v2y, 2) + 2 * p2x * p2y * v1x * v1y - 2 * p2x * p2y * v1x * v2y - 2 * p2x * p2y * v1y * v2x + 2 * p2x * p2y * v2x * v2y - Math.pow(p2y, 2) * Math.pow(v1x, 2) + 2 * Math.pow(p2y, 2) * v1x * v2x - Math.pow(p2y, 2) * Math.pow(v2x, 2) + Math.pow(r1, 2) * Math.pow(v1x, 2) - 2 * Math.pow(r1, 2) * v1x * v2x + Math.pow(r1, 2) * Math.pow(v1y, 2) - 2 * Math.pow(r1, 2) * v1y * v2y + Math.pow(r1, 2) * Math.pow(v2x, 2) + Math.pow(r1, 2) * Math.pow(v2y, 2) + 2 * r1 * r2 * Math.pow(v1x, 2) - 4 * r1 * r2 * v1x * v2x + 2 * r1 * r2 * Math.pow(v1y, 2) - 4 * r1 * r2 * v1y * v2y + 2 * r1 * r2 * Math.pow(v2x, 2) + 2 * r1 * r2 * Math.pow(v2y, 2) + Math.pow(r2, 2) * Math.pow(v1x, 2) - 2 * Math.pow(r2, 2) * v1x * v2x + Math.pow(r2, 2) * Math.pow(v1y, 2) - 2 * Math.pow(r2, 2) * v1y * v2y + Math.pow(r2, 2) * Math.pow(v2x, 2) + Math.pow(r2, 2) * Math.pow(v2y, 2))) / (Math.pow(v1x, 2) - 2 * v1x * v2x + Math.pow(v1y, 2) - 2 * v1y * v2y + Math.pow(v2x, 2) + Math.pow(v2y, 2));
};

collide = function(quadtree, circle, other) {
  var m1, m2, offset, un, ut, v1n, v1nprime, v1t, v2n, v2nprime, v2t;
  un = circle.point.to(other.point).normalize();
  ut = un.perpendicular();
  v1n = un.dot(circle.vector);
  v2n = un.dot(other.vector);
  v1t = ut.dot(circle.vector);
  v2t = ut.dot(other.vector);
  offset = un.scale((circle.radius + other.radius) - circle.distance(other) + 1);
  m1 = circle.mass();
  m2 = other.mass();
  circle.point = circle.point.add(offset.reverse().scale(m2 / (m1 + m2)));
  other.point = other.point.add(offset.scale(m1 / (m1 + m2)));
  v1nprime = un.scale((v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2));
  v2nprime = un.scale((v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2));
  circle.vector = v1nprime.add(ut.scale(v1t));
  return other.vector = v2nprime.add(ut.scale(v2t));
};

createjs.Ticker.framerate = 60;

createjs.Ticker.addEventListener('tick', frame = function(event) {
  var a, k, l, len1, len2, len3, len4, m, n, other, quadtree, temp;
  if (event == null) {
    event = {
      delta: 1000
    };
  }
  temp = circles.slice(0);
  for (k = 0, len1 = circles.length; k < len1; k++) {
    circle = circles[k];
    circle.move(event.delta / 1000);
  }
  quadtree = new Quadrant(stage, new Point(0, 0), new Point($(window).width(), $(window).height()));
  for (l = 0, len2 = circles.length; l < len2; l++) {
    circle = circles[l];
    if (circle.point.x - circle.radius < 0) {
      circle.vector = circle.vector.scale(-1, 1);
      circle.point.x = circle.radius;
    }
    if (circle.point.x + circle.radius > $(window).width()) {
      circle.vector = circle.vector.scale(-1, 1);
      circle.point.x = $(window).width() - circle.radius;
    }
    if (circle.point.y - circle.radius < 0) {
      circle.vector = circle.vector.scale(1, -1);
      circle.point.y = circle.radius;
    }
    if (circle.point.y + circle.radius > $(window).height()) {
      circle.vector = circle.vector.scale(1, -1);
      circle.point.y = $(window).height() - circle.radius;
    }
    quadtree.insert(circle);
  }
  for (m = 0, len3 = circles.length; m < len3; m++) {
    circle = circles[m];
    a = quadtree.retrieve(circle);
    console.log(a);
    for (n = 0, len4 = a.length; n < len4; n++) {
      other = a[n];
      if (circle.intersect(other)) {
        collide(quadtree, circle, other);
      }
    }
  }
  circles = temp;
  return stage.update();
});

$(window).bind('resize', function() {
  $('#flowcanvas').attr('width', $(window).width().toString());
  $('#flowcanvas').attr('height', $(window).height().toString());
  return stage.update();
});

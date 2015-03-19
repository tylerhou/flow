class Point
  
  constructor: (@x, @y) ->

  add: (vector) ->
    new Point(@x + vector.dx, @y + vector.dy)

  to: (point) ->
    new Vector(point.x - @x, point.y - @y)

  midpoint: (point) ->
    new Point((point.x + @x) / 2, (point.y + @y) / 2)

  copy: ->
    new Point(@x, @y)

  toString: ->
    '(' + @x + ',' + @y + ')'
class Vector

  constructor: (@dx, @dy) ->

  reverse: ->
    new Vector(-@dx, -@dy)

  length: ->
    Math.sqrt(@dx*@dx + @dy*@dy)

  scale: (xscalar, yscalar=xscalar) ->
    new Vector(@dx * xscalar, @dy * yscalar)

  add: (vector) ->
    new Vector(@dx + vector.dx, @dy + vector.dy)

  dot: (vector) ->
    @dx * vector.dx + @dy * vector.dy

  perpendicular: ->
    new Vector(-@dy, @dx)

  copy: ->
    new Vector(@dx, @dy)

  normalize: ->
    @scale(1/@length())
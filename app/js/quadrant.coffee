class Quadrant

  constructor: (@stage, @topLeft, @bottomRight) ->
    @center = @topLeft.midpoint(@bottomRight)
    @circles = []
    @quadrants = (null for i in [0...4])

  call: (func) ->
    for circle in circles
      func(circle)
    for quadrant in @quadrants
      if quadrant?
        quadrant.call(func)

  index: (circle) ->
    if circle.point.x - circle.radius < @center.x < circle.point.x + circle.radius or circle.point.y - circle.radius < @center.y < circle.point.y + circle.radius then -1 else (if circle.point.x > @center.x then 1 else 0) + (if circle.point.y > @center.y then 2 else 0)

  insert: (circle) ->
    num = @index(circle)
    if num == -1
      @circles.push(circle)
    else
      if @quadrants[num]?
        @quadrants[num].insert(circle)
      else
        topLeft = new Point((if num % 2 == 0 then @topLeft.x else @center.x), (if num < 2 then @topLeft.y else @center.y))
        bottomRight = new Point((if num % 2 == 0 then @center.x else @bottomRight.x), (if num < 2 then @center.y else @bottomRight.y))
        @quadrants[num] = new Quadrant(@stage, topLeft, bottomRight)
        @quadrants[num].insert(circle)

  retrieve: (circle) ->
    num = @index(circle)
    if num == -1
      @circles
    else
      @circles.concat(@quadrants[num].retrieve(circle))

  draw: ->
    @rectangle = new createjs.Shape()
    @rectangle.graphics.beginStroke('#000000').drawRect(@topLeft.x, @topLeft.y, @bottomRight.x-@topLeft.x, @bottomRight.y-@topLeft.y)
    @stage.addChild(@rectangle)
    for quadrant in @quadrants
      if quadrant?
        quadrant.draw()

  remove: ->
    @stage.removeChild(@rectangle)
    for quadrant in @quadrants
      if quadrant?
        quadrant.remove()
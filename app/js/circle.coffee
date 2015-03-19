class Circle
  
  constructor: (@stage, @point=new Point(0,0), @vector=new Vector(0,0), @radius=0, @color) ->
    @circle = new createjs.Shape()
    @colorCommand = @circle.graphics.beginFill(@color).command
    @circle.graphics.drawCircle(0, 0, @radius)
    @visible = false

  move: (t=1) ->
    @point = @point.add(@vector.scale(t))
    @circle.x = @point.x
    @circle.y = @point.y

  draw: ->
    @stage.addChild(@circle)
    @move(0)
    @visible = true

  remove: ->
    @stage.removeChild(@circle)
    @visible = false

  setColor: (color)->
    @color = color
    @colorCommand.style = color

  mass: ->
    @radius * @radius

  distance: (circle) ->
    Math.sqrt(Math.pow(circle.point.x - @point.x, 2) + Math.pow(circle.point.y - @point.y, 2))

  intersect: (circle) ->
    Math.pow(circle.point.x - @point.x, 2) + Math.pow(circle.point.y - @point.y, 2) < Math.pow(circle.radius + @radius, 2)
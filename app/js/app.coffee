$('#flowcanvas').attr('width', $(window).width().toString())
$('#flowcanvas').attr('height', $(window).height().toString())
stage = new createjs.Stage('flowcanvas')
randPoint = -> new Point(Math.random()*$(window).width(), Math.random()*$(window).height())
randVector = -> new Vector(500*(Math.random()-.5), 500*(Math.random()-.5))
circles = (new Circle(stage, randPoint(), randVector(), 20*Math.random()+5, 'red') for i in [0...75])
#circles = []
#circles.push(new Circle(stage, new Point($(window).width() / 2 + 25 + 50*i, $(window).height() / 2), new Vector(0, 0), 25, 'red')) for i in [-3...3]
#circles[0].vector.dx = 1000
#circles = []
colors = []
#colors = colors.concat('rgb(' + (45*i+40) + ',0,0)' for i in [0..5]) # red
#colors = colors.concat('rgb(0,' + (45*i+40) + ',0)' for i in [0..5]) # green
colors = colors.concat('rgb(0,0,' + (45*i+40) + ')' for i in [0..5]) # blue
console.log colors
for circle in circles
  circle.setColor(colors[~~(Math.random()*colors.length)])
  circle.draw()
stage.update()

collideTime = (circle, other) ->
  p1x = circle.point.x
  p1y = circle.point.y
  v1x = circle.vector.dx
  v1y = circle.vector.dy
  r1 = circle.radius
  p2x = other.point.x
  p2y = other.point.y
  v2x = other.vector.dx
  v2y = other.vector.dy
  r2 = other.radius
  (-p1x*v1x + p1x*v2x - p1y*v1y + p1y*v2y + p2x*v1x - p2x*v2x + p2y*v1y - p2y*v2y - Math.sqrt(-Math.pow(p1x, 2)*Math.pow(v1y, 2) + 2*Math.pow(p1x, 2)*v1y*v2y - Math.pow(p1x, 2)*Math.pow(v2y, 2) + 2*p1x*p1y*v1x*v1y - 2*p1x*p1y*v1x*v2y - 2*p1x*p1y*v1y*v2x + 2*p1x*p1y*v2x*v2y + 2*p1x*p2x*Math.pow(v1y, 2) - 4*p1x*p2x*v1y*v2y + 2*p1x*p2x*Math.pow(v2y, 2) - 2*p1x*p2y*v1x*v1y + 2*p1x*p2y*v1x*v2y + 2*p1x*p2y*v1y*v2x - 2*p1x*p2y*v2x*v2y - Math.pow(p1y, 2)*Math.pow(v1x, 2) + 2*Math.pow(p1y, 2)*v1x*v2x - Math.pow(p1y, 2)*Math.pow(v2x, 2) - 2*p1y*p2x*v1x*v1y + 2*p1y*p2x*v1x*v2y + 2*p1y*p2x*v1y*v2x - 2*p1y*p2x*v2x*v2y + 2*p1y*p2y*Math.pow(v1x, 2) - 4*p1y*p2y*v1x*v2x + 2*p1y*p2y*Math.pow(v2x, 2) - Math.pow(p2x, 2)*Math.pow(v1y, 2) + 2*Math.pow(p2x, 2)*v1y*v2y - Math.pow(p2x, 2)*Math.pow(v2y, 2) + 2*p2x*p2y*v1x*v1y - 2*p2x*p2y*v1x*v2y - 2*p2x*p2y*v1y*v2x + 2*p2x*p2y*v2x*v2y - Math.pow(p2y, 2)*Math.pow(v1x, 2) + 2*Math.pow(p2y, 2)*v1x*v2x - Math.pow(p2y, 2)*Math.pow(v2x, 2) + Math.pow(r1, 2)*Math.pow(v1x, 2) - 2*Math.pow(r1, 2)*v1x*v2x + Math.pow(r1, 2)*Math.pow(v1y, 2) - 2*Math.pow(r1, 2)*v1y*v2y + Math.pow(r1, 2)*Math.pow(v2x, 2) + Math.pow(r1, 2)*Math.pow(v2y, 2) + 2*r1*r2*Math.pow(v1x, 2) - 4*r1*r2*v1x*v2x + 2*r1*r2*Math.pow(v1y, 2) - 4*r1*r2*v1y*v2y + 2*r1*r2*Math.pow(v2x, 2) + 2*r1*r2*Math.pow(v2y, 2) + Math.pow(r2, 2)*Math.pow(v1x, 2) - 2*Math.pow(r2, 2)*v1x*v2x + Math.pow(r2, 2)*Math.pow(v1y, 2) - 2*Math.pow(r2, 2)*v1y*v2y + Math.pow(r2, 2)*Math.pow(v2x, 2) + Math.pow(r2, 2)*Math.pow(v2y, 2)))/(Math.pow(v1x, 2) - 2*v1x*v2x + Math.pow(v1y, 2) - 2*v1y*v2y + Math.pow(v2x, 2) + Math.pow(v2y, 2))

collide = (quadtree, circle, other) ->
  un = circle.point.to(other.point).normalize()
  ut = un.perpendicular()
  v1n = un.dot(circle.vector)
  v2n = un.dot(other.vector)
  v1t = ut.dot(circle.vector)
  v2t = ut.dot(other.vector)
  offset = un.scale((circle.radius + other.radius) - circle.distance(other)+1)
  m1 = circle.mass()
  m2 = other.mass()
  quadtree.remove(circle)
  quadtree.remove(other)
  circle.point = circle.point.add(offset.reverse().scale(m2/(m1+m2)))
  other.point = other.point.add(offset.scale(m1/(m1+m2)))
  v1nprime = un.scale((v1n * (m1-m2) + 2*m2*v2n) / (m1+m2))
  v2nprime = un.scale((v2n * (m2-m1) + 2*m1*v1n) / (m1+m2))
  circle.vector = v1nprime.add(ut.scale(v1t))
  other.vector = v2nprime.add(ut.scale(v2t))
  quadtree.insert(circle)
  quadtree.insert(other)
  ###for third in quadtree.retrieve(circle)
    if circle.intersect(third)
      collide(quadtree, circle, third)
  for third in quadtree.retrieve(other)
    if other.intersect(third)
      collide(quadtree, other, third)###

#bump = ->
  #for circle in circles
    #if circle.

createjs.Ticker.framerate = 60
createjs.Ticker.addEventListener 'tick', frame = (event={delta: 1000}) ->

  ###while true
    circle = new Circle(stage, randPoint(), new Vector(0,0), 25, 'red')
    if circles.every((c) -> !c.intersect(circle))
      circle.draw()
      circles.push(circle)
      break###

  ###for circle in circles
    circle.move(event.delta/1000)
    circle.vector.dy += 10
    if circle.point.y + circle.radius > $(window).height()
      circle.vector.dy = -circle.vector.dy * .80
      circle.point.y = $(window).height() - circle.radius
      circle.setColor(colors[colors.indexOf(circle.color)+1])
  circles = circles.filter((c) ->
    console.log c.visible
    c.visible
    )
  console.log circles.length
  stage.update()###


  temp = circles[..]

  for circle in circles
    circle.move(event.delta/1000)
    #circle.vector.dy += 2000 * event.delta/1000

  ###energy = 0
  for circle in circles
    energy += circle.mass() * circle.vector.length() #* circle.vector.length()###

  quadtree = new Quadrant(stage, new Point(0, 0), new Point($(window).width(), $(window).height()))
  for circle in circles
    if circle.point.x - circle.radius < 0
      circle.vector = circle.vector.scale(-1, 1)
      circle.point.x = circle.radius
    if circle.point.x + circle.radius > $(window).width()
      circle.vector = circle.vector.scale(-1, 1)
      circle.point.x = $(window).width() - circle.radius
    if circle.point.y - circle.radius < 0
      circle.vector = circle.vector.scale(1, -1)
      circle.point.y = circle.radius
    if circle.point.y + circle.radius > $(window).height()
      circle.vector = circle.vector.scale(1, -1)
      circle.point.y = $(window).height() - circle.radius
    quadtree.insert(circle)
  for circle in circles
    a = quadtree.retrieve(circle)
    for other in a
    #for other in circles
      #console.log other
      try
        if circle.intersect(other)
          collide(quadtree, circle, other)
      catch error
 
  #console.log createjs.Ticker.getMeasuredFPS()
  #console.log energy
  #quadtree.draw()
  circles = temp
  stage.update()
  #quadtree.undraw()
  #createjs.Ticker.removeAllEventListeners()

$(window).bind('resize', ->
  $('#flowcanvas').attr('width', $(window).width().toString())
  $('#flowcanvas').attr('height', $(window).height().toString())
  stage.update()
)
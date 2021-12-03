import turtle
jameson = turtle.Turtle()
jameson.speed(0)
jameson.hideturtle()
larson = turtle.Turtle()
larson.speed(0)
radius = 10
larson.hideturtle()
colors = ["red","pink","violet","blue","green","lime","yellow","orange"]
color_index = 0

for i in range(40):
  color =  colors[color_index]
  jameson.color(color)
  print(color)
  jameson.circle(radius)
  jameson.up()
  jameson.right(90)
  jameson.forward(5)
  turtle.bgcolor(colors[color_index +1])
  if(color_index >= (len(colors))-1):
    color_index=0
  else:
    color_index +=1
  jameson.down()
  jameson.left(90)
  radius += 5
  if(color_index >= (len(colors))-1):
    color_index=0
  else:
    color_index +=1
radius = 10
for i in range(40):
  larson.color("orange")
  larson.circle(radius)
  larson.up()
  larson.right(90)
  larson.forward(5)
  larson.down()
  larson.left(90)
  radius += 5

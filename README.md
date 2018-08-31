# sfsfs
Science-Fiction Spaceship Flight-Simulator

## THE DREAM:

Do you remember your favourite SF series in TV? Did you like a SF movie? Did you enjoy the design of the spaceships? Did you ever wonder how to fly one? This experiment is an attempt do let you create and fly spaceships.

The 3D framework A-Frame is used, which works with ThreeJS which uses WebGL to show and animate a 3D world in a browser page.

* Create ships by A-Frame syntax or use models build by other tools like Blender
* Define the flight behaviour by provided A-Frame Components or write your own in JavaScript
* Mix it together to a virtual world and start flying.

## THE REALITY:

Two ships on an tiled ground below starts and new A-Frame controls. The spheric ship is from a German SF series Perry Rhodan: A smal "Kugelraumer" 50m diameter. The spiking disk is from the German TV SF series Raumpatrouille, the Fast Space Cruiser ORION.

[Demo](http://ac1000.de/sfsfs/index.html) & [Source](index.html)


![Spaceship](https://mastodonten.de/system/media_attachments/files/000/198/731/original/a4079fb5795bd598.png)


The speric ship above it is build, also using an A-Frame component "a-multiply".
This control takes a-entities, multiplies them and places the instances increasingly y-rotated.
This allows complex structures by less work and HTML text.

[a-multiply](/components/a-multiply)

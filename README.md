# sfsfs
Science-Fiction Spaceship Flight-Simulator

## THE DREAM:

Do you remember your favourite SF series in TV? Did you like a SF movie? Did you enjoy the design of the spaceships? Did you ever wonder how to fly one? This experiment is an attempt do let you create and fly spaceships.

The 3D framework A-Frame is used, which works with ThreeJS which uses WebGL to show and animate a 3D world in a browser page.

* Create ships by A-Frame syntax or use models build by other tools like Blender
* Define the flight behaviour by provided A-Frame Components or write your own in JavaScript
* Mix it together to a virtual world and start flying.

## THE REALITY:

One ship on an empty ground and default A-Frame controls. The is from a German SF series Perry Rhodan: A smal "Kugelraumer" 50m diameter.

[Demo](http://www.ac1000.de/s/demo/1), [Source](https://github.com/DerKarlos/sfsfs/blob/master/index.html)


![Spaceship](https://storage.gra3.cloud.ovh.net/v1/AUTH_91eb37814936490c95da7b85993cc2ff/enosmtown/media_attachments/files/000/000/512/original/cd4be8f6233a27df.png)


That ship above it is build, also using an A-Frame Component "rotation-y" and sonn with "a-multiply".
This control takes an a-entity, multiplies it and places the instances increasingly y-rotated.
This allows complex structures by less work and HTML text.

[a-multiply](/components/a-multiply)



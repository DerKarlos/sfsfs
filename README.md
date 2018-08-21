# sfsfs
Science-Fiction Spaceship Flight-Simulator

## THE DREAM:

Do you remember your favorit SF series in TV? Did you like a SF movy? Did you enyoy the design of the spaceships? Did you ever wonder how to fly one? This experiment is an atempt do let you greate and fly spaceships.

The 3D framework A-Frame is used, which works with ThreeJS which uses WebGL to show and animate a 3D world in a browser page.

* Create ships by A-Frame syntax or use models build by other tools like Blender
* Define the flight behavior by provided A-Frame Components or write your own in JavaScript
* Mix it togther to a virtual world and start fying.

## THE REALITY:

One ship on an empty ground and default A-Frame controls: www.ac1000.de/s/demo/1
The is from a German SF series Perry Rhodan: A smal "Kugelraumer" 50m diameter.

![Spaceship](https://storage.gra3.cloud.ovh.net/v1/AUTH_91eb37814936490c95da7b85993cc2ff/enosmtown/media_attachments/files/000/000/512/original/cd4be8f6233a27df.png)


## AFRAME-ROTATE-Y

That ship abowe it is build, also using a new A-Frame Component "aframe-rotation-y". This control takes an a-entity, multiplies it and places one rotated by angle steps. Tis alowes complex struxtures by less work and text.

![example](http://ac1000.de//s/demo/2/example.png)


### Properties

| Property | Description                                             | Default Value |
| -------- | -----------                                             | ------------- |
| start    | Angle the first entity is rotated.                      | 0             |
| step     | Angle each of the next entities is increased.           | 30            |
| end      | Maximal used angle. Istancing will stop afterwards.     | 360           |
| mixin    | a-frame mixin, containing the template of the entity.   | ''            |
| mixin2   | a-frame mixin, optioinally containing another entity.   | ''            |
| mixin3   | a-frame mixin, optioinally containing another entity.   | ''            |
| mixin4   | a-frame mixin, optioinally containing another entity.   | ''            |



### Usage

First define the template entity then place instances in a circle:

```html
    <a-mixin id="bluebox" geometry="primitive:box" material="color:blue" position="4 0 0" ></a-mixin>
    <a-entity rotate-y="step:27.0; end:270; mixin:bluebox" position="0 0 -8"></a-entity>
```

Up to for entities may be placed at any angle between start and end by step.

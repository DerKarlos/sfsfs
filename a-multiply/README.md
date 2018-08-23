## A-MULTIPLY

<i>This componet replaces the previous used "rotate-y"</i>

Some space ships are build with a-frame entities, also using this A-Frame Component "a-multiply".

This control takes its sub-entities, multiplies them and places the copies as given by parameter "mode".
* The mode "rotatory" places the copies in a cycle. More modes TODO
* The position angles go from parameter "start" to "end" by "step".
* The rotation axis is given by the parameter "axis" TODO
* As radius, the value of sub-entities position is used. Select the axis by parameter "radius". TODO
* The copies are rotated so the same child-side shows to the center of the cycle. (TODO: optinally)
This allows complex structures by less work and HTML text.


### Properties

| Property | Description                                             | Default Value |
| -------- | -----------                                             | ------------- |
| mode     | How to place the copies: rotatory, TODO                 | rotatory      |
| axis     | Modes: rotatory. What axis to rotate around.            | y             |
| radius   | Modes: rotatory. What position axis to set the radius   | x             |
| step     | Angle each of the next entities is increased.           | 30            |
| end      | Maximal used angle. Instancing will stop afterwards.    | 360           |

### Usage

TODO Use <a-multiply> like <a.entity> as a "parent" and place "childs" to be multiplied.
Any type of childs should work (a-box, geometry:box, mixin)
Each of the "childs" will 



```html
    TODO <a-mixin id="bluebox" geometry="primitive:box" material="color:blue" position="4 0 0" ></a-mixin>
    <a-entity rotate-y="step:27.0; end:270; mixin:bluebox" position="0 0 -8"></a-entity>
```

[Demo](http://www.ac1000.de/s/demo/3), [Source](https://github.com/DerKarlos/sfsfs/blob/master/a-multiply/a-multiply.js)

![example](http://ac1000.de//s/demo/3/example.png)

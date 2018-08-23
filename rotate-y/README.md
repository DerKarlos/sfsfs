## ROTATE-Y

Some space ships are build with a-frame entities, also using this A-Frame Component "rotation-y".
This control takes an a-entity, multiplies it and places the instances increasingly y-rotated.
To place them in a cycle, the entity should be positiont of the center.
The angles go from "start" to "end" by "step".
Up to for entities, given as "mixin" may be placed at each angle.
This allows complex structures by less work and HTML text.
This is not the final solution. The usage is not plain and not recrusive usable.


### Properties

| Property | Description                                             | Default Value |
| -------- | -----------                                             | ------------- |
| start    | Angle the first entity is rotated.                      | 0             |
| step     | Angle each of the next entities is increased.           | 30            |
| end      | Maximal used angle. Instancing will stop afterwards.    | 360           |
| mixin    | a-frame mixin, containing the template of the entity.   | ''            |
| mixin2   | a-frame mixin, optionally containing another entity.    | ''            |
| mixin3   | a-frame mixin, optionally containing another entity.    | ''            |
| mixin4   | a-frame mixin, optionally containing another entity.    | ''            |

### Usage

First define the template entity then place instances in a circle:

```html
    <a-mixin id="bluebox" geometry="primitive:box" material="color:blue" position="4 0 0" ></a-mixin>
    <a-entity rotate-y="step:27.0; end:270; mixin:bluebox" position="0 0 -8"></a-entity>
```

[Demo](http://www.ac1000.de/s/demo/2), [Source](https://github.com/DerKarlos/sfsfs/blob/master/rotate-y.js)

![example](http://ac1000.de//s/demo/2/example.png)

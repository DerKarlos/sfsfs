Now to clone in A-Frame?

Notes, I found:

In https://www.npmjs.com/package/aframe-entity-generator-component
Works with https://www.npmjs.com/package/aframe-randomizer-components
The main idea I used: It takes a parameter mixin as entity
and instantiates it multible times with tiferent attributes.


In https://www.npmjs.com/package/aframe-template-component
This looks like the solution of all my needs.
It is not a complex syntax but it also is NOT a-frame syntax
It seems to change the html by exchanging an extra syntax by entity instanzen, exactly what I am looking for
And it is a lot of code.
I should find out HOW the instantiation works and wether it works for complex threes of entities
I could try to change it to an a-frame syntax. If this is possible at all.


In https://samsunginter.net/a-frame-components/
dist/clone.js
Component for cloning another entitiy’s object3D into this entity.
<script src="https://samsunginternet.github.io/a-frame-components/dist/clone.js"></script>
<a-entity id="clone-me" geometry="primitive: cylinder; height: 0.5; radius: 1.3" rotation="-90 0 0" material="color: grey;"></a-entity>
<a-entity clone="clone-me" position="2 0 0"></a-entity> <!-- Duplicate object moved 2 units across -->
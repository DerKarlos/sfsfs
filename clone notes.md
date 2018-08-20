Now to clone in A-Frame?

Notes, I found:

In https://samsunginter.net/a-frame-components/

dist/clone.js
Component for cloning another entitiy’s object3D into this entity.
<script src="https://samsunginternet.github.io/a-frame-components/dist/clone.js"></script>
<a-entity id="clone-me" geometry="primitive: cylinder; height: 0.5; radius: 1.3" rotation="-90 0 0" material="color: grey;"></a-entity>
<a-entity clone="clone-me" position="2 0 0"></a-entity> <!-- Duplicate object moved 2 units across -->

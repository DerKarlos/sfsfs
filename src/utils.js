
class Updater {
    constructor() {
        this._items = [];
    }

    add(item) {
        this._items.push(item);
    }

    update(dt) {

        this._items.forEach((item, i) => {
            item.update(dt);  // ,this.mode,camera,supportsVR
        });

    }
}

export var updater = new Updater();

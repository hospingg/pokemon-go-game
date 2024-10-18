import { Character } from './character.js';

export class Pokemon {
    constructor(name, defaultHP, elHP, elProgressbar, characterImg, characterSrc, titleEl) {
        this.character = new Character(name, defaultHP, elHP, elProgressbar, characterImg, characterSrc, titleEl);
    }

    getCharacter() {
        return this.character;
    }
}

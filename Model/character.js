import { messageBar } from './DOM.js';

export class Character {
    constructor(name, defaultHP, elHP, elProgressbar, characterImg, characterSrc, titleEl) {
        this.name = name;
        this.defaultHP = defaultHP;
        this.currentHP = defaultHP;
        this.elHP = elHP;
        this.elProgressbar = elProgressbar;
        this.characterSrc = characterSrc;
        this.characterImg = characterImg;
        this.titleEl = titleEl;
    }

    updateHP(damage) {
        this.currentHP = Math.max(this.currentHP - damage, 0);
        this.renderHP();
    }
    renderCharacter(){
        this.titleEl.innerText = this.name;
        this.characterImg.src = this.characterSrc;
        this.renderHP();
    }

    renderHP() {
        const { currentHP, defaultHP, elHP } = this;
        elHP.innerText = `${currentHP} / ${defaultHP}`;
        this.updateProgressbar();
    }

    updateProgressbar() {
        const { currentHP, defaultHP, elProgressbar } = this;
        const percentage = (currentHP / defaultHP) * 100;
        elProgressbar.style.width = `${percentage}%`;

        elProgressbar.classList.remove('low', 'critical');
        if (percentage <= 50) elProgressbar.classList.add('low');
        if (percentage <= 20) elProgressbar.classList.add('critical');
    }

    isAlive() {
        return this.currentHP > 0;
    }

    attack(damage, defender) {
        this.addMessage(`${this.name} наносить ${damage} шкоди ${defender.name}.`);
        defender.updateHP(damage);
    }

    autoAttack(defender, damage) {
        if (this.isAlive() && defender.isAlive()) {
            this.attack(damage, defender);
        }
    }

    addMessage(messageText) {
        const message = document.createElement('span');
        message.innerText = messageText;
        messageBar.prepend(message);

        if (messageBar.children.length > 3) {
            messageBar.lastChild.remove();
        }
    }
}

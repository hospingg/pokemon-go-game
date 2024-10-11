class Character {
    constructor(name, defaultHP, elHP, elProgressbar) {
        this.name = name;
        this.defaultHP = defaultHP;
        this.currentHP = defaultHP;
        this.elHP = elHP;
        this.elProgressbar = elProgressbar;
    }

    updateHP(damage) {
        this.currentHP = Math.max(this.currentHP - damage, 0);
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
        if (percentage <= 50) {
            elProgressbar.classList.add('low');
        }
        if (percentage <= 20) {
            elProgressbar.classList.add('critical');
        }
    }

    isAlive() {
        return this.currentHP > 0;
    }

    attack(damage, defender, type) {
        const { currentHP: attackerHP, name: attackerName } = this;
        const { currentHP: defenderHP, name: defenderName } = defender;

        let messageText = `${attackerName} наніс ${damage} шкоди ${defenderName}. Залишилось HP у ${defenderName}: ${Math.max(defenderHP - damage, 0)}. HP у ${attackerName}: ${attackerHP}`;
        this.addMessage(messageText, true);

        defender.updateHP(damage);

        if (!defender.isAlive()) {
            messageText = `${defenderName} програв бій!`;
            this.addMessage(messageText);
            disableButtons();
            showResultMessage(defender.name === 'Charmander' ? 'Перемога!' : 'Програш!');
        }
    }

    autoAttack(defender) {
        if (this.isAlive() && defender.isAlive()) {
            const damage = random(20);
            this.attack(damage, defender, 'common');
        }
    }

    addMessage(messageText, isLog = false) {
        const message = document.createElement('span');
        message.innerText = messageText;

        if (isLog) {
            messageBar.prepend(message);
        } else {
            messageBar.append(message);  
        }

        const messagesArr = document.querySelectorAll('#message-bar > *');
        if (messagesArr.length > 3) {
            messagesArr[messagesArr.length - 1].remove();  
        }
    }
}

function random(num) {
    return Math.ceil(Math.random() * num);
}

function disableButtons() {
    $btnKick.disabled = true;
    $btnSpecialKick.disabled = true;
}

function showResultMessage(resultText) {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('result-message');

    const resultParagraph = document.createElement('p');
    resultParagraph.classList.add('result');
    resultParagraph.innerText = resultText;

    resultContainer.appendChild(resultParagraph);
    document.body.appendChild(resultContainer);
}

const messageBar = document.querySelector('#message-bar');
const $btnKick = document.getElementById('btn-kick');
const $btnSpecialKick = document.getElementById('btn-special-kick');

const character = new Character('Pikachu', 100, document.getElementById('health-character'), document.getElementById('progressbar-character'));
const enemy = new Character('Charmander', 100, document.getElementById('health-enemy'), document.getElementById('progressbar-enemy'));

$btnKick.addEventListener('click', function () {
    character.attack(random(20), enemy, 'common');
    $btnKick.disabled = true;
    $btnSpecialKick.disabled = true;

    setTimeout(() => {
        enemy.autoAttack(character);
        $btnKick.disabled = false;
        $btnSpecialKick.disabled = false;
    }, 1000);
});

$btnSpecialKick.addEventListener('click', function () {
    character.attack(random(40), enemy, 'special');
    $btnKick.disabled = true;
    $btnSpecialKick.disabled = true;

    setTimeout(() => {
        enemy.autoAttack(character);
        $btnKick.disabled = false;
        $btnSpecialKick.disabled = false;
    }, 1000);
});

character.renderHP();
enemy.renderHP();

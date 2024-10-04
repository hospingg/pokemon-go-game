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
        this.elHP.innerText = `${this.currentHP} / ${this.defaultHP}`;
        this.updateProgressbar();
    }

    updateProgressbar() {
        const percentage = (this.currentHP / this.defaultHP) * 100;
        this.elProgressbar.style.width = percentage + '%';
        
        if (percentage > 50) {
            this.elProgressbar.classList.remove('low', 'critical');
        } else if (percentage > 20) {
            this.elProgressbar.classList.add('low');
        } else {
            this.elProgressbar.classList.add('critical');
        }
    }

    isAlive() {
        return this.currentHP > 0;
    }

    attack(damage, defender, type) {
        const messagesArr = document.querySelectorAll('#message-bar > *');
        if (messagesArr.length > 2) {
            messagesArr[0].remove();
        }

        let messageText;

        if (type === 'special') {
            const attackerDamage = random(damage / 2);
            messageText = `${this.name} атакує спеціальною атакою на ${damage} балів`;
            this.updateHP(attackerDamage);
        } else {
            messageText = `${this.name} атакує звичайною атакою на ${damage} балів`;
        }

        defender.updateHP(damage);

        if (!defender.isAlive()) {
            messageText = `${defender.name} програв бій!`;
            disableButtons();

            showResultMessage(defender.name === 'Charmander' ? 'Перемога!' : 'Програш!');
        }

        addMessage(messageText);
    }

    autoAttack(defender) {
        if (this.isAlive() && defender.isAlive()) {
            const damage = random(20);
            this.attack(damage, defender, 'common');
        }
    }
}

// Функція для додавання повідомлень
function addMessage(messageText) {
    const message = document.createElement('span');
    message.innerText = messageText;
    messageBar.append(message);
}

// Функція для рандомного значення
function random(num) {
    return Math.ceil(Math.random() * num);
}

// Функція для вимикання кнопок
function disableButtons() {
    $btnKick.disabled = true;
    $btnSpecialKick.disabled = true;
}

// Функція для відображення результату матчу
function showResultMessage(resultText) {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('result-message');

    const resultParagraph = document.createElement('p');
    resultParagraph.classList.add('result');
    resultParagraph.innerText = resultText;

    resultContainer.appendChild(resultParagraph);
    document.body.appendChild(resultContainer);
}

// Елементи
const messageBar = document.querySelector('#message-bar');
const $btnKick = document.getElementById('btn-kick');
const $btnSpecialKick = document.getElementById('btn-special-kick');

// Створення об'єктів персонажів
const character = new Character('Pikachu', 100, document.getElementById('health-character'), document.getElementById('progressbar-character'));
const enemy = new Character('Charmander', 100, document.getElementById('health-enemy'), document.getElementById('progressbar-enemy'));

// Обробники подій для кнопок
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

// Початкова ініціалізація
character.renderHP();
enemy.renderHP();

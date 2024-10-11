const logs = [
    ['згадав щось важливе, але несподівано', "не пам'ятаючи себе від переляку, вдарив у передпліччя ворога."],
    ["поперхнувся, і за це", "з переляку приклав прямий удар коліном у лоб ворога."],
    ["забувся, але в цей час нахабний ", ", прийнявши вольове рішення, нечутно підійшовши ззаду, вдарив."],
    ["прийшов до тями, але несподівано ", " випадково завдав потужного удару."],
    ["поперхнувся, але в цей час ", " неохоче розтрощив кулаком \"вирізано цензурою\> супротивника."],
    ["здивувався, а ", " похитнувшись вліпив підлий удар."],
    ["висморкався, але несподівано ", " провів удар, що дробить."],
    ["похитнувся, і раптово нахабний ", " так ударив у ногу противника"],
    ["засмутився, як раптом, несподівано ", " випадково вліпив стопою в живіт суперника."],
    ["намагався щось сказати, але раптом, несподівано ", " з нудьги, розбив брову супернику."]
];
let attackCounter = 0;

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

        if(attackCounter == logs.length){
            attackCounter = 0;
        }
        let messageText = ` ${defenderName} ${logs[attackCounter][0]} ${attackerName} ${logs[attackCounter][1]} Нанесено  ${damage} шкоди`;
        this.addMessage(messageText, true);

        defender.updateHP(damage);
        
        ++attackCounter;
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

        const messagesArr = [...document.querySelectorAll('#message-bar > *')];
        if (messagesArr.length > 3) {
            messagesArr[messagesArr.length - 1].remove();  
        }
    }
}


function random(num) {
    return Math.ceil(Math.random() * num);
}

function disableButtons() {
    $btnKick.classList.add('disabled'); 
    $btnSpecialKick.classList.add('disabled'); 
}

function enableButtons() {
    $btnKick.classList.remove('disabled'); 
    $btnSpecialKick.classList.remove('disabled'); 
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
    disableButtons()

    setTimeout(() => {
        enemy.autoAttack(character);
        enableButtons()
    }, 1000);
});

$btnSpecialKick.addEventListener('click', function () {
    character.attack(random(40), enemy, 'special');
    disableButtons();

    setTimeout(() => {
        enemy.autoAttack(character);
        enableButtons();
    }, 1000);
});

character.renderHP();
enemy.renderHP();


const createClickCounter = (button, limit) => {
    let count = 0;
    return () => {
        if (count < limit) {
            count++;
            console.log(`Кнопка натиснута ${count} разів`);
        }

        if (count >= limit) {
            button.disabled = true;
            console.log('Ліміт натискань досягнуто');
        }
    };
};


const button1ClickCounter = createClickCounter($btnKick, 6);
const button2ClickCounter = createClickCounter($btnSpecialKick, 3);

// Додаємо обробники подій для кнопок
$btnKick.addEventListener('click', button1ClickCounter);
$btnSpecialKick.addEventListener('click', button2ClickCounter);

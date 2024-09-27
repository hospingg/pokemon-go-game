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
}

const messageBar = document.querySelector('#message-bar')
console.log(messageBar)

const $btnKick = document.getElementById('btn-kick');
const $btnSpecialKick = document.getElementById('btn-special-kick');

const character = new Character('Pikachu', 100, document.getElementById('health-character'), document.getElementById('progressbar-character'));
const enemy = new Character('Charmander', 100, document.getElementById('health-enemy'), document.getElementById('progressbar-enemy'));

$btnKick.addEventListener('click', function () {
    attack(random(20), character, enemy, 'common');
});

$btnSpecialKick.addEventListener('click', function () {
    attack(random(40), character, enemy, 'special');
});

function attack(damage, attacker, defender, type) {

    const messagesArr = document.querySelectorAll('#message-bar > *');
    if (messagesArr.length>2){
        messagesArr[0].remove()
    }
    
    let messageText;

    if(type === 'special'){
        attackerDamage = random(damage/2); 
        messageText = `${attacker.name} атакує спеціальною атакою на ${damage} балів`
        attacker.updateHP(attackerDamage)
    }
    
    else if(type === 'common'){
        messageText = `${attacker.name} атакує звичайною атакою на ${damage} балів`
    }
    defender.updateHP(damage);
    

    if (!defender.isAlive()) {
        messageText = `${defender.name} програв бій!`;
        disableButtons();
    }
    addMessage(messageText);
}

function random(num) {
    return Math.ceil(Math.random() * num);
}

function disableButtons() {
    $btnKick.disabled = true;
    $btnSpecialKick.disabled = true;
}
function addMessage(messageText){
    const message = document.createElement('span');
    message.innerText = messageText;
    messageBar.append(message)
}

// Початкова ініціалізація
character.renderHP();
enemy.renderHP();
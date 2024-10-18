import { pokemons } from './pokemons.js';
import { Pokemon } from './Model/pokemon.js';
import { random } from './utils/random.js';
import { disableButtons, enableButtons, showResultMessage,  createAttackButtons } from './Model/DOM.js';

const playerPokemon = pokemons[random(5)]; 
const enemyPokemon = pokemons[random(5)]; 

const hero = new Pokemon(
    playerPokemon.name, 
    playerPokemon.hp, 
    document.getElementById('health-character'), 
    document.getElementById('progressbar-character'),
    document.querySelector('img.sprite#hero'),
    playerPokemon.img,
    document.querySelector('#name-character')
    );
const enemy = new Pokemon(
    enemyPokemon.name, 
    enemyPokemon.hp, 
    document.getElementById('health-enemy'), 
    document.getElementById('progressbar-enemy'),
    document.querySelector('img.sprite#enemy'),
    enemyPokemon.img,
    document.querySelector('#name-enemy')
);

const playerAttackContainer = document.querySelector('.control');
const enemyAttackContainer = document.querySelector('.control.enemy');

createAttackButtons(playerPokemon, playerAttackContainer, (attack) => {
    handlePlayerAttack(attack);
});

createAttackButtons(enemyPokemon, enemyAttackContainer, (attack) => {
    handleEnemyAttack(attack);
});

function findButtonByText(container, text) {
    const buttons = container.querySelectorAll('button');
    return Array.from(buttons).find(button => button.id.includes(text));
}

function handlePlayerAttack(attack) {
    const damage = random(attack.maxDamage - attack.minDamage) + attack.minDamage;
    hero.getCharacter().attack(damage, enemy.getCharacter());
    disableButtons(playerAttackContainer);

    attack.countLimit--;

    if (attack.countLimit <= 0) {
        const button = findButtonByText(playerAttackContainer, attack.name);
        button.classList.add('limit')
        console.log(`Ліміт натискань кнопки ${button.innerText} досягнуто`)
        if (button) {
            button.disabled = true;
            button.classList.add('disabled');
        }
    }

    setTimeout(() => {
        enableButtons(enemyAttackContainer);
    }, 1000);

    checkIfAlive(enemy.getCharacter());
}

function handleEnemyAttack(attack) {
    const damage = random(attack.maxDamage - attack.minDamage) + attack.minDamage;
    enemy.getCharacter().attack(damage, hero.getCharacter());
    disableButtons(enemyAttackContainer);

    attack.countLimit--;

    if (attack.countLimit <= 0) {
        const button = findButtonByText(enemyAttackContainer, attack.name);
        button.classList.add('limit')
        console.log(`Ліміт натискань кнопки ${button.innerText} досягнуто`)
        if (button) {
            button.disabled = true;
            button.classList.add('disabled');
        }
    }

    setTimeout(() => {
        enableButtons(playerAttackContainer);
    }, 1000);

    checkIfAlive(hero.getCharacter());
}


function checkIfAlive(defender) {
    if (!defender.isAlive()) {
        defender.addMessage(`${defender.name} програв бій!`);
        disableButtons(playerAttackContainer);
        disableButtons(enemyAttackContainer);
        showResultMessage(defender.name === enemy.getCharacter().name ? 'Перемога!' : 'Програш!');
    }
}

hero.getCharacter().renderCharacter();
enemy.getCharacter().renderCharacter();

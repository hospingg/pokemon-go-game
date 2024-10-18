export const messageBar = document.querySelector('#message-bar');

export function disableButtons(container) {
    const buttons = container.querySelectorAll('.button');
    buttons.forEach(button => {
        
        button.classList.add('disabled');
        button.disabled = true;
    });
}

export function enableButtons(container) {
    const buttons = container.querySelectorAll('.button');
    buttons.forEach(button => {
        if(button.classList.contains('limit')){
            return 0
        }
        button.classList.remove('disabled');
        button.disabled = false;
    });
}

export function showResultMessage(resultText) {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('result-message');

    const resultParagraph = document.createElement('p');
    resultParagraph.classList.add('result');
    resultParagraph.innerText = resultText;

    resultContainer.appendChild(resultParagraph);
    document.body.appendChild(resultContainer);

    setTimeout(() => {
        resultContainer.remove();
    }, 3000);
}

export function createAttackButtons(pokemon, container, onClick) {
    pokemon.attacks.forEach(attack => {
        const btn = document.createElement('button');
        btn.classList.add('button');
        btn.id = attack.name
        btn.innerText = `${attack.name} (${attack.minDamage}-${attack.maxDamage})`;
        btn.addEventListener('click', () => onClick(attack));
        container.appendChild(btn);
    });
}

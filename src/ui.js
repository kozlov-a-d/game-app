export default class UI {
    constructor() {
        this.root = this.createLayoutElement('layout');
        this.layout = {};
        this.layout.score = this.createLayoutElement('layout__score');
        this.layout.ammo = this.createLayoutElement('layout__ammo');
    }

    createLayoutElement(className, parent) {
        let element = document.createElement('div');
        element.classList.add(className);

        parent = parent ? parent : document.querySelector('body');
        parent.appendChild(element);

        return element;
    }

    update(game){
        this.layout.score.innerText = 'score: ' + game.player.score;
        this.layout.ammo.innerText = game.player.currentWeapons.ammoType + ': ' +  game.player.currentWeapons.magazine.amount + '/' + game.player.ammo[game.player.currentWeapons.ammoType];
        
    }

}
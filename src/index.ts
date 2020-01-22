import Game from './game';
import TestModelAnimations from './tests/model-animations';

// const gameNode = document.getElementById('game');
// new Game(gameNode);

// отдельный файл, где тестить создание нескольких боди

const gameNode = document.getElementById('game');
new TestModelAnimations(gameNode);

// тестовая сцена, для просмотра и блендинга анимаций и направлений

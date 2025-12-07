import {store} from './store.js';
import { randomHsl} from './utils.js';
// elementy UI
    const addSquareBtn = document.getElementById('addSquare');
    const addCircleBtn = document.getElementById('addCircle');
    const recolorSquaresBtn = document.getElementById('recolorSquares');
    const recolorCirclesBtn = document.getElementById('recolorCircles');
    const cntSquaresEl = document.getElementById('cntSquares');
    const cntCirclesEl = document.getElementById('cntCircles');
    const board = document.querySelector('#board');
    /*
    // liczniki (oddzielne)
    let squaresCount = 0;
    let circlesCount = 0;
    // mała funkcja aktualizująca liczniki na UI
    function updateCounters() {
      cntSquaresEl.textContent = squaresCount;
      cntCirclesEl.textContent = circlesCount;
    }*/
   store.subscribe( (counter) => {
     cntSquaresEl.textContent = counter[0];
     cntCirclesEl.textContent = counter[1];
   } );

    // ŻYWA kolekcja kółek (HTMLCollection) — pobieramy raz i używamy 
    const circlesLive = board.getElementsByClassName('circle');

    
    addSquareBtn.addEventListener('click', () => {
      const s = document.createElement('div');

      const shape = store.addShape('square');

      s.className = 'shape '+ shape.type;
      s.style.backgroundColor = shape.color;
      s.dataset.id = shape.id; 
    
      board.appendChild(s);
    });

    // KÓŁKO: dodawane BEZ indywidualnych listenerów, delegacja na board
    addCircleBtn.addEventListener('click', () => {
      const c = document.createElement('div');

      const shape = store.addShape('circle');

      c.className = 'shape ' + shape.type;
      c.style.backgroundColor = shape.color;
      c.dataset.id = shape.id; // atrybut data-id do identyfikacji

      board.appendChild(c); // circlesLive samo się zaktualizuje!
      //circlesCount++;
      //updateCounters();
    });
    
    // Delegacja: jeden listener na 'board' obsługuje kliki w kółka
      board.addEventListener('click', (e) => {
        if(!e.target.classList.contains('shape')) return;
        const id = e.target.dataset.id;
        store.deleteShape(id);
        e.target.remove();
        });

    // Przekolorowywanie kwadratów (NodeList ze querySelectorAll)
    recolorSquaresBtn.addEventListener('click', () => {
      // wyszukujemy istniejące w tym momencie kwadraty
      const squaresSnapshot = board.querySelectorAll('.square');
      squaresSnapshot.forEach(
        (el) => (el.style.backgroundColor = randomHsl())
      );
    });

    // Przekolorowywanie kółek (HTMLCollection - żywa kolekcja)
    recolorCirclesBtn.addEventListener('click', () => {
      // circlesLive to żywa kolekcja — nie trzeba niczego wyszukiwać
      for (const el of circlesLive) {
        el.style.backgroundColor = randomHsl();
      }
    });

    // Dodatkowo przykład pobieranie przy pomocy getElementsByTagName
    const allButtons = document.getElementsByTagName('button');
    for (const b of allButtons) {
      b.addEventListener('mouseenter', () => (b.style.opacity = '0.7'));
      b.addEventListener('mouseleave', () => (b.style.opacity = '1'));
    }
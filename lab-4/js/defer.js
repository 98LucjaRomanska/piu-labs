//elementy UI
const addcardTDbtn = document.getElementById('addcardTD');
const addcardITMbtn = document.getElementById('addcardITM');
const addcardDNbtn = document.getElementById('addcardDN');

const boards = document.querySelectorAll('.board');

const countTDbtn = document.getElementById('countTD');
const countITMbtn = document.getElementById('countITM');
const countDNbtn = document.getElementById('countDN');

const colorcardTDbtn = document.getElementById('colorcardTD');
const colorcardITMbtn = document.getElementById('colorcardITM');
const colorcardDNbtn = document.getElementById('colorcardDN');

/*lista boards */

//liczniki
let firstCounter = 0;
let secondCounter = 0;
let thirdCounter = 0;
//losowy kolor HSL
function randomHsl() {
    return `hsl(${Math.random()*360}, 60%, 80%)`;
}
//funkcja aktualizująca liczniki
function updateCounters() {
    countTDbtn.textContent = boards[0].querySelectorAll('.card').length;
    countITMbtn.textContent = boards[1].querySelectorAll('.card').length;
    countDNbtn.textContent = boards[2].querySelectorAll('.card').length;
    
}

function moveRight(card) {
    const thisBoard = card.parentElement; //boards to typ NodeList --> trzeba skonwertować do array
    const array = Array.from(boards); //tablica elementów NodeList
    const index = array.indexOf(thisBoard); //NodeList nie ma funkcji indexOf

    if (index < boards.length - 1) {
        boards[index].removeChild(card);//==card.remove() w obrębie danego boarda
        boards[index+1].appendChild(card);
        updateCounters();
    }
    saveBoard();
    
}
function moveLeft(card) {
    const thisBoard = card.parentElement;
    const array = Array.from(boards);
    const index = array.indexOf(thisBoard);
    if (index > 0) {
        boards[index].removeChild(card);//==card.remove() w obrębie danego boarda
        boards[index-1].appendChild(card);
        updateCounters();
    }
    saveBoard();
}

function saveBoard() { //zapisanie danych
    const data = {}; //obiekt JSON 
    document.querySelectorAll('.board').forEach( panel=> {
        const boardName = panel.dataset.board;
        const cards = panel.querySelectorAll('.card'); 
        data[boardName] = [...cards].map((c)=> ({  //map iterates over each element in that array
            id: c.dataset.id, 
            context: c.querySelector('.edit-text').textContent.trim(),
            color: c.style.backgroundColor,
        }));
    });
    localStorage.setItem('kanbanContext', JSON.stringify(data));
}
function loadBoard() {
    const retrieved = localStorage.getItem('kanbanContext');
    if (!retrieved) return; 

    const data = JSON.parse(retrieved);
    
    document.querySelectorAll('.board').forEach( (el,i)  => {
        const boardName = el.dataset.board;
        const cards = data[boardName] || []; //jeśli istnieje to P jeśli nie to L
        cards.forEach(cardData => CreateCard(i,cardData));
    });
    updateCounters();
}
//dodawanie nowych i odtwarzanie istniejących .card
function CreateCard(boardIndex, cardData = null) {
    const c = document.createElement('div');
    c.className='card';
    c.dataset.id = cardData?.id ||`${Date.now()}`;
    c.style.backgroundColor =  cardData?.color ||randomHsl();

    //zamykanie karty 'x'
    const x = document.createElement('span');
    x.className = 'x';
    x.textContent = 'X';
    x.addEventListener('click', (e) =>{
        c.remove();
        updateCounters();
        saveBoard();
    });
    //zmiana koloru pojedynczej karty
    const color =  document.createElement('span');
    color.className = 'color-card';
    color.textContent = '\u{1F323}'; //\u{1F506}
    color.addEventListener('click', (e) =>{
        c.style.backgroundColor = randomHsl();
        saveBoard();
    })
    //←
    const lewo = document.createElement('span');
    lewo.className ='lewo';
    lewo.textContent='←';
    //footer.appendChild(lewo);
    
    lewo.addEventListener('click', () => { moveLeft(c)});
    //→
    const prawo = document.createElement('span');
    prawo.className ='prawo';
    prawo.textContent='→';
    //footer.appendChild(prawo);

    prawo.addEventListener('click', () => moveRight(c));
    //.appendChild(footer); 
    
    //dodawanie header (.x) do board
    const header = document.createElement('div');
    header.className ='header-card';
    header.appendChild(lewo);
    header.appendChild(prawo);
    header.appendChild(color);
    header.appendChild(x);
    
    c.appendChild(header);

    //contentEditable
    const text = document.createElement('div');
    text.className = 'edit-text';
    text.contentEditable ='true';
    c.appendChild(text);
    /*
    //footer
    const footer = document.createElement('div');
    footer.className ='footer-card'; */
    /*
    //←
    const lewo = document.createElement('span');
    lewo.className ='lewo';
    lewo.textContent='←';
    //footer.appendChild(lewo);
    
    lewo.addEventListener('click', () => { moveLeft(c)});
    //→
    const prawo = document.createElement('span');
    prawo.className ='prawo';
    prawo.textContent='→';
    //footer.appendChild(prawo);

    prawo.addEventListener('click', () => moveRight(c));
    //.appendChild(footer); 
    */
    boards[boardIndex].appendChild(c); 
    updateCounters();
    saveBoard(); 
}


//to do
//card: dodawany z indywidualnym listenerem
addcardTDbtn.addEventListener('click', () => { 
    CreateCard(0); 
    saveBoard();
});
    

//in the middle
addcardITMbtn.addEventListener('click', () => { 
    CreateCard(1); 
    saveBoard();
});
//done
addcardDNbtn.addEventListener('click', () => { 
    CreateCard(2); 
    saveBoard();
});
colorcardTDbtn.addEventListener('click', () => {
    const board = document.querySelector('.board[data-board="toDo"]');
    const cards = board.querySelectorAll('.card');
    cards.forEach((c)=>{
        c.style.backgroundColor = randomHsl();
    });
    saveBoard();
    
});
colorcardITMbtn.addEventListener('click', () => {
    const board = document.querySelector('.board[data-board="inTheMiddle"]');
    const cards = board.querySelectorAll('.card');
    cards.forEach((c)=>{
        c.style.backgroundColor = randomHsl();
    });
    saveBoard();   
});
colorcardDNbtn.addEventListener('click', () => {
    const board = document.querySelector('.board[data-board="done"]');
    const cards = board.querySelectorAll('.card');
    cards.forEach((c)=>{
        c.style.backgroundColor = randomHsl();
    });
    saveBoard();   
});

document.addEventListener('DOMContentLoaded', loadBoard);




/*const cardsLive = board.getElemententsByClassName('card');*/
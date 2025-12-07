import {Ajax} from './ajax.js';

const getBtn = document.getElementById('getBtn');
const outputList = document.getElementById('outputList');
const errorOutput = document.getElementById('errorOutput');
const loader = document.getElementById('loader');
const getErrorBtn = document.getElementById('getErrorBtn');
const resetBtn = document.getElementById('resetBtn');

const api = new Ajax({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
});
// Funkcje pomocnicze

function setLoading(isLoading) {
    if (loader) loader.style.display = isLoading ? 'inline-block': 'none';
    getBtn.disabled = isLoading; 
    getErrorBtn.disabled = isLoading;
    //disabled - dom element Boolean property 
}
function displayError(error) {
    let message = `An error occured: ${error.message}`;
    if(error.cause)
        //sprawdzenie czy casue istnieje i jest JSON
    message += `\nDetails: ${JSON.stringify(error.cause, null,2)}`;
    errorOutput.textContent = message;
    errorOutput.style.display = 'block';
    outputList.innerHTML = '';
    console.error(error);
}
function displayData(data) {
    //errorOutput.style.display = 'none';
    errorOutput.textContent = '';
    if (!Array.isArray(data)) {
        outputList.innerHTML = '';
        const li = document.createElement('li');
        li.textContent = 'Received data is not an array' + JSON.stringify(data);
        outputList.appendChild(li);
        return;
    }
    outputList.innerHTML =''; //czyszczenie przed nową listą
    const headerLi = document.createElement('li');
    headerLi.style.cssText = 'font-weight: 400';
    headerLi.textContent = `Pobrano ${data.length} rekordów. Pierwsze ${Math.min(data.length,20)}:`;
    
    outputList.appendChild(headerLi);
    data.slice(0,20).forEach( elem => {
        const li = document.createElement('li');
        const id = String(elem.id).padEnd(5,' ');
        const name = elem.name.padEnd(50,'');
        const email = elem.email.padEnd(24,'');
        li.textContent =  `ID: ${id} name: ${name} email: ${email}`
        outputList.appendChild(li);
    });
}
function resetView() {
    outputList.innerHTML = '';
    errorOutput.textContent = '';
    /*errorOutput.style.display = 'none';*/
    setLoading(false);
}
if (getBtn) {
    getBtn.addEventListener('click', async() => {
        resetView();
        setLoading(true);
        try {
            const todos = await api.get('/users');
            //todos to tablica obiektów js
            displayData(todos);
        } catch(err) {
            displayError(err);
        } finally {
            setLoading(false);
        }
    })
}
if (getErrorBtn) {
    getErrorBtn.addEventListener('click', async() => {
        setLoading(true);
        try {
            const wrongURL = await api.get('/endpoint')
            displayData(wrongURL);
        } catch(err) {
            displayError(err);
        } finally {
            setLoading(false);
        }
    })
}
if (resetBtn) {
    resetBtn.addEventListener('click', async() => {
        setLoading(true);
        resetView();
        setLoading(false);
    })
}

import {store} from './store.js';

//subskrybujemy zmiany
store.subscribe((state) => {
    console.log('A widzi counter =', state.counter);
});
//Zmieniamy stan
store.increment();
store.increment();

//Możemy też odczytać stan licznika bezpośrednio
console.log('A bezpośrednio:', store.counter)
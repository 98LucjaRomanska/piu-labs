import { randomHsl,randomDataID } from './utils.js';
class Store {
  #counter = [0,0]; // [squares,circles]
  #subscribers = new Set();
  //#board = [];
  #board = new Map(); // id -> shape

  addShape(givenType) {
    const shape = {
      type: givenType,
      id: randomDataID(),
      color: randomHsl()
    };
    //this.#board.push(shape);
    this.#board.set(shape.id, shape);
    if(givenType === 'square'){ this.#counter[0]++; }
    if(givenType === 'circle'){ this.#counter[1]++; }

    this.#notify();
    return shape;
  }
  deleteShape(id) {
    return this.#board.delete(id); 
  };
  /*
  deleteShape(id) {
    //this.#board = this.#board.filter(shape => shape.id !== givenID);
    for (let i = 0; i < this.#board.length; i++) {

      if(this.#board[i].id === id){

        const removed = this.#board[i];
        if (removed.type === 'square') this.#counter[0]--;
        if (removed.type === 'circle') this.#counter[1]--;
        this.#board.splice(i,1); 
        this.#notify();
        return;
      }
    }
  }*/
  
  // Getter
  get counter() {
    return this.#counter;
  }


  // Subskrypcje
  subscribe(callback) {
    this.#subscribers.add(callback);
    callback(this.#counter); // natychmiastowe powiadomienie
    return () => this.#subscribers.delete(callback);
  }

  #notify() {
    for (const callback of this.#subscribers) {
      callback(this.#counter);
    }
  }
}

// eksportujemy pojedynczą instancję
export const store = new Store();
import loadTemplate from './utils/loadTemplate.js';

const template = await loadTemplate('/lab-7/components/card-element.html');

export default class CardElement extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(template.content.cloneNode(true));

    }
    
}


customElements.define('card-element', CardElement);
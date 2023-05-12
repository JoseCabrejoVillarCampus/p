import config from "../config/config.js";

import {
    GET_CLASIFICACION_ALL,
    POST_CLASIFICACION,
    DELETE_CLASIFICACION,
    PUT_CLASIFICACION,
    SEARCH_CLASIFICACION
} from '../constants/requestTypes.js';


export default class myTabla extends HTMLElement {
    static url =
        import.meta.url;

    static async components() {
        return await (await fetch(config.uri(myTabla.url))).text();
    }

    constructor() {
        super();
        this.attachShadow({
            mode: "open"
        });
        this.content(Promise.resolve(myTabla.components()).then(html => {
            this.shadowRoot.innerHTML = html;
            this.form = this.shadowRoot.querySelector("#myForm");
            this.form.addEventListener("submit", this.handleEvent.bind(this));
        }));
    }

    _shadowRoot = () => {
        let asyncContent = null;
        let content = null;
        return async (html) => {
            if (content) return content;
            if (!asyncContent) {
                asyncContent = html;
                return null;
            }
            content = await asyncContent;
            return content;
        };
    };

    content = this._shadowRoot();

    handleEvent(e) {
        e.preventDefault();
        (e.type === "submit") ? this.myworker(e): undefined;
    }

    myworker(e) {
        let ws = new Worker("../config/wsClasificacion.js", {
            type: "module"
        });
        let wsa = new Worker("../config/wsClasificacion.js", {
            type: "module"
        });
        let wsb = new Worker("../config/wsClasificacion.js", {
            type: "module"
        });
        let data = Object.fromEntries(new FormData(e.target));
        const {
            valor
        } = e.submitter.dataset;

        if (valor === "get") {
            ws.postMessage({
                type: GET_CLASIFICACION_ALL,
            });
        } else if (valor === "get2") {
            wsa.postMessage({
                type: GET_CLASIFICACION_ALL,
            });
        } else if (valor === "get3") {
            wsb.postMessage({
                type: GET_CLASIFICACION_ALL,
            })
        } else if (valor === "post") {
            ws.postMessage({
                type: POST_CLASIFICACION,
            });
        } else if (valor === "delete") {
            ws.postMessage({
                type: DELETE_CLASIFICACION,
                arg: data
            });
        } else if (valor === "put") {
            ws.postMessage({
                type: PUT_CLASIFICACION,
                arg: data
            });
        } else if (valor === "search") {
            ws.postMessage({
                type: SEARCH_CLASIFICACION,
                arg: data.id
            });
        }

        ws.addEventListener("message", (e) => {
            this.displayDataInTable(e.data);
            ws.terminate();
        });
        wsa.addEventListener("message", (e) => {
            this.displayDataInTable2(e.data);
            ws.terminate();
        });
        wsb.addEventListener("message", (e) => {
            this.displayDataInTable3(e.data);
            ws.terminate();
        });
    }

    async displayDataInTable(data) {
        try {
            await this.content()
            const tableBody = this.shadowRoot.querySelector("#myData");
            /* tableBody.innerHTML = ""; */

            if (!Array.isArray(data)) {
                throw new Error("Datos inválidos proporcionados. Se esperaba un array.");
            }

            const sortedData = data.sort((a, b) => a.id - b.id);
            console.log(data);

            let plantilla = `
            <thead>
                <tr>
                <th>Id</th>
                <th>Nombre</th>
                </tr>
            </thead>
        `;
            sortedData.forEach((user) => {
                plantilla += `
            <tr>
            <th>${user.id}</th>
            <th>${user.nombre}</th>

        </tr> 
            `;
                tableBody.innerHTML = plantilla;
            });
        } catch (error) {}
        console.log(data[0].nombre);
    }
    async displayDataInTable2(data) {
        try {
            await this.content()
            const tableBody = this.shadowRoot.querySelector("#myData");

            if (!Array.isArray(data)) {
                throw new Error("Datos inválidos proporcionados. Se esperaba un array.");
            }

            const filteredData = data.filter(user => user.nombre === "comedia");

            let plantilla = `
                <thead>
                    <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    </tr>
                </thead>
            `;

            filteredData.forEach((user) => {
                plantilla += `
                    <tr>
                    <th>${user.id}</th>
                    <th>${user.nombre}</th>
                    </tr> 
                `;
            });

            tableBody.innerHTML = plantilla;
        } catch (error) {
            console.error(error);
        }
    }
    async displayDataInTable3(data) {
        try {
            await this.content()
            const tableBody = this.shadowRoot.querySelector("#myData");
            /* tableBody.innerHTML = ""; */

            if (!Array.isArray(data)) {
                throw new Error("Datos inválidos proporcionados. Se esperaba un array.");
            }

            const filteredData1 = data.filter(user => user.id === "1");

            let plantilla = `
            <thead>
                <tr>
                <th>Id</th>
                <th>Nombre</th>
                </tr>
            </thead>
        `;


            filteredData1.forEach((user) => {
                plantilla += `
            <tr>
            <th>${user.id}</th>
            <th>${user.nombre}</th>

        </tr> 
            `;
                tableBody.innerHTML = plantilla;
            });
        } catch (error) {}

    }

    static get observedAttributes() {
        return ['data-accion'];
    }
    attributeChangedCallback(name, old, now) {
        console.log(name, old, now);
        console.log(this.dataset.accion);
    }
    connectedCallback() {
        /* const table = new myTabla();
        table.displayDataInTable(); */
        /* Promise.resolve(myTabla.components()).then((html) => {
            this.shadowRoot.innerHTML = html;
            this.form = this.shadowRoot.querySelector("#myForm");
            this.form.addEventListener("submit", this.handleEvent.bind(this));
        });

         */
    }

}
customElements.define(config.name(myTabla.url), myTabla);
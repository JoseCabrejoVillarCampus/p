import config from "../config/config.js";

import {
    GET_PELICULA_ALL,
    POST_PELICULA,
    DELETE_PELICULA,
    PUT_PELICULA,
    SEARCH_PELICULA
} from '../constants/requestTypes.js'


export default class myTabla extends HTMLElement {
    static url =
        import.meta.url
    static async components() {
        return await (await fetch(config.uri(myTabla.url))).text();
    }
    constructor() {

        super();
        this.attachShadow({
            mode: "open"

        });
        this.content(
            Promise.resolve(myTabla.components()).then(html => {
                this.shadowRoot.innerHTML = html;
                this.form = this.shadowRoot.querySelector("#myForm");
                this.form.addEventListener("submit", this.handleEvent.bind(this))
            }))
    }


    _shadowRoot = () => {
        let asyncContent = null
        let content = null
        return async (html) => {
            if (content) return content
            if (!asyncContent) {
                asyncContent = html
                return null
            }
            content = await asyncContent
            return content
        }

    }

    content = this._shadowRoot()

    handleEvent(e) {
        e.preventDefault();
        (e.type === "submit") ? this.myworker(e): undefined;
    }
    myworker(e) {
        let ws = new Worker("../config/ws.js", {
            type: "module"
        });
        let data = Object.fromEntries(new FormData(e.target));
        const {
            valor
        } = e.submitter.dataset;

        if (valor === "get") {
            ws.postMessage({
                type: GET_PELICULA_ALL,
            });
        } else if (valor === "post") {
            const callback = () => {
                ws.postMessage({
                    type: GET_PELICULA_ALL,
                });
                this.displayDataInTable(); // Llamar a displayDataInTable después del POST
            };

            ws.postMessage({
                type: POST_PELICULA,
                arg: data,
                callback: callback.toString()
            });
    } else if (valor === "delete") {
        ws.postMessage({
            type: DELETE_PELICULA,
            arg: data
        });
    } else if (valor === "put") {
        ws.postMessage({
            type: PUT_PELICULA,
            arg: data
        });
    } else if (valor === "search") {
        ws.postMessage({
            type: SEARCH_PELICULA,
            arg: data.nombre
        });
    }

    ws.addEventListener("message", (e) => {
        this.displayDataInTable(e.data);
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
        let plantilla = "";
        sortedData.forEach((user) => {
            plantilla += `
            <thead>
            <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Director</th>
                <th>Clasificacion</th>
                
            </tr>
        </thead>
            <tr>
            <th>${user.id}</th>
            <th>${user.nombre}</th>
            <th>${user.director}</th>
            <th>${user.clasificacion}</th>
        </tr> 
            `;
            /* const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = user.id;
            row.appendChild(idCell);

            const nombreCell = document.createElement("td");
            nombreCell.textContent = user.nombre || "";
            row.appendChild(nombreCell);

            const directorCell = document.createElement("td");
            directorCell.textContent = user.director || "";
            row.appendChild(directorCell);

            const clasificacionCell = document.createElement("td");
            clasificacionCell.textContent = user.clasificacion || "";
            row.appendChild(clasificacionCell);

            const deleteCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.addEventListener("submit", () => {
                ws.postMessage({
                    type: DELETE_PELICULA,
                    arg: user
                });
            });
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell); */

            /* const editCell = document.createElement("td");
            const editButton = document.createElement("button");
            editButton.textContent = "Actulizar";
            editButton.addEventListener("submit", () => {
                this.putUser(user);
            });
            editCell.appendChild(editButton);
            row.appendChild(editCell); */

            tableBody.innerHTML = plantilla;
        });
    } catch (error) {
    }

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
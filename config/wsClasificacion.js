import clasificacion from "../api/clasificacion.js";
self.addEventListener("message", (e)=>{
    let res = clasificacion[`${e.data.type}`]((e.data.arg) ? e.data.arg : undefined);
    Promise.resolve(res).then(res=>postMessage(res));
})
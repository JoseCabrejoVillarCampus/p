import pelicula from "../api/pelicula.js";
self.addEventListener("message", (e)=>{
    let res = pelicula[`${e.data.type}`]((e.data.arg) ? e.data.arg : undefined);
    Promise.resolve(res).then(res=>postMessage(res));
})
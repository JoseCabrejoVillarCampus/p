let headers = new Headers({
    "Content-Type": "application/json"
});
let puerto = 4008;

const postPeliculas = async (arg) => {
    arg.id = (arg.id) ? arg.id : Date.now();
    let config = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(arg)
    };
    return await (await fetch(`http://localhost:${puerto}/peliculas`, config)).json();
}
const getPeliculasAll = async () => {
    let config = {
        method: "GET",
        headers: headers
    };
    return await (await fetch(`http://localhost:${puerto}/peliculas`, config)).json();
}
const deletePeliculas = async (arg) => {
    let config = {
        method: "DELETE",
        headers: headers,
    };
    return await (await fetch(`http://localhost:${puerto}/peliculas/${arg.id}`, config)).json();
}
const putPeliculas = async (arg) => {
    let config = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(arg)
    };
    return await (await fetch(`http://localhost:${puerto}/peliculas/${arg.id}`, config)).json();
}
const searchPeliculas = async (arg) => {
    const response = await fetch(`http://localhost:${puerto}/peliculas`);
    const data = await response.json();

    if (response.ok) {
        const filteredData = data.filter(user => user.nombre === arg);
        return filteredData;
    } else {
        console.error("Error al obtener los usuarios del servidor.");
        return [];
    }
};
export default {
    postPeliculas,
    getPeliculasAll,
    deletePeliculas,
    putPeliculas,
    searchPeliculas,
}
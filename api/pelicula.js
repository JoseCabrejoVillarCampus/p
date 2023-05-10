let headers = new Headers({
    "Content-Type": "application/json"
});
let puerto = 4008;

const postPelicula = async (arg) => {
    arg.id = (arg.id) ? arg.id : Date.now();
    let config = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(arg)
    };
    return await (await fetch(`http://localhost:${puerto}/peliculas`, config)).json();
}
const getPeliculaAll = async () => {
    let config = {
        method: "GET",
        headers: headers
    };
    return await (await fetch(`http://localhost:${puerto}/peliculas`, config)).json();
}
const deletePelicula = async (arg) => {
    let config = {
        method: "DELETE",
        headers: headers,
    };
    return await (await fetch(`http://localhost:${puerto}/peliculas/${arg.id}`, config)).json();
}
const putPelicula = async (arg) => {
    let config = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(arg)
    };
    return await (await fetch(`http://localhost:${puerto}/peliculas/${arg.id}`, config)).json();
}
const searchPelicula = async (arg) => {
    const response = await fetch(`http://localhost:${puerto}/reclutas`);
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
    postPelicula,
    getPeliculaAll,
    deletePelicula,
    putPelicula,
    searchPelicula
}
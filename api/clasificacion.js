let headers = new Headers({
    "Content-Type": "application/json"
});
let puerto = 4008;

const postClasificacion = async (arg) => {
    arg.id = (arg.id) ? arg.id : Date.now();
    let config = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(arg)
    };
    return await (await fetch(`http://localhost:${puerto}/clasificacion`, config)).json();
}
const getClasificacionAll = async () => {
    let config = {
        method: "GET",
        headers: headers
    };
    return await (await fetch(`http://localhost:${puerto}/clasificacion`, config)).json();
}
const deleteClasificacion = async (arg) => {
    let config = {
        method: "DELETE",
        headers: headers,
    };
    return await (await fetch(`http://localhost:${puerto}/clasificacion/${arg.id}`, config)).json();
}
const putClasificacion = async (arg) => {
    let config = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(arg)
    };
    return await (await fetch(`http://localhost:${puerto}/clasificacion/${arg.id}`, config)).json();
}
const searchClasificacion = async (arg) => {
    const response = await fetch(`http://localhost:${puerto}/clasificacion`);
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
    postClasificacion,
    getClasificacionAll,
    deleteClasificacion,
    putClasificacion,
    searchClasificacion
}

const request = (options) => {
    const headers = new Headers({
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        "X-RapidAPI-Key": "42354ecc0bmsha4ac95ac88742f2p151cf3jsn6ca37e578c8b"
    })

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if(!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function nearestCity(lat, lng) {
    return request({
        url: "https://wft-geo-db.p.rapidapi.com/v1/geo/locations/" + lat + "%2B" + lng + "/nearbyCities?limit=1&minPopulation=100000&radius=100",
        method: 'GET'
    });
}

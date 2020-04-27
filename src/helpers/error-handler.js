export const handleErrors = response => {
    if (!response.ok){
        console.error(response.statusText);
    }

    return response;
};

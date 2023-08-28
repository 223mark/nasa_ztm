const DEFAULT_PAGE_LIMIT = 50;
const DEFAULT_PAGE_NUMBER = 1;


function getPagination(query) {
    // abs return absolute value of number
    // eample - if user do negative value such as -10 this abs() will return 10
    

    // if we give limit value zero Mongo will return all document
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;

    const skip = (page - 1) * limit;

    return {
        skip,
        limit
    }
}

module.exports = {
    getPagination
}
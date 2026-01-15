const indexController = {
    get: async (req, res, next) => {
        res.status(200).send(`<h1> Bengkel's Backend </h1>`);
    }
}

module.exports = indexController;
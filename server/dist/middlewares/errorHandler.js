export const errorHandler = (error, _req, res, _next) => {
    if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erreur interne serveur" });
};

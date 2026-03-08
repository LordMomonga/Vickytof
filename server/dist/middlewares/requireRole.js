export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Non autoris�" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acc�s refus�" });
        }
        return next();
    };
};

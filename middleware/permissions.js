module.exports = {
    ensureAdmin: (req, res, next) => {
        if (req.user.role === 'admin') return next();
        res.status(403).send('Admins only');
    },
    ensureEditorOrAdmin: (req, res, next) => {
        if (req.user.role === 'editor' || req.user.role === 'admin') return next();
        res.status(403).send('Permission denied');
    },
};

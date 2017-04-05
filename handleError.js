const handleError = function(res, err) {
    console.log('Error: ' + err);
    res.status(500).json({
        error: err
    });
};

module.exports = handleError;
const handleError = function(res, err) {
    console.log('Error: ' + err);
    res.json({
        error: err
    });
};

module.exports = handleError;
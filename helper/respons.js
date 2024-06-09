exports.success = (data, message, res) => {
    res.status(200).json({
        status: 'success',
        message,
        data,
    });
};

exports.error = (error, url, code, res) => {
    res.status(code).json({
        status: 'error',
        message: error.error,
        url,
    });
};

exports.success = (res, msg) => {
    var data = {
        status: 200,
        message: msg
    };
    return res.status(200).json(data);
};

exports.successWithData = (res, msg, data) => {
    var data = {
        status: 200,
        message: msg,
        data: data
    };
    return res.status(200).json(data);
};

exports.dataNotFound = (res, msg) => {
    var data = {
        status: 204,
        message: msg
    };
    return res.status(200).json(data);
};

exports.error = (res, msg) => {
    var data = {
        status: 500,
        message: msg
    };
    return res.status(500).json(data);
};

exports.errorWithData = (res, msg) => {
    var data = {
        status: 500,
        message: msg,
        data: data
    };
    return res.status(500).json(data);
};

exports.notFound = (res, msg) => {
    var data = {
        status: 404,
        message: msg
    };
    return res.status(404).json(data);
};

exports.validationError = (res, msg) => {
    var data = {
        status: 400,
        message: msg
    };
    return res.status(400).json(data);
};

exports.validationErrorWithData = (res, msg, data) => {
    var data = {
        status: 400,
        message: msg,
        data: data
    };
    return res.status(400).json(data);
};

exports.unauthorized = (res, msg) => {
    var data = {
        status: 401,
        message: msg
    };
    return res.status(401).json(data);
};

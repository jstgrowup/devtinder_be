export var ErrorResponse = function (res, statusCode, params) {
    var _a, _b;
    return res.status(statusCode).json({
        success: false,
        message: params.message,
        data: (_a = params === null || params === void 0 ? void 0 : params.data) !== null && _a !== void 0 ? _a : {},
        errors: (_b = params === null || params === void 0 ? void 0 : params.errors) !== null && _b !== void 0 ? _b : {},
    });
};

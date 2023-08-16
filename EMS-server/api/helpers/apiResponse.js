exports.send = (res, resCode, resMessage, resData) => {
    return res.status(200).json({
        res_code: resCode,
        res_message: resMessage,
        res_data: resData
    });
};

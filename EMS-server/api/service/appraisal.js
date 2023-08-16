const mongoose = require('mongoose');
const Appraisal = require('../model/Appraisal');
const CONSTANTS = require('../config/constants');

module.exports = {
    getAll,
    getAllWhere
};

async function getAll() {
    return await Appraisal.find({status: {
        $ne: CONSTANTS.STATUS.DELETED
    }}).select();
}

async function getAllWhere() {
    return await Appraisal.find({status: {
        $ne: CONSTANTS.STATUS.DELETED
    }}).select();
}
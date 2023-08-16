const CONSTANTS = require('../config/constants');

exports.currentDatetime = () => {
	return new Date(Date.now());
};

exports.futureDatetime = (afterTime) => {
	//afterTime in miliseconds
	return new Date(Date.now() + afterTime);
};

exports.dayDifference = (dateFrom, dateTo) => {
	return Math.floor((new Date(dateTo) - new Date(dateFrom)) / (86400000))+1;
}
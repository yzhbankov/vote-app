/**
 * Created by Iaroslav Zhbankov on 23.12.2016.
 */

module.exports = {

    setSizeOpt: function setSizeOption(obj) {
        var fields = Object.keys(obj);
        for (var i = 1; i < fields.length; i++) {
            var op = fields[i];
            obj[fields[i]] = {
                "option_name": obj[fields[i]],
                "size": 0
            };
        }
        return obj;
    },

    getSize: function getSize(obj) {
        var fields = Object.keys(obj);
        var arrSize = [];
        var arrName = [];
        for (var i = 1; i < fields.length; i++) {
            arrSize.push(obj[fields[i]].size);
            arrName.push(obj[fields[i]].option_name);
        }
        return arrSize;
    },

    getName: function getSize(obj) {
        var fields = Object.keys(obj);
        var arrSize = [];
        var arrName = [];
        for (var i = 1; i < fields.length; i++) {
            arrSize.push(obj[fields[i]].size);
            arrName.push(obj[fields[i]].option_name);
        }
        return arrName;
    },

    setSize: function setSize(obj, optionName, size) {
        var fields = Object.keys(obj);
        for (var i = 0; i < fields.length; i++) {
            if (obj[fields[i]].option_name == optionName) {
                obj[fields[i]].size = size;
            }
        }
        return obj;
    }
}
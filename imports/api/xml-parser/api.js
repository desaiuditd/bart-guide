/**
 * Created by udit on 2/28/17.
 */

export const XML_PARSER = {
  getJSON: function(xmlString, callback) {
    xml2js.parseString(xmlString, function (err, response) {
      if (err) {
        throw new Meteor.Error(err);
      } else {
        callback(response);
      }
    });
  },
};
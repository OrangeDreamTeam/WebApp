// Takes in the GCM Key, Phone Number, and Phone Name
// Inserts or Updates the Phone row
exports.initializeGCM = function(req, res) {
  var gcmKey = req.body['gcmKey'];
  var phoneNumber = req.body['phoneNumber'];
  var phoneName = req.body['phoneName'];

  var Phone = req.models.phone;

  Phone.find({phoneNumber: phoneNumber}, function(err, phone) {
    if(err) {
      console.log(err);
    }
    else if(!phone) {
      Phone.create({
        gcmKey: gcmKey,
        phoneNumber: phoneNumber,
        phoneName: phoneName
      }, function(err, newPhone) {
        if(err) {
          console.log(err);
        }
        else {
          res.send(200);
        }
      });
    }
    else {
      phone.gcmKey = gcmKey;
      phone.phoneName = phoneName;
      phone.save(function(err, savedPhone) {
        if(err) {
          console.log(err);
        }
        else {
          res.send(200);
        }
      });
    }
  });
}
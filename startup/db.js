const mongoose = require("mongoose");
module.exports = function () {
  mongoose
    .connect(
      "mongodb+srv://corefix:corefix@cluster0-b0kvb.mongodb.net/test?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("Connect with mongoDB with successfully"))
    .catch((err) => console.log(err));
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
};

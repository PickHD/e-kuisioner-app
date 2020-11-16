const CronJob = require("cron").CronJob;
const { tokens } = require("../models");

if (process.env.NODE_ENV === "production") {
  console.log("\t\t===== CRONJOB PRODUCTION MODE ===== \n");
  console.log("===== DELETE ALL TOKEN AT MIDNIGHT EVERY MON-FRI =====");
  exports.job = new CronJob("00 00 00 * * 1-5", async function () {
    try {
      const d = new Date();
      await tokens.destroy({ truncate: true });
      console.log(`=====ALL TOKEN DELETED at: ${d}=====`);
    } catch (error) {
      console.error(error);
    }

  });
  return;
}
console.log("\t\t===== CRONJOB DEV/TEST MODE ===== \n");
console.log("===== DELETE ALL TOKEN EVERY 30 MIN =====");
exports.job = new CronJob("0 */30 * * * *", async function () {
  try {
    const d = new Date();
    await tokens.destroy({ truncate: true });
    console.log(`=====ALL TOKEN DELETED at: ${d}=====`);
  } catch (error) {
    console.error(error);
  }

});



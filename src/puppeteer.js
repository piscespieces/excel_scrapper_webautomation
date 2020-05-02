const fs = require("fs");
const chalk = require("chalk");
const puppeteer = require("puppeteer");
const data = require("./index");

let profiles = {
  profile_found: [],
  profile_not_found: [],
};

(async () => {
  try {
    console.time(`Process Time`);

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    for (item of data) {
      first_name = item.firstName.v.toLowerCase().replace(" ", "-");
      last_name = item.lastName.v.toLowerCase().replace(" ", "-");
      full_name = first_name + " " + last_name;
      full_name_URI = full_name.replace(" ", "-");

      await page.goto(`https://www.genglobal.org/user/${full_name_URI}`, {
        waitUntil: "domcontentloaded",
      });

      let foundProfile = await page.$(
        "div.region.region-post-content>div#block-views-block-user-profile-block-block-1-2"
      );

      if (foundProfile) {
        const countryElement = await page.$("div.profile-country");
        const countryValue = await page.evaluate(
          (el) => el.textContent,
          countryElement
        );

        profiles.profile_found.push({
          full_name,
          country: countryValue,
          company: item.company ? item.company.v.toLowerCase() : "none",
          profile_url: `https://www.genglobal.org/user/${full_name_URI}`,
        });

        console.log(chalk.green(`FOUND profile for: ${full_name_URI}`));
      } else {
        console.log(chalk.red(`DID NOT found profile for: ${full_name_URI}`));
        profiles.profile_not_found.push({
          full_name,
        });
      }
    }

    await browser.close();
  } catch (error) {
    console.log(`this is the ${error}`);
  }
})().then(() => {
  let data_to_json = JSON.stringify(profiles, null, 2);
  fs.writeFileSync("json/profile_data.json", data_to_json, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(chalk.green("File has been written"));
    }
  });
  console.timeEnd("Process Time");
});

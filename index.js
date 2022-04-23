const http = require("http");
const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://time.com/";
const news = [];

(async () => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const listItems = $(".latest-stories ul li");

    listItems.each((idx, el) => {
      const item = { title: "", link: "" };
      const link = $(el).children("a").attr("href");
      item.title = $(el).children("a").text().trim();
      item.link = "https://time.com/" + link;
      news.push(item);
    });
  } catch (error) {
    console.log("the error is :", error);
  }
})();

http
  .createServer((req, res) => {
    const pathurl = req.url;

    if (pathurl === "/") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.write("api is running");
      res.end();
    } else if (pathurl === "/getTimeStories") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(news, null, 2));
      res.end();
    }
  })
  .listen(5000, () => {
    console.log("server is listerning");
  });

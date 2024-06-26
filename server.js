const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");

const downloadsDir = path.join(__dirname, "Downloads");

fs.readFile("./url.txt", "utf8", (err, url) => {
  if (err) {
    console.error(err);
    return;
  }

  function guidGen() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
      (
        +c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
      ).toString(16)
    );
  }

  ytdl
    .getInfo(url.replace('"', ""))
    .then((info) => {
      const videoFormats = ytdl.filterFormats(info.formats, "videoandaudio");

      if (videoFormats.length === 0) {
        console.log("No video formats found");
        return;
      }

      const format = videoFormats[0];

      const filePath = path.join(downloadsDir, `${guidGen()}.mp4`);

      ytdl(url.replace('"', ""), { format }).pipe(
        fs.createWriteStream(filePath)
      );
    })
    .catch((err) => {
      console.error("Error fetching video info:", err);
    });
});

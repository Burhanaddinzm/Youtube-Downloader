const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const youtubedl = require("youtube-dl-exec");
const progressEstimator = require("progress-estimator");

const downloadsDir = path.join(__dirname, "Downloads");

const logger = progressEstimator();

function guidGen() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.randomBytes(1)[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

async function downloadVideo() {
  try {
    const url = await fs.promises.readFile("./url.txt", "utf8");
    const trimmedUrl = url.replace('"', "").trim();

    const videoInfoPromise = youtubedl(trimmedUrl, {
      dumpSingleJson: true,
      noCheckCertificate: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: [
        "referer:youtube.com",
        "user-agent:googlebot",
      ],
    });

    const videoInfo = await logger(videoInfoPromise, `Obtaining ${trimmedUrl}`);
    const format = videoInfo.formats.find(
      (f) => f.vcodec !== "none" && f.acodec !== "none"
    );

    if (!format) {
      console.log("No video formats found");
      return;
    }

    const filePath = path.join(downloadsDir, `${guidGen()}.mp4`);
    const downloadPromise = youtubedl.exec(trimmedUrl, {
      format: format.format_id,
      output: filePath,
    });

    await logger(downloadPromise, `Downloading ${filePath}`);
    console.log("Download complete:", filePath);
  } catch (err) {
    console.error("Error:", err);
  }
}

downloadVideo();

const crypto = require("crypto");
const path = require("path");
const youtubedl = require("youtube-dl-exec");
const progressEstimator = require("progress-estimator");

const downloadsDir = path.join(__dirname, "Downloads");
const logger = progressEstimator();

const url = process.argv[2];
const option = process.argv[3] === "null" ? null : process.argv[3];

function guidGen() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (+c ^ (crypto.randomBytes(1)[0] & (15 >> (+c / 4)))).toString(16)
  );
}

async function downloadVideo(url, option) {
  try {
    const trimmedUrl = url.trim();

    const videoInfoPromise = youtubedl(trimmedUrl, {
      dumpSingleJson: true,
      noCheckCertificate: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });

    const videoInfo = await logger(videoInfoPromise, `Obtaining ${trimmedUrl}`);

    // Get format
    let format;

    if (!option) {
      format = videoInfo.formats.find(
        (f) => f.vcodec !== "none" && f.acodec !== "none"
      );
    } else if (option === "v") {
      format = videoInfo.formats.find((f) => f.vcodec !== "none");
    } else if (option === "a") {
      format = videoInfo.formats.find((f) => f.acodec !== "none");
    }

    if (!format) {
      throw new Error("No suitable formats found!");
    }

    const extension = option === "a" ? "mp3" : "mp4";

    const filePath = path.join(downloadsDir, `${guidGen()}.${extension}`);
    const downloadPromise = youtubedl.exec(trimmedUrl, {
      format: format.format_id,
      output: filePath,
    });

    await logger(downloadPromise, `Downloading ${filePath}`);
    console.log("Download complete:", filePath);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

downloadVideo(url, option);

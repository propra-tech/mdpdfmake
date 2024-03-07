const unicodes = [{ code: "&#x20;", replace: " " }];

export const cleanUnicodefromText = (text: string) => {
  unicodes.forEach(({ code, replace }) => {
    text = text.replaceAll(code, replace);
  });
  return text;
};

export async function imageURLToBase64(url: string) {
  if (typeof window !== "undefined") {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Cache-Control": "no-cache" },
    });
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });
  } else {
    const https = require("https");

    return new Promise((resolve, reject) => {
      const request = https
        .get(url, (response) => {
          const data = [];
          response.on("data", (chunk) => data.push(chunk));
          response.on("end", () => {
            const buffer = Buffer.concat(data);
            resolve(buffer.toString("base64"));
          });
        })
        .on("error", reject);
    });
  }
}

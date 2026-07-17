import { Name as Products } from "./product";

// Generic noise words to strip from slugs
const NOISE_WORDS = [
  // 1. Highly specific pattern matches with multiple words or lookaheads first
  /\b\d+\s*[kmg]\s*cache\b/gi, // Strip "1M cache"
  /\b\d+\s*[kmg]\s*(?=,?\s*\d+\s*(mhz|ghz|fsb))/gi, // Strip "1M" in "1M, 667 MHz FSB"
  /\b\d+(\.\d+)?\s*[kmg]?hz\b/gi, // Strip "1.83 GHz" or "667 MHz"
  /\b\d+\s*[kmg]b\b/gi, // Strip "4GB"
  /\bi\s*\/\s*o\b/gi,
  /\bi\/o\b/gi,

  // 2. Standard socket and category noise words
  /\bprocessor\b/gi,
  /\bgraphics\b/gi,
  /\bcpu\b/gi,
  /\bapu\b/gi,
  /\bedition\b/gi,
  /\bgaming\b/gi,
  /\bboxed\b/gi,
  /\bbox\b/gi,
  /\btray\b/gi,
  /\bseries\b/gi,
  /\bwith\b/gi,
  /\bnear\b/gi,
  /\bsilent\b/gi,
  /\bthermal\b/gi,
  /\bsolution\b/gi,
  /\bcooler\b/gi,
  /\band\b/gi,
  /\bsupporting\b/gi,
  /\btechnology\b/gi,
  /\bht\b/gi,
  /\bwraith\b/gi,
  /\bformerly\b/gi,
  /\bproducts\b/gi,
  /\blga\s*\d+\b/gi,
  /\bfclga\s*\d+\b/gi,
  /\bsocket\s*[a-z0-9]+\b/gi,

  // 3. Generic single-word fallbacks
  /\bintegrated\b/gi,
  /\bprocessing\b/gi,
  /\bunit\b/gi,
  /\b[kmg]hz\b/gi,
  /\bfsb\b/gi,
  /\bcache\b/gi,
  /\b[kmg]b\b/gi,
  /\bvision\b/gi,
  /\bquickassist\b/gi,
  /\boptane\b/gi,
  /\bheatsink\b/gi,
  /\bfan\b/gi,
  /\bliquid\b/gi,
  /\bwaterblock\b/gi,
];

/**
 * Generates a clear, descriptive slug for any hardware part name.
 * Strips trademarks and generic noise words, replacing spaces/special characters with single hyphens.
 * Examples:
 *   - 'Intel® Core™ i5-12400F Processor' -> 'intel-i5-12400f'
 *   - 'AMD Ryzen 5 5600X' -> 'amd-5600x'
 *   - 'Asus TUF GAMING B660M-PLUS WIFI D4' -> 'asus-tuf-b660m-plus-wifi-d4'
 */
export function generateSlug(name: string, productType?: Products): string {
  if (!name) {
    return "";
  }
  let t = name.toLowerCase();
  t = t.replace(/[®™]/g, "");
  t = t.replace(/\(tm\)|\(r\)/gi, "");

  // Determine brand
  let brand = "";
  if (t.includes("intel")) {
    brand = "intel";
  } else if (t.includes("amd")) {
    brand = "amd";
  } else if (t.includes("nvidia")) {
    brand = "nvidia";
  } else {
    // Infer brand from common series names
    const intelKeywords = [
      "xeon",
      "celeron",
      "pentium",
      "atom",
      "core",
      "ultra",
      "i3",
      "i5",
      "i7",
      "i9",
    ];
    const amdKeywords = ["ryzen", "epyc", "athlon", "phenom", "threadripper", "radeon"];
    if (intelKeywords.some((kw) => t.includes(kw))) {
      brand = "intel";
    } else if (
      amdKeywords.some((kw) => t.includes(kw)) ||
      /\b[a-z]\d+[- ]/i.test(t) ||
      /\bfx\b/i.test(t)
    ) {
      brand = "amd";
    }
  }

  // If product is CPU, apply specific CPU model extraction
  if (productType === Products.CPU) {
    const lowerNameCopy = t;

    // 1. Ordinal Exclusion: remove ordinal markers like "7th gen", "14th gen", etc.
    t = t.replace(/\b\d+(st|nd|rd|th)\s+(gen|generation)\b/gi, "");
    t = t.replace(/\b\d+(st|nd|rd|th)\b/gi, "");

    // 2. Version extraction (preservation: v2, v3, v4 etc.)
    const versionMatch = t.match(/\b(v\d+)\b/i);
    const version = versionMatch ? versionMatch[1].toLowerCase() : "";
    t = t.replace(/\b(v\d+)\b/gi, "");

    // Clean out noise words early
    for (const regex of NOISE_WORDS) {
      t = t.replace(regex, "");
    }

    // 3. Extract the Core Model based on Brand
    let model = "";

    if (brand === "intel") {
      // Check for Intel Core/Core Ultra naming
      const coreMatch = t.match(/\b(i[3579])\b/i);
      const ultraMatch = t.match(/\bultra\s+([3579])\b/i);
      const coreNewMatch = t.match(/\bcore\s+([3579])\b/i);

      if (ultraMatch) {
        const ultraPrefix = ultraMatch[1];
        const remaining = t.substring(t.indexOf(ultraMatch[0]) + ultraMatch[0].length);
        const numMatch = remaining.match(/\b([a-z0-9.]+)\b/i);
        model = `ultra-${ultraPrefix}${numMatch ? "-" + numMatch[1] : ""}`;
      } else if (coreMatch) {
        const corePrefix = coreMatch[1];
        const remaining = t.substring(t.indexOf(corePrefix) + corePrefix.length);
        const numMatch = remaining.match(/\b([a-z0-9.]+)\b/i);
        model = `${corePrefix}${numMatch ? "-" + numMatch[1] : ""}`;
      } else if (coreNewMatch) {
        const corePrefix = coreNewMatch[1];
        const remaining = t.substring(t.indexOf(coreNewMatch[0]) + coreNewMatch[0].length);
        const numMatch = remaining.match(/\b([a-z0-9.]+)\b/i);
        model = `core-${corePrefix}${numMatch ? "-" + numMatch[1] : ""}`;
      } else {
        // Fallback for Xeon, Pentium, Celeron, Atom
        let prefix = "";
        if (t.includes("xeon")) prefix = "xeon";
        else if (t.includes("pentium")) prefix = "pentium";
        else if (t.includes("celeron")) prefix = "celeron";
        else if (t.includes("atom")) prefix = "atom";
        else if (t.includes("movidius") || t.includes("myriad")) prefix = "movidius-myriad";

        t = t.replace(
          /\b(xeon|pentium|celeron|atom|gold|silver|bronze|platinum|movidius|myriad|core)\b/g,
          ""
        );

        const cleaned = t.replace(/[^a-z0-9.\s]+/g, " ").trim();
        const words = cleaned.split(/\s+/).filter((w) => w && w !== "intel");
        if (words.length > 0) {
          let mainModel = words[words.length - 1];
          if (words.length > 1) {
            const prevWord = words[words.length - 2];
            if (/^[a-z]\d*$/i.test(prevWord) && prevWord.length <= 3) {
              mainModel = `${prevWord}-${mainModel}`;
            }
          }
          if ((mainModel === "lv" || mainModel === "ulv") && words.length === 1) {
            const freqMatch = lowerNameCopy.match(/\b\d+(\.\d+)?\s*[kmg]?hz\b/i);
            if (freqMatch) {
              mainModel = `${mainModel}-${freqMatch[0]}`;
            }
          }
          model = prefix ? `${prefix}-${mainModel}` : mainModel;
        } else {
          const freqMatch = lowerNameCopy.match(/\b\d+(\.\d+)?\s*[kmg]?hz\b/i);
          if (freqMatch) {
            model = prefix ? `${prefix}-${freqMatch[0]}` : freqMatch[0];
          } else {
            model = prefix;
          }
        }
      }
    } else if (brand === "amd") {
      // AMD Ryzen, Epyc, Athlon, FX, Phenom, A-series
      let prefix = "";
      if (t.includes("epyc")) prefix = "epyc";
      else if (t.includes("athlon")) prefix = "athlon";
      else if (t.includes("phenom")) prefix = "phenom";

      const aSeriesMatch = t.match(/\b([aA]\d+)[- ]?(\d+[a-z]*)\b/i);
      const fxMatch = t.match(/\bfx[- ]?(\d+[a-z]*)\b/i);

      if (aSeriesMatch) {
        model = `${aSeriesMatch[1]}-${aSeriesMatch[2]}`;
      } else if (fxMatch) {
        model = `fx-${fxMatch[1]}`;
      } else {
        t = t.replace(/\b(ryzen|epyc|athlon|phenom|gold|silver|embedded|pro)\b/g, "");
        const cleaned = t.replace(/[^a-z0-9.\s]+/g, " ").trim();
        const words = cleaned.split(/\s+/).filter((w) => w && w !== "amd");
        if (words.length > 0) {
          let mainModel = words[words.length - 1];
          if ((mainModel === "lv" || mainModel === "ulv") && words.length === 1) {
            const freqMatch = lowerNameCopy.match(/\b\d+(\.\d+)?\s*[kmg]?hz\b/i);
            if (freqMatch) {
              mainModel = `${mainModel}-${freqMatch[0]}`;
            }
          }
          model = prefix ? `${prefix}-${mainModel}` : mainModel;
        } else {
          const freqMatch = lowerNameCopy.match(/\b\d+(\.\d+)?\s*[kmg]?hz\b/i);
          if (freqMatch) {
            model = prefix ? `${prefix}-${freqMatch[0]}` : freqMatch[0];
          } else {
            model = prefix;
          }
        }
      }
    }

    if (version && !model.includes(version)) {
      model = `${model}-${version}`;
    }

    let slug = brand ? `${brand}-${model}` : model;
    slug = slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-");
    return slug;
  }

  // Fallback for non-CPU parts
  for (const regex of NOISE_WORDS) {
    t = t.replace(regex, "");
  }

  t = t.replace(/[^a-z0-9]+/g, "-");
  t = t.replace(/^-+|-+$/g, "");
  t = t.replace(/-+/g, "-");

  return t;
}

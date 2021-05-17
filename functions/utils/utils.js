exports.prettyNum = (num) => {
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  });
};

exports.prettyUsd = (num) => {
  return Number(num).toLocaleString("en-EN", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
};

exports.processMoon = (percent) => {
  if (percent > 0.2 && percent < 0.4) {
    return "🌘";
  } else if (percent > 0.4 && percent < 0.6) {
    return "🌗";
  } else if (percent > 0.6 && percent < 0.8) {
    return "🌖";
  } else if (percent > 0.8) {
    return "🌕";
  } else {
    return "🌑";
  }
};

export const replaceDateMacros = (input: string): string => {
  const date = new Date();
  // {d} day of the month, 2 digits with leading zeros
  // {j} day of the month without leading zeros
  // {m} numeric representation of a month, with leading zeros
  // {n} numeric representation of a month, without leading zeros
  // {Y} a full numeric representation of a year, 4 digits
  // {y} a two digit representation of a year
  // {g} 12-hour format of an hour without leading zeros
  // {G} 24-hour format of an hour without leading zeros
  // {h} 12-hour format of an hour with leading zeros
  // {H} 24-hour format of an hour with leading zeros
  // {i} minutes with leading zeros
  // {s} seconds, with leading zeros
  // {U} seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
  const replacements: { [key: string]: string } = {
    "{d}": String(date.getDate()).padStart(2, "0"),
    "{j}": String(date.getDate()),
    "{m}": String(date.getMonth() + 1).padStart(2, "0"),
    "{n}": String(date.getMonth() + 1),
    "{Y}": String(date.getFullYear()),
    "{y}": String(date.getFullYear()).slice(-2),
    "{g}": String(date.getHours() % 12 || 12),
    "{G}": String(date.getHours()),
    "{h}": String(date.getHours()).padStart(2, "0"),
    "{H}": String(date.getHours()).padStart(2, "0"),
    "{i}": String(date.getMinutes()).padStart(2, "0"),
    "{s}": String(date.getSeconds()).padStart(2, "0"),
    "{U}": String(Math.floor(date.getTime() / 1000)),
  };
  let output = input;
  for (const [key, value] of Object.entries(replacements)) {
    output = output.replace(new RegExp(key, "g"), value);
  }
  return output;
};

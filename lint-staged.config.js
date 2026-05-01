export default {
  "*.{ts,tsx,js,jsx}": ["biome check --write --no-errors-on-unmatched"],
  "*.{json,css,md}": ["biome format --write --no-errors-on-unmatched"],
};

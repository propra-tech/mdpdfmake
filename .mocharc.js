module.exports = {
  extension: ["ts"],
  spec: "src/**/*.spec.ts",
  "node-option": [
    "experimental-specifier-resolution=node",
    "loader=ts-node/esm",
  ],
};

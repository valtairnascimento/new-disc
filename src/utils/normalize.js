function normalizeProfileName(profile) {
  if (!profile.includes("/")) return profile;
  return profile.split("/").sort().join("/");
}

module.exports = { normalizeProfileName };

function simpleEncrypt(text) {
  return btoa(unescape(encodeURIComponent(text))); // Base64 encode
}

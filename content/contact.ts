const addressLines = [
  "Tầng 1, 64 đường số 2",
  "Khu đô thị Vạn Phúc",
  "Phường Hiệp Bình, TP. Hồ Chí Minh",
];

export const contact = {
  phone: "0398 288 830",
  phoneHref: "tel:0398288830",
  addressLines,
  mapsHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLines.join(", "))}`,
};
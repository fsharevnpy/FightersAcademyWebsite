const streetAddress = "64 đường số 2";
const localityLines = [
  "Khu đô thị Vạn Phúc",
  "Phường Hiệp Bình, TP. Hồ Chí Minh",
];
const addressLines = [`Tầng 1, ${streetAddress}`, ...localityLines];
const mapsQuery = encodeURIComponent([streetAddress, ...localityLines].join(", "));

export const contact = {
  phone: "0398 288 830",
  phoneHref: "tel:0398288830",
  zaloHref: "https://zalo.me/0398288830",
  addressLines,
  mapsHref: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
  mapsEmbedHref: `https://www.google.com/maps?q=${mapsQuery}&output=embed`,
};

export const trialContact = {
  label: "Đăng ký học thử",
  href: contact.phoneHref,
  schedule: "Liên hệ STEM Fighters để được tư vấn lịch học thử phù hợp.",
};
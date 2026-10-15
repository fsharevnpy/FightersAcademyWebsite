import Image from "next/image";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return <a href="#top" className={`brand ${inverse ? "brand--inverse" : ""}`} title="STEM Fighters — về đầu trang">
    <span className="brand-emblem"><Image src="/images/logo.png" alt="" width={58} height={58} priority /></span>
    <span className="brand-wordmark">STEM <strong>FIGHTERS</strong><span>KHÁM PHÁ · SÁNG TẠO · BỨT PHÁ</span></span>
  </a>;
}

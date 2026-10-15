import Image from "next/image";
import Link from "next/link";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" className={`brand ${inverse ? "brand--inverse" : ""}`} title="STEM Fighters — về trang chủ">
    <span className="brand-emblem"><Image src="/images/logo.png" alt="" width={58} height={58} priority /></span>
    <span className="brand-wordmark">STEM <strong>FIGHTERS</strong><span>KHÁM PHÁ · SÁNG TẠO · BỨT PHÁ</span></span>
  </Link>;
}

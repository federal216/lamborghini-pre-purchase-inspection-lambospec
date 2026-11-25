# 🔐 LamboSpec AI — Private Payment Gateways & Account Registry

Bu belge, LamboSpec AI projesinde kullanılan tüm ödeme altyapılarını, başvuru durumlarını ve hangi e-posta adresleriyle açıldıklarını takip etmek için oluşturulmuştur.

---

## 📋 Ödeme Altyapıları Hesap Listesi

| Ödeme Altyapısı | Kayıtlı / Başvurulan E-Posta | Başvuru / Referans No | Ürün & Para Birimi | Durum |
| :--- | :--- | :--- | :--- | :--- |
| **PayTR** | `karakoc.i@gmail.com` | `17CC89H551P35576` | Sanal POS ($79.00 USD / TL) | ⏳ Ön başvuru yapıldı, onay bekleniyor |
| **Dodo Payments (MoR)** | `karakoc.i@gmail.com` | Live Prod: `pdt_0NsdaQ7P6h6NjAauG3k4P` <br> Test Prod: `pdt_0NsdXpb0AXJ8AeTfGANYe` | $79.00 USD (Apple Pay, GPay, Kart) | 🚀 Canlı Anahtar Bağlandı (Otomatik Fallback Aktif) |
| **Paddle (MoR)** | `karakoc.i@gmail.com` / `lamborginichallenge2026@gmail.com` | Price ID: `pri_01m7wnbynzbf08mydbbj8vgkd5` | $79.00 USD Global Checkout | ⏳ Başvuru inceleniyor |
| **Whop (MoR)** | `karakoc.i@gmail.com` | Plan: Direct Checkout | $79.00 USD (Apple Pay, GPay, Kart) | ✅ Sitede ve Kodda Aktif |
| **Kripto (Web3)** | *Doğrudan Cüzdan* | USDT TRC-20: `TDV1Q...` | $79 USDT / USDC | ✅ Kodda aktif ve hazır |
| ~~**iyzico**~~ | `karakoc.i@gmail.com` | Sanal POS Entegrasyonu | $79.00 USD / 2.750 TL | ❌ **İPTAL EDİLDİ** (Şirket/Vergi levhası şartı nedeniyle kaldırıldı) |

---

## 👤 Yönetici & Platform Giriş Bilgisi (Primary Admin Login)
* 🔑 **Tüm Servis ve Panellere Giriş Yapılan Ana E-Posta:** `karakoc.i@gmail.com`
  * **Dodo Payments Girişi:** Doğrudan `karakoc.i@gmail.com` hesabı ile giriş yapılmıştır.
  * **PayTR Başvurusu & Girişi:** `karakoc.i@gmail.com` ile yapılmıştır (Başvuru Ref No: `17CC89H551P35576`).
  * **GitHub Deposu & Proje Sahibi:** `karakoc.i@gmail.com` / `federal216`.
* 🛡️ **Müşterilere Gösterilen VIP Destek / Concierge E-Postası:** `lamborginichallenge2026@gmail.com` *(Sitede dışa açık destek maili olarak bu görünür; tüm idari ve ödeme girişleri `karakoc.i@gmail.com` üzerindedir).*

---

## 🏦 Resmi Payoneer & Banka Hesap Bilgileri
* **Banka Adı:** Citibank N.A. (Payoneer US Receiving Account)
* **Adres:** 111 Wall Street, New York, NY 10043, United States
* **ABA Routing Numarası:** `031100209`
* **Hesap Numarası:** `70580640002590994`
* **Lehtar / Hesap Sahibi:** İbrahim Karakoç
* **Kayıtlı Payoneer E-Postası:** `kiliclarinfirtinasi216@gmail.com`
* **Yurtiçi VakıfBank IBAN:** `TR890001500158007314606045` (SWIFT: `TVBATR2A`)

---

## 🔐 Dodo Payments İki Faktörlü Doğrulama (2FA) Kurtarma Kodları
*(Oturum açma veya cihaz kaybı durumunda acil giriş için yedek kodlar)*

```text
1.  E2MQ-UHZG-8UG7
2.  WYKX-G9GK-UEEP
3.  KANR-E25L-37RH
4.  PUWR-96Z8-NPRE
5.  MRH9-Z5QS-MTCD
6.  4HAD-DD8G-AXHP
7.  D2R9-Q4LP-WEHU
8.  G3F8-YM77-L32W
9.  DL6V-6EC9-NCB5
10. VPJ7-YZEW-AWFA
```

---

## 🔑 Gerekli Ortam Değişkenleri (.env)

```bash
# PayTR (Panel: Ayarlar -> Entegrasyon Bilgileri)
PAYTR_MERCHANT_ID=
PAYTR_MERCHANT_KEY=
PAYTR_MERCHANT_SALT=
PAYTR_TEST_MODE=1

# Dodo Payments (Panel: Developers -> API Keys & Products)
DODO_PAYMENTS_LIVE_KEY=dodo_live_xNuMmrRTOkHMLZY7.pEQXFVs-wu2XLVkeKX7xvdvcH9v71jbN6FdtMEyTPzCJLR0j
DODO_LIVE_PRODUCT_ID=pdt_0NsdaQ7P6h6NjAauG3k4P

DODO_PAYMENTS_TEST_KEY=dodo_test_0_u-P96zqKPvQVU1.lwM9WJvPchJR4POMqkT0iVuHclz9ul4Jfbf8Jd_-JJZSuM4Q
DODO_TEST_PRODUCT_ID=pdt_0NsdXpb0AXJ8AeTfGANYe

DODO_BUSINESS_ID=bus_0NsdOsgyw5JvaPeKIIn2R

# Paddle (Panel: Developer Tools -> Authentication)
PADDLE_CLIENT_TOKEN=7sexx0tq6f10248f7ekcdh9zp29dhmdrbswga92as1g0bhmy7c
PADDLE_PRICE_ID=pri_01m7wnbynzbf08mydbbj8vgkd5

# iyzico (İPTAL - Vergi levhası zorunluluğu nedeniyle kaldırıldı)
```

*Son Güncelleme: 25 Kasım 2026 (iyzico iptal edildi; MoR altyapıları Dodo/Whop/Paddle ve Kripto aktif)*

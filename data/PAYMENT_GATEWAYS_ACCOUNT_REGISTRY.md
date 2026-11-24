# 🔐 LamboSpec AI — Private Payment Gateways & Account Registry

Bu belge, LamboSpec AI projesinde kullanılan tüm ödeme altyapılarını, başvuru durumlarını ve hangi e-posta adresleriyle açıldıklarını takip etmek için oluşturulmuştur.

---

## 📋 Ödeme Altyapıları Hesap Listesi

| Ödeme Altyapısı | Kayıtlı / Başvurulan E-Posta | Başvuru / Referans No | Ürün & Para Birimi | Durum |
| :--- | :--- | :--- | :--- | :--- |
| **PayTR** | `karakoc.i@gmail.com` | `17CC89H551P35576` | Sanal POS ($79.00 USD / TL) | ⏳ Ön başvuru yapıldı, onay bekleniyor |
| **Dodo Payments (MoR)** | `karakoc.i@gmail.com` | *Açılış aşamasında* | $79.00 USD (Apple Pay, GPay, Kart) | 🚀 Kod altyapısı hazır, API anahtarı bekleniyor |
| **Paddle (MoR)** | `karakoc.i@gmail.com` / `lamborginichallenge2026@gmail.com` | Price ID: `pri_01m7wnbynzbf08mydbbj8vgkd5` | $79.00 USD Global Checkout | ⏳ Başvuru inceleniyor |
| **iyzico** | `karakoc.i@gmail.com` / `lamborginichallenge2026@gmail.com` | Sanal POS Entegrasyonu | $79.00 USD / 2.750 TL (3D Secure) | ⏳ Başvuru inceleniyor |
| **Kripto (Web3)** | *Doğrudan Cüzdan* | USDT TRC-20: `TDV1Q...` | $79 USDT / USDC | ✅ Kodda aktif ve hazır |

---

## 👤 Yönetici & Platform Giriş Bilgisi (Primary Admin Login)
* 🔑 **Tüm Servis ve Panellere Giriş Yapılan Ana E-Posta:** `karakoc.i@gmail.com`
  * **Dodo Payments Girişi:** Doğrudan `karakoc.i@gmail.com` hesabı ile giriş yapılmıştır.
  * **PayTR Başvurusu & Girişi:** `karakoc.i@gmail.com` ile yapılmıştır (Başvuru Ref No: `17CC89H551P35576`).
  * **GitHub Deposu & Proje Sahibi:** `karakoc.i@gmail.com` / `federal216`.
* 🛡️ **Müşterilere Gösterilen VIP Destek / Concierge E-Postası:** `lamborginichallenge2026@gmail.com` *(Sitede dışa açık destek maili olarak bu görünür; tüm idari ve ödeme girişleri `karakoc.i@gmail.com` üzerindedir).*

---

## 🔑 Gerekli Ortam Değişkenleri (.env)

```bash
# PayTR (Panel: Ayarlar -> Entegrasyon Bilgileri)
PAYTR_MERCHANT_ID=
PAYTR_MERCHANT_KEY=
PAYTR_MERCHANT_SALT=
PAYTR_TEST_MODE=1

# Dodo Payments (Panel: Developers -> API Keys & Products)
DODO_PAYMENTS_API_KEY=
DODO_PRODUCT_ID=
DODO_PAYMENTS_ENVIRONMENT=test_mode # or live_mode

# Paddle (Panel: Developer Tools -> Authentication)
PADDLE_CLIENT_TOKEN=7sexx0tq6f10248f7ekcdh9zp29dhmdrbswga92as1g0bhmy7c
PADDLE_PRICE_ID=pri_01m7wnbynzbf08mydbbj8vgkd5

# iyzico
IYZICO_API_KEY=
IYZICO_SECRET_KEY=
IYZICO_BASE_URL=https://api.iyzipay.com
```

*Son Güncelleme: 24 Kasım 2026*

---
lastUpdated: "2026-11-05"
---

## English

**Short version: the app reads only the SMS messages Çaykur sends you, to keep your tea-harvest ledger. Those messages and everything taken from them stay on your phone — they are never uploaded, never shared and never used for advertising. The app shows banner ads through Google's Mobile Ads SDK, which talks to Google independently of your messages.**

Çay Kesim İstatistiği is an independent app. It is **not affiliated with, endorsed by or operated by Çaykur** (Çay İşletmeleri Genel Müdürlüğü).

### Why the app reads SMS
After every sale, Çaykur sends the grower an SMS receipt: how many kilograms were bought, the remaining quota, the date and the purchase point. Çaykur also announces daily quotas and days without purchases by SMS. There is no other channel for this data. The app's core function is to turn these receipts into a ledger — totals per harvest period and season, a calendar of purchase days and estimated income.

To do that it asks for two permissions, **only after explaining them on screen and only if you tap "Allow"**:

- **Receive SMS** (`RECEIVE_SMS`) — to record a new Çaykur receipt the moment it arrives.
- **Read SMS** (`READ_SMS`) — once, when you choose to import past seasons from your inbox.

### Which messages it reads — and which it does not
- When importing, the inbox query itself is filtered to Çaykur messages (by sender and by Çaykur-specific wording), so **other messages are not loaded into the app at all**.
- When a new SMS arrives, Android delivers it to the app; if it is not from Çaykur it is **discarded immediately and never stored**.
- The app never sends SMS and never deletes or changes your messages.

### What the app stores, on your device only
- Purchase records taken from Çaykur receipts: date and time, kilograms, remaining quota, producer name, wallet number and purchase point
- Çaykur announcements: daily quotas and purchase/no-purchase days
- The original text of Çaykur messages, so they can be re-read if the app's message reader is improved
- What you enter yourself: notes, prices per year, your field size, weekly holiday, manual corrections
- Settings: text size, dark mode, notifications

All of this lives in the app's private storage on your phone. **It is not uploaded to us or to anyone else, and it is excluded from Google Drive device backup.** Uninstalling the app or clearing its data deletes it; you can also delete individual records inside the app.

### Backups you make yourself
"Back up" writes your records to a `.cayyedek` file **at a location you choose** (for example your phone's storage or a folder you pick). The app does not send that file anywhere. If you share it — say, over a messaging app — it is shared by you, under that app's terms.

### Ads
The app shows a **banner ad** on the Summary and Calendar screens (never on the SMS permission explanation, the welcome screens or settings). Ads are served by **Google's Mobile Ads SDK**, which starts shortly after you open the app and may process:

- your device's **advertising ID** and general device information,
- **ad interaction data** (that an ad was shown or tapped),
- approximate location and diagnostic data for ad delivery and fraud prevention.

That data goes directly to Google; we do not receive or store it. **Your SMS messages and the ledger built from them are never passed to the ad SDK, and are never used for advertising, targeting or any other purpose than your own ledger.** In the app's code the ad component cannot reach the message or database layers at all. Ad content is limited to the "PG" rating.

You can reset or delete your advertising ID in Android → Settings → Privacy → Ads. Google's policy governs its processing: https://policies.google.com/privacy

### What the app does NOT do
- No account, sign-in or email address.
- No analytics or behaviour tracking by us.
- No selling or sharing of any data.
- No access to contacts, precise location, camera, microphone or photos.
- No in-app purchases.

### Permissions
| Permission | Why |
|---|---|
| Receive SMS, Read SMS | Record Çaykur receipts and announcements (see above). Optional — without them you can enter purchases by hand. |
| Notifications | Tell you when a new purchase was recorded. Optional. |
| Internet, network state, advertising ID | Used only by the Google Mobile Ads SDK to show ads. |

You can revoke any of these at any time in Android → Settings → Apps → Çay Kesim İstatistiği → Permissions. The app keeps working with manual entry.

### Children
The app is a record-keeping tool for tea growers and is not directed at children under 13.

### Changes
If a future version changes what is read or stored, this policy will be updated **before** that version is published, and the store listing's Data safety section will be updated to match.

### Contact
info@behemehal.org

---

## Türkçe

**Kısaca: uygulama, çay kesim defterini tutmak için yalnızca Çaykur'un sana gönderdiği SMS'leri okur. Bu mesajlar ve onlardan çıkarılan her şey telefonunda kalır — hiçbir yere gönderilmez, kimseyle paylaşılmaz ve reklam için kullanılmaz. Uygulama Google Mobile Ads SDK'sı ile banner reklam gösterir; bu SDK mesajlarından bağımsız olarak Google ile konuşur.**

Çay Kesim İstatistiği bağımsız bir uygulamadır. **Çaykur (Çay İşletmeleri Genel Müdürlüğü) ile bir bağı yoktur, Çaykur tarafından onaylanmamış ya da işletilmemektedir.**

### Uygulama SMS'i neden okur
Çaykur her kesimden sonra üreticiye bir SMS gönderir: kaç kilo alındığı, kalan kota, tarih ve alım yeri. Günlük kontenjanları ve alım yapılmayan günleri de SMS ile duyurur. Bu bilgiye ulaşmanın başka bir yolu yoktur. Uygulamanın asıl işi bu mesajları bir deftere dönüştürmektir: dönem ve sezon toplamları, alım günlerinin takvimi ve tahmini kazanç.

Bunun için iki izin ister; **izinler önce ekranda açıklanır ve yalnızca "İzin ver"e dokunursan istenir**:

- **SMS alma** (`RECEIVE_SMS`) — yeni gelen Çaykur kesim mesajını hemen deftere yazmak için.
- **SMS okuma** (`READ_SMS`) — geçmiş sezonları gelen kutusundan içe aktarmayı seçtiğinde.

### Hangi mesajları okur, hangilerini okumaz
- İçe aktarmada gelen kutusu sorgusu daha telefonun SMS veritabanında Çaykur mesajlarına süzülür (göndericiye ve Çaykur'a özgü ifadelere göre); **diğer mesajların uygulamaya hiç gelmez**.
- Yeni bir SMS geldiğinde Android onu uygulamaya iletir; Çaykur'dan değilse **hemen atılır, hiçbir yere kaydedilmez**.
- Uygulama SMS göndermez, mesajlarını silmez ya da değiştirmez.

### Uygulamanın sakladıkları (yalnızca telefonunda)
- Çaykur kesim mesajlarından alınan kayıtlar: tarih ve saat, kilo, kalan kota, üretici adı, cüzdan no ve alım yeri
- Çaykur duyuruları: günlük kontenjanlar, alım olan/olmayan günler
- Çaykur mesajlarının ham metni (uygulamanın mesaj okuyucusu geliştiğinde yeniden okunabilsin diye)
- Kendi girdiklerin: notlar, yıl fiyatları, çaylık büyüklüğü, haftalık tatil, elle düzeltmeler
- Ayarlar: yazı boyutu, koyu tema, bildirimler

Bunların hepsi uygulamanın telefondaki kendi alanında durur. **Bize ya da başkasına gönderilmez; Google Drive cihaz yedeğine de dahil edilmez.** Uygulamayı kaldırdığında ya da verisini temizlediğinde silinir; kayıtları uygulamanın içinden tek tek de silebilirsin.

### Kendi aldığın yedekler
"Yedek al", kayıtlarını **senin seçtiğin yere** bir `.cayyedek` dosyası olarak yazar. Uygulama bu dosyayı hiçbir yere göndermez. Dosyayı (örneğin bir mesajlaşma uygulamasıyla) paylaşırsan, onu sen paylaşmış olursun.

### Reklamlar
Uygulama Özet ve Takvim ekranlarında **banner reklam** gösterir (SMS izni açıklamasında, tanıtım ekranlarında ve ayarlarda asla göstermez). Reklamları **Google Mobile Ads SDK'sı** sunar; uygulama açıldıktan kısa süre sonra başlar ve şunları işleyebilir:

- cihazının **reklam kimliği** ve genel cihaz bilgisi,
- **reklam etkileşim verisi** (reklamın gösterildiği ya da dokunulduğu),
- reklam sunumu ve dolandırıcılığı önlemek için yaklaşık konum ve teşhis verisi.

Bu veri doğrudan Google'a gider; biz almayız, saklamayız. **SMS mesajların ve onlardan kurulan defter reklam SDK'sına asla verilmez; reklam, hedefleme ya da defterin dışında hiçbir amaçla kullanılmaz.** Uygulamanın kodunda reklam bölümü mesaj ve veritabanı katmanlarına hiç erişemez. Reklam içeriği "PG" (genel izleyici) seviyesiyle sınırlıdır.

Reklam kimliğini Android → Ayarlar → Gizlilik → Reklamlar üzerinden sıfırlayabilir ya da silebilirsin. Bu işlem Google'ın politikasına tabidir: https://policies.google.com/privacy

### Uygulamanın YAPMADIKLARI
- Hesap, giriş ya da e-posta adresi yok.
- Bizim tarafımızdan analitik ya da davranış takibi yok.
- Hiçbir veri satılmaz ya da paylaşılmaz.
- Rehber, hassas konum, kamera, mikrofon ya da fotoğraflara erişim yok.
- Uygulama içi satın alma yok.

### İzinler
| İzin | Neden |
|---|---|
| SMS alma, SMS okuma | Çaykur kesim mesajlarını ve duyurularını kaydetmek (yukarıya bak). İsteğe bağlı — izin vermezsen kesimleri elle girebilirsin. |
| Bildirimler | Yeni kesim kaydedildiğinde haber vermek. İsteğe bağlı. |
| İnternet, ağ durumu, reklam kimliği | Yalnızca Google Mobile Ads SDK'sının reklam göstermesi için. |

Bu izinlerin her birini istediğin an Android → Ayarlar → Uygulamalar → Çay Kesim İstatistiği → İzinler'den geri alabilirsin. Uygulama elle girişle çalışmaya devam eder.

### Çocuklar
Uygulama çay üreticileri için bir kayıt aracıdır; 13 yaş altındaki çocuklara yönelik değildir.

### Değişiklikler
İleride okunan ya da saklanan bilgiler değişirse bu politika o sürüm yayınlanmadan **önce** güncellenir ve mağazadaki Veri güvenliği bölümü de buna göre düzeltilir.

### İletişim
info@behemehal.org

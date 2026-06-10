export const faqData = [
  {
    id: "security",
    question: "Dosyalarım güvende mi?",
    answer:
      "Yüklenen dosyalar yalnızca dönüşüm sırasında sunucu belleğinde tutulur. İşlem tamamlandıktan hemen sonra silinir — kalıcı olarak saklanmaz, üçüncü taraflarla paylaşılmaz.",
  },
  {
    id: "free",
    question: "Ücretli mi?",
    answer:
      "Temel dönüşüm özellikleri tamamen ücretsizdir. Geçmiş kaydı ve ek özellikler için üye olman yeterli — kredi kartı veya ek ücret gerekmez.",
  },
  {
    id: "filesize",
    question: "Maksimum dosya boyutu nedir?",
    answer:
      "Şu an için dosya başına 10 MB sınırı uygulanmaktadır. Daha büyük dosyalar için bizimle iletişime geçebilirsiniz — kurumsal çözümler sunuyoruz.",
  },
  {
    id: "formats",
    question: "Hangi çıktı formatları destekleniyor?",
    answer:
      "JSON, XML, Markdown ve düz metin (Plain Text) formatları desteklenmektedir. Her format farklı kullanım senaryoları için optimize edilmiştir. Yeni formatlar yol haritamızda bulunuyor.",
  },
  {
    id: "anonymous",
    question: "Üye olmadan kullanabilir miyim?",
    answer:
      "Evet. Kayıt olmadan tüm dönüşüm özelliklerini kullanabilirsin. Anonim kullanımda son 5 dönüşümün tarayıcında saklanır. Geçmişini kalıcı kaydetmek istersen üye olman yeterli.",
  },
  {
    id: "multiple",
    question: "Aynı anda birden fazla dosya yükleyebilir miyim?",
    answer:
      "Evet. Aynı dosya türü kartına birden fazla dosya yükleyebilirsin. Her dosya ayrı ayrı işlenir ve sonuçları ayrı ayrı görüntüleyebilir, indirebilirsin.",
  },
  {
    id: "api",
    question: "API erişimi var mı?",
    answer:
      "API desteği geliştirme aşamasındadır. Developer erken erişim listesine katılmak için bizimle iletişime geçebilirsin. REST API ile kendi uygulamanıza entegrasyon sağlayabileceksin.",
  },
  {
    id: "history",
    question: "Geçmiş dönüşümlerimi nasıl görürüm?",
    answer:
      "Navbar'daki geçmiş ikonuna tıklayarak sağdan açılan panelde tüm dönüşümlerini görebilirsin. Üye değilsen son 5 dönüşüm tarayıcında saklanır. Üye olursan tüm geçmişin buluta kaydedilir.",
  },
] as const;

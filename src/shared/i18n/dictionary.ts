import type { Language } from '../../core/index.ts';

// The dictionary is the single source of truth for every user-facing
// string in Lexica. Each translation key corresponds to a rendering site
// exactly once so it is obvious where a label comes from and safe to
// rename without chasing duplicates.

export type TranslationKey =
  | 'ob_welcome_title'
  | 'ob_welcome_desc'
  | 'ob_start'
  | 'ob_profile_title'
  | 'ob_profile_desc'
  | 'ob_profile_name_label'
  | 'ob_profile_name_placeholder'
  | 'ob_profile_avatar_label'
  | 'ob_profile_shuffle'
  | 'ob_system_title'
  | 'ob_system_desc'
  | 'ob_sys_default'
  | 'ob_sys_aggressive'
  | 'ob_sys_relaxed'
  | 'ob_next'
  | 'ob_back'
  | 'ob_goal_title'
  | 'ob_goal_desc'
  | 'ob_mode_title'
  | 'ob_mode_desc'
  | 'ob_mode_en'
  | 'ob_mode_tr'
  | 'ob_mode_mix'
  | 'ob_finish'
  | 'dash_hello'
  | 'dash_hello_named'
  | 'daily_goal'
  | 'total_words'
  | 'today_review'
  | 'overdue'
  | 'upcoming'
  | 'quick_actions'
  | 'add_word_desc'
  | 'nav_home'
  | 'nav_words'
  | 'nav_review'
  | 'nav_settings'
  | 'settings'
  | 'sg_learning'
  | 'sg_appearance'
  | 'sg_data'
  | 'sg_profile'
  | 'repetition_system'
  | 'learning_mode'
  | 'theme'
  | 'language'
  | 'animations'
  | 'export'
  | 'import'
  | 'reset_data'
  | 'profile_name'
  | 'profile_avatar'
  | 'profile_edit'
  | 'search_placeholder'
  | 'add_word'
  | 'edit_word'
  | 'english'
  | 'turkish'
  | 'example'
  | 'notes'
  | 'save'
  | 'delete'
  | 'cancel'
  | 'all'
  | 'new_w'
  | 'learning'
  | 'mastered'
  | 'filter_overdue'
  | 'no_words'
  | 'no_words_desc'
  | 'add_first'
  | 'no_review'
  | 'no_review_desc'
  | 'start_review'
  | 'reviews_left'
  | 'overdue_msg'
  | 'tap_to_reveal'
  | 'again'
  | 'hard'
  | 'good'
  | 'easy'
  | 'day_1'
  | 'days'
  | 'review_done'
  | 'review_done_desc'
  | 'reviewed'
  | 'back_home'
  | 'today'
  | 'tomorrow'
  | 'days_left'
  | 'days_overdue'
  | 'default_sys'
  | 'aggressive_sys'
  | 'relaxed_sys'
  | 'theme_light'
  | 'theme_dark'
  | 'theme_auto'
  | 'exported'
  | 'imported'
  | 'import_error'
  | 'invalid_file'
  | 'confirm_reset'
  | 'data_reset'
  | 'word_saved'
  | 'word_deleted'
  | 'word_updated'
  | 'fill_required'
  | 'import_mode'
  | 'overwrite'
  | 'merge'
  | 'overwrite_desc'
  | 'merge_desc'
  | 'select_system'
  | 'select_goal'
  | 'select_mode'
  | 'select_theme'
  | 'select_lang'
  | 'word_detail'
  | 'level'
  | 'repetitions'
  | 'created'
  | 'last_review'
  | 'next_review'
  | 'never'
  | 'en_to_tr'
  | 'tr_to_en'
  | 'mixed'
  | 'free_today'
  | 'has_reviews'
  | 'has_overdue'
  | 'review_summary'
  | 'xp_label'
  | 'level_label'
  | 'streak_label'
  | 'streak_best'
  | 'level_up'
  | 'level_up_desc'
  | 'perfect_day'
  | 'perfect_day_desc'
  | 'badges'
  | 'badges_empty'
  | 'badge_unlocked'
  | 'badge_first_word'
  | 'badge_first_word_desc'
  | 'badge_first_review'
  | 'badge_first_review_desc'
  | 'badge_words_10'
  | 'badge_words_10_desc'
  | 'badge_words_50'
  | 'badge_words_50_desc'
  | 'badge_words_100'
  | 'badge_words_100_desc'
  | 'badge_mastered_5'
  | 'badge_mastered_5_desc'
  | 'badge_mastered_25'
  | 'badge_mastered_25_desc'
  | 'badge_streak_3'
  | 'badge_streak_3_desc'
  | 'badge_streak_7'
  | 'badge_streak_7_desc'
  | 'badge_streak_30'
  | 'badge_streak_30_desc'
  | 'badge_level_5'
  | 'badge_level_5_desc'
  | 'badge_level_10'
  | 'badge_level_10_desc'
  | 'badge_perfect_day'
  | 'badge_perfect_day_desc'
  | 'badge_polyglot'
  | 'badge_polyglot_desc'
  | 'avatar_style'
  | 'avatar_shuffle'
  | 'xp_earned'
  | 'xp_to_next'
  | 'delete_word_confirm';

type Dictionary = Readonly<Record<TranslationKey, string>>;

const tr: Dictionary = {
  ob_welcome_title: "Lexica'ya Hoş Geldin!",
  ob_welcome_desc:
    'Aralıklı tekrar yöntemiyle İngilizce kelimeleri kalıcı olarak öğren. Hadi başlayalım.',
  ob_start: 'Başlayalım',
  ob_profile_title: 'Seni nasıl çağıralım?',
  ob_profile_desc: 'Adını ve avatarını seç — istediğin zaman ayarlardan değiştirebilirsin.',
  ob_profile_name_label: 'İsmin',
  ob_profile_name_placeholder: 'Örn. Mert',
  ob_profile_avatar_label: 'Avatar stili',
  ob_profile_shuffle: 'Karıştır',
  ob_system_title: 'Tekrar Sistemi',
  ob_system_desc: 'Kelimelerin ne sıklıkla tekrar edileceğini seç.',
  ob_sys_default: 'Varsayılan (1-3-7-14-30-60-90-180)',
  ob_sys_aggressive: 'Yoğun (1-2-4-7-14-30-60)',
  ob_sys_relaxed: 'Rahat (1-3-10-30-60-120)',
  ob_next: 'Devam',
  ob_back: 'Geri',
  ob_goal_title: 'Günlük Hedef',
  ob_goal_desc: 'Her gün kaç kelime tekrar etmek istersin?',
  ob_mode_title: 'Öğrenme Modu',
  ob_mode_desc: 'Tekrar yaparken hangi yönü görmek istersin?',
  ob_mode_en: 'İngilizce → Türkçe',
  ob_mode_tr: 'Türkçe → İngilizce',
  ob_mode_mix: 'Karışık',
  ob_finish: 'Hazırım!',
  dash_hello: 'Merhaba! 👋',
  dash_hello_named: 'Merhaba, {name}! 👋',
  daily_goal: 'Günlük Hedef',
  total_words: 'Toplam Kelime',
  today_review: 'Bugün Tekrar',
  overdue: 'Geciken',
  upcoming: 'Yaklaşan',
  quick_actions: 'Hızlı İşlemler',
  add_word_desc: 'Yeni bir kelime ekle',
  nav_home: 'Ana Sayfa',
  nav_words: 'Kelimeler',
  nav_review: 'Tekrar',
  nav_settings: 'Ayarlar',
  settings: 'Ayarlar',
  sg_learning: 'Öğrenme',
  sg_appearance: 'Görünüm',
  sg_data: 'Veri',
  sg_profile: 'Profil',
  repetition_system: 'Tekrar Sistemi',
  learning_mode: 'Öğrenme Modu',
  theme: 'Tema',
  language: 'Dil',
  animations: 'Animasyonlar',
  export: 'Dışa Aktar',
  import: 'İçe Aktar',
  reset_data: 'Tüm Verileri Sil',
  profile_name: 'Ad',
  profile_avatar: 'Avatar',
  profile_edit: 'Düzenle',
  search_placeholder: 'Kelime ara...',
  add_word: 'Kelime Ekle',
  edit_word: 'Kelimeyi Düzenle',
  english: 'İngilizce',
  turkish: 'Türkçe',
  example: 'Örnek Cümle',
  notes: 'Notlar',
  save: 'Kaydet',
  delete: 'Sil',
  cancel: 'İptal',
  all: 'Tümü',
  new_w: 'Yeni',
  learning: 'Öğreniliyor',
  mastered: 'Öğrenildi',
  filter_overdue: 'Geciken',
  no_words: 'Henüz kelime yok',
  no_words_desc: 'İlk kelimeni ekleyerek başla!',
  add_first: 'İlk Kelimeni Ekle',
  no_review: 'Bugün tekrarın yok',
  no_review_desc: 'Tüm tekrarlarını tamamladın! Yeni kelime ekleyebilirsin.',
  start_review: 'Tekrara Başla',
  reviews_left: 'tekrar kaldı',
  overdue_msg: 'kelimen gecikmiş',
  tap_to_reveal: 'Cevabı görmek için dokun',
  again: 'Tekrar',
  hard: 'Zor',
  good: 'İyi',
  easy: 'Kolay',
  day_1: '1 gün',
  days: 'gün',
  review_done: 'Tebrikler! 🎉',
  review_done_desc: 'Bu oturumun tekrarlarını tamamladın.',
  reviewed: 'Tekrarlanan',
  back_home: 'Ana Sayfaya Dön',
  today: 'Bugün',
  tomorrow: 'Yarın',
  days_left: 'gün kaldı',
  days_overdue: 'gün gecikti',
  default_sys: 'Varsayılan',
  aggressive_sys: 'Yoğun',
  relaxed_sys: 'Rahat',
  theme_light: 'Açık',
  theme_dark: 'Koyu',
  theme_auto: 'Otomatik',
  exported: 'Veriler dışa aktarıldı',
  imported: 'Veriler içe aktarıldı',
  import_error: 'İçe aktarma hatası',
  invalid_file: 'Geçersiz dosya formatı',
  confirm_reset: 'Tüm verileri silmek istediğinizden emin misiniz?',
  data_reset: 'Tüm veriler silindi',
  word_saved: 'Kelime kaydedildi',
  word_deleted: 'Kelime silindi',
  word_updated: 'Kelime güncellendi',
  fill_required: 'İngilizce ve Türkçe alanları zorunludur',
  import_mode: 'İçe Aktarma Modu',
  overwrite: 'Üzerine Yaz',
  merge: 'Birleştir',
  overwrite_desc: 'Mevcut tüm verileri siler, yenilerle değiştirir.',
  merge_desc: 'Mevcut kelimeleri korur, yenileri ekler.',
  select_system: 'Tekrar Sistemi Seç',
  select_goal: 'Günlük Hedef Seç',
  select_mode: 'Öğrenme Modu Seç',
  select_theme: 'Tema Seç',
  select_lang: 'Dil Seç',
  word_detail: 'Kelime Detayı',
  level: 'Seviye',
  repetitions: 'Tekrar Sayısı',
  created: 'Eklenme',
  last_review: 'Son Tekrar',
  next_review: 'Sonraki Tekrar',
  never: 'Henüz yok',
  en_to_tr: 'EN → TR',
  tr_to_en: 'TR → EN',
  mixed: 'Karışık',
  free_today: 'Bugün boşsun, yeni kelime ekle!',
  has_reviews: 'tekrarın var',
  has_overdue: 'kelimen gecikmiş, hemen tekrar et!',
  review_summary: 'Tekrar Özeti',
  xp_label: 'XP',
  level_label: 'Seviye',
  streak_label: 'Seri',
  streak_best: 'En İyi',
  level_up: 'Seviye Atladın!',
  level_up_desc: 'Tebrikler, yeni seviyen:',
  perfect_day: 'Mükemmel Gün!',
  perfect_day_desc: 'Hiç "tekrar" demeden hedefini tamamladın.',
  badges: 'Rozetler',
  badges_empty: 'Henüz rozet yok. Tekrar yaparak kazanmaya başla!',
  badge_unlocked: 'Rozet kazandın',
  badge_first_word: 'İlk Kelime',
  badge_first_word_desc: 'İlk kelimeni ekledin.',
  badge_first_review: 'İlk Tekrar',
  badge_first_review_desc: 'İlk tekrarını tamamladın.',
  badge_words_10: 'Koleksiyoner',
  badge_words_10_desc: '10 kelimeye ulaştın.',
  badge_words_50: 'Kütüphaneci',
  badge_words_50_desc: '50 kelimeye ulaştın.',
  badge_words_100: 'Sözlük Ustası',
  badge_words_100_desc: '100 kelimeye ulaştın.',
  badge_mastered_5: 'İlk Hasat',
  badge_mastered_5_desc: '5 kelimeyi tam öğrendin.',
  badge_mastered_25: 'Usta',
  badge_mastered_25_desc: '25 kelimeyi tam öğrendin.',
  badge_streak_3: 'Kıvılcım',
  badge_streak_3_desc: '3 gün üst üste tekrar yaptın.',
  badge_streak_7: 'Alev',
  badge_streak_7_desc: '7 gün üst üste tekrar yaptın.',
  badge_streak_30: 'Kor',
  badge_streak_30_desc: '30 gün üst üste tekrar yaptın.',
  badge_level_5: 'Yıldız',
  badge_level_5_desc: '5. seviyeye ulaştın.',
  badge_level_10: 'Süper Yıldız',
  badge_level_10_desc: '10. seviyeye ulaştın.',
  badge_perfect_day: 'Kusursuz',
  badge_perfect_day_desc: 'Bir günü hiç hata yapmadan bitirdin.',
  badge_polyglot: 'Çok Dilli',
  badge_polyglot_desc: 'Karışık modda 20 tekrar yaptın.',
  avatar_style: 'Avatar stili',
  avatar_shuffle: 'Avatarı karıştır',
  xp_earned: 'kazanıldı',
  xp_to_next: 'sonraki seviyeye',
  delete_word_confirm: 'Bu kelimeyi silmek istediğinizden emin misiniz?',
};

const en: Dictionary = {
  ob_welcome_title: 'Welcome to Lexica!',
  ob_welcome_desc:
    "Learn English vocabulary permanently with spaced repetition. Let's get started.",
  ob_start: "Let's Start",
  ob_profile_title: 'What should we call you?',
  ob_profile_desc: 'Pick a name and avatar — you can change them any time in settings.',
  ob_profile_name_label: 'Your name',
  ob_profile_name_placeholder: 'e.g. Alex',
  ob_profile_avatar_label: 'Avatar style',
  ob_profile_shuffle: 'Shuffle',
  ob_system_title: 'Repetition System',
  ob_system_desc: 'Choose how often words will be repeated.',
  ob_sys_default: 'Default (1-3-7-14-30-60-90-180)',
  ob_sys_aggressive: 'Intensive (1-2-4-7-14-30-60)',
  ob_sys_relaxed: 'Relaxed (1-3-10-30-60-120)',
  ob_next: 'Continue',
  ob_back: 'Back',
  ob_goal_title: 'Daily Goal',
  ob_goal_desc: 'How many words do you want to review each day?',
  ob_mode_title: 'Learning Mode',
  ob_mode_desc: 'Which side do you want to see during review?',
  ob_mode_en: 'English → Turkish',
  ob_mode_tr: 'Turkish → English',
  ob_mode_mix: 'Mixed',
  ob_finish: "I'm Ready!",
  dash_hello: 'Hello! 👋',
  dash_hello_named: 'Hello, {name}! 👋',
  daily_goal: 'Daily Goal',
  total_words: 'Total Words',
  today_review: "Today's Reviews",
  overdue: 'Overdue',
  upcoming: 'Upcoming',
  quick_actions: 'Quick Actions',
  add_word_desc: 'Add a new word',
  nav_home: 'Home',
  nav_words: 'Words',
  nav_review: 'Review',
  nav_settings: 'Settings',
  settings: 'Settings',
  sg_learning: 'Learning',
  sg_appearance: 'Appearance',
  sg_data: 'Data',
  sg_profile: 'Profile',
  repetition_system: 'Repetition System',
  learning_mode: 'Learning Mode',
  theme: 'Theme',
  language: 'Language',
  animations: 'Animations',
  export: 'Export',
  import: 'Import',
  reset_data: 'Delete All Data',
  profile_name: 'Name',
  profile_avatar: 'Avatar',
  profile_edit: 'Edit',
  search_placeholder: 'Search words...',
  add_word: 'Add Word',
  edit_word: 'Edit Word',
  english: 'English',
  turkish: 'Turkish',
  example: 'Example Sentence',
  notes: 'Notes',
  save: 'Save',
  delete: 'Delete',
  cancel: 'Cancel',
  all: 'All',
  new_w: 'New',
  learning: 'Learning',
  mastered: 'Mastered',
  filter_overdue: 'Overdue',
  no_words: 'No words yet',
  no_words_desc: 'Start by adding your first word!',
  add_first: 'Add Your First Word',
  no_review: 'No reviews for today',
  no_review_desc: "You've completed all your reviews! You can add new words.",
  start_review: 'Start Review',
  reviews_left: 'reviews left',
  overdue_msg: 'words are overdue',
  tap_to_reveal: 'Tap to reveal the answer',
  again: 'Again',
  hard: 'Hard',
  good: 'Good',
  easy: 'Easy',
  day_1: '1 day',
  days: 'days',
  review_done: 'Congratulations! 🎉',
  review_done_desc: "You've completed this session's reviews.",
  reviewed: 'Reviewed',
  back_home: 'Back to Home',
  today: 'Today',
  tomorrow: 'Tomorrow',
  days_left: 'days left',
  days_overdue: 'days overdue',
  default_sys: 'Default',
  aggressive_sys: 'Intensive',
  relaxed_sys: 'Relaxed',
  theme_light: 'Light',
  theme_dark: 'Dark',
  theme_auto: 'Auto',
  exported: 'Data exported',
  imported: 'Data imported',
  import_error: 'Import error',
  invalid_file: 'Invalid file format',
  confirm_reset: 'Are you sure you want to delete all data?',
  data_reset: 'All data deleted',
  word_saved: 'Word saved',
  word_deleted: 'Word deleted',
  word_updated: 'Word updated',
  fill_required: 'English and Turkish fields are required',
  import_mode: 'Import Mode',
  overwrite: 'Overwrite',
  merge: 'Merge',
  overwrite_desc: 'Deletes all existing data and replaces with new.',
  merge_desc: 'Keeps existing words and adds new ones.',
  select_system: 'Select Repetition System',
  select_goal: 'Select Daily Goal',
  select_mode: 'Select Learning Mode',
  select_theme: 'Select Theme',
  select_lang: 'Select Language',
  word_detail: 'Word Detail',
  level: 'Level',
  repetitions: 'Repetitions',
  created: 'Created',
  last_review: 'Last Review',
  next_review: 'Next Review',
  never: 'Not yet',
  en_to_tr: 'EN → TR',
  tr_to_en: 'TR → EN',
  mixed: 'Mixed',
  free_today: "You're free today, add new words!",
  has_reviews: 'reviews to do',
  has_overdue: 'words are overdue, review now!',
  review_summary: 'Review Summary',
  xp_label: 'XP',
  level_label: 'Level',
  streak_label: 'Streak',
  streak_best: 'Best',
  level_up: 'Level Up!',
  level_up_desc: 'Congratulations, your new level:',
  perfect_day: 'Perfect Day!',
  perfect_day_desc: 'You completed your goal without a single "again".',
  badges: 'Badges',
  badges_empty: 'No badges yet. Keep reviewing to earn them!',
  badge_unlocked: 'Badge unlocked',
  badge_first_word: 'First Word',
  badge_first_word_desc: 'You added your first word.',
  badge_first_review: 'First Review',
  badge_first_review_desc: 'You completed your first review.',
  badge_words_10: 'Collector',
  badge_words_10_desc: 'You reached 10 words.',
  badge_words_50: 'Librarian',
  badge_words_50_desc: 'You reached 50 words.',
  badge_words_100: 'Lexicographer',
  badge_words_100_desc: 'You reached 100 words.',
  badge_mastered_5: 'First Harvest',
  badge_mastered_5_desc: 'You mastered 5 words.',
  badge_mastered_25: 'Master',
  badge_mastered_25_desc: 'You mastered 25 words.',
  badge_streak_3: 'Spark',
  badge_streak_3_desc: 'You reviewed 3 days in a row.',
  badge_streak_7: 'Blaze',
  badge_streak_7_desc: 'You reviewed 7 days in a row.',
  badge_streak_30: 'Inferno',
  badge_streak_30_desc: 'You reviewed 30 days in a row.',
  badge_level_5: 'Star',
  badge_level_5_desc: 'You reached level 5.',
  badge_level_10: 'Superstar',
  badge_level_10_desc: 'You reached level 10.',
  badge_perfect_day: 'Flawless',
  badge_perfect_day_desc: 'You cleared a day without a single mistake.',
  badge_polyglot: 'Polyglot',
  badge_polyglot_desc: 'You did 20 mixed-mode reviews.',
  avatar_style: 'Avatar style',
  avatar_shuffle: 'Shuffle avatar',
  xp_earned: 'earned',
  xp_to_next: 'to next level',
  delete_word_confirm: 'Are you sure you want to delete this word?',
};

export const DICTIONARY: Readonly<Record<Language, Dictionary>> = { tr, en };

export function translate(lang: Language, key: TranslationKey): string {
  return DICTIONARY[lang][key] ?? DICTIONARY.tr[key] ?? key;
}

// interpolate replaces {token} occurrences with values from the params
// object. Missing tokens are left intact to make the bug obvious during
// development instead of silently blanking out.
export function interpolate(
  template: string,
  params: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key];
    return value === undefined ? match : String(value);
  });
}

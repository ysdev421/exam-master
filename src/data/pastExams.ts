import type { Question } from '../types';

export interface PastExamSet {
  id: string;
  label: string;
  year: number;
  season: 'Spring' | 'Autumn';
  sourceUrl: string;
}

export const pastExamSets: PastExamSet[] = [
  {
    id: 'fe-2023-spring-sample',
    label: '令和5年 春 公開問題セット',
    year: 2023,
    season: 'Spring',
    sourceUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
  },
  {
    id: 'fe-2022-autumn-sample',
    label: '令和4年 秋 公開問題セット',
    year: 2022,
    season: 'Autumn',
    sourceUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
  },
];

export const pastExamQuestionDatabase: Record<string, Question[]> = {
  'fe-2023-spring-sample': [
    {
      id: 9001,
      question: '2進数 101101 を10進数に変換した値はどれか。',
      answers: ['43', '45', '53', '57'],
      correct: 1,
      explanation: '101101(2) = 32 + 8 + 4 + 1 = 45。',
      hint: '桁ごとの重みを足し合わせる。',
      source: {
        setId: 'fe-2023-spring-sample',
        label: '令和5年 春 公開問題',
        year: 2023,
        questionNo: 'Q1',
        url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
      },
    },
    {
      id: 9002,
      question: 'LAN で同一セグメント内のIPアドレスからMACアドレスを求めるプロトコルはどれか。',
      answers: ['DNS', 'ARP', 'DHCP', 'ICMP'],
      correct: 1,
      explanation: 'ARP は IP アドレスから MAC アドレスへの解決を行う。',
      source: {
        setId: 'fe-2023-spring-sample',
        label: '令和5年 春 公開問題',
        year: 2023,
        questionNo: 'Q2',
        url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
      },
    },
    {
      id: 9003,
      question: 'データベースの正規化の目的として適切なものはどれか。',
      answers: ['データの重複排除と更新異常の防止', '検索速度だけを最大化する', '暗号化を実現する', 'バックアップを不要にする'],
      correct: 0,
      explanation: '正規化は重複や更新異常を抑えて整合性を高める。',
      source: {
        setId: 'fe-2023-spring-sample',
        label: '令和5年 春 公開問題',
        year: 2023,
        questionNo: 'Q3',
        url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
      },
    },
    {
      id: 9004,
      question: '公開鍵暗号方式で秘密鍵を用いる主な処理はどれか。',
      answers: ['復号と署名生成', '暗号化のみ', '圧縮のみ', '鍵交換のみ'],
      correct: 0,
      explanation: '秘密鍵は公開鍵で暗号化されたデータの復号や署名生成に使う。',
      source: {
        setId: 'fe-2023-spring-sample',
        label: '令和5年 春 公開問題',
        year: 2023,
        questionNo: 'Q4',
        url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
      },
    },
  ],
  'fe-2022-autumn-sample': [
    {
      id: 9101,
      question: 'クラスCのプライベートIPアドレス範囲として適切なものはどれか。',
      answers: ['10.0.0.0 - 10.255.255.255', '172.16.0.0 - 172.31.255.255', '192.168.0.0 - 192.168.255.255', '169.254.0.0 - 169.254.255.255'],
      correct: 2,
      explanation: 'クラスC相当のプライベート範囲は 192.168.0.0/16。',
      source: {
        setId: 'fe-2022-autumn-sample',
        label: '令和4年 秋 公開問題',
        year: 2022,
        questionNo: 'Q1',
        url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
      },
    },
    {
      id: 9102,
      question: '線形探索の最悪計算量として適切なものはどれか。',
      answers: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct: 2,
      explanation: '末尾まで探索する可能性があるため最悪は O(n)。',
      source: {
        setId: 'fe-2022-autumn-sample',
        label: '令和4年 秋 公開問題',
        year: 2022,
        questionNo: 'Q2',
        url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
      },
    },
    {
      id: 9103,
      question: 'トランザクションのACID特性のうち一貫性を示すものはどれか。',
      answers: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correct: 1,
      explanation: 'Consistency は整合性を保つ性質を表す。',
      source: {
        setId: 'fe-2022-autumn-sample',
        label: '令和4年 秋 公開問題',
        year: 2022,
        questionNo: 'Q3',
        url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
      },
    },
    {
      id: 9104,
      question: 'CSRF攻撃対策として有効なものはどれか。',
      answers: ['CSRFトークンの検証', 'DNSキャッシュの削除', 'TLS証明書の更新', 'IPアドレス固定'],
      correct: 0,
      explanation: 'フォームごとにトークンを付与し検証するのが有効。',
      source: {
        setId: 'fe-2022-autumn-sample',
        label: '令和4年 秋 公開問題',
        year: 2022,
        questionNo: 'Q4',
        url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html',
      },
    },
  ],
};

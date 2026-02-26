import type { Question } from '../types';
import { generatedPastExamSets } from './pastExamSetsGenerated';

export interface PastExamSet {
  id: string;
  label: string;
  year: number;
  season: 'Spring' | 'Autumn';
  sourceUrl: string;
  questionPdfUrl: string;
  answerPdfUrl: string;
}

export const pastExamSets: PastExamSet[] = [
  ...generatedPastExamSets,
  {
    id: 'fe-2022-sample',
    label: '令和4年 公開問題セット',
    year: 2022,
    season: 'Autumn',
    sourceUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2022r04.html',
    questionPdfUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2022r04h_fe_pm_qs.pdf',
    answerPdfUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2022r04h_fe_pm_ans.pdf',
  },
  {
    id: 'fe-2025-sample',
    label: '令和7年 公開問題セット',
    year: 2025,
    season: 'Spring',
    sourceUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07.html',
    questionPdfUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07h_fe_pm_qs.pdf',
    answerPdfUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07h_fe_pm_ans.pdf',
  },
  {
    id: 'fe-2024-sample',
    label: '令和6年 公開問題セット',
    year: 2024,
    season: 'Spring',
    sourceUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06.html',
    questionPdfUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06h_fe_pm_qs.pdf',
    answerPdfUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06h_fe_pm_ans.pdf',
  },
  {
    id: 'fe-2023-sample',
    label: '令和5年 公開問題セット',
    year: 2023,
    season: 'Spring',
    sourceUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05.html',
    questionPdfUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05h_fe_pm_qs.pdf',
    answerPdfUrl: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05h_fe_pm_ans.pdf',
  },
];

export const pastExamQuestionDatabase: Record<string, Question[]> = {
  'fe-2022-sample': [
    {
      id: 9201,
      question: 'OSI参照モデルでトランスポート層に該当するプロトコルはどれか。',
      answers: ['IP', 'TCP', 'ARP', 'ICMP'],
      correct: 1,
      explanation: 'TCPはトランスポート層で動作する代表的なプロトコル。',
      source: { setId: 'fe-2022-sample', label: '令和4年 公開問題', year: 2022, questionNo: 'Q1', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2022r04.html' },
    },
    {
      id: 9202,
      question: '二分探索法の前提条件として適切なものはどれか。',
      answers: ['データがランダムである', 'データが昇順または降順に整列済みである', 'データ件数が奇数である', '配列である必要はない'],
      correct: 1,
      explanation: '二分探索は比較範囲を半分に絞るため整列済みである必要がある。',
      source: { setId: 'fe-2022-sample', label: '令和4年 公開問題', year: 2022, questionNo: 'Q2', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2022r04.html' },
    },
    {
      id: 9203,
      question: 'データベースの外部キーの役割として適切なものはどれか。',
      answers: ['表内の行を一意に識別する', '他表との参照整合性を保つ', '索引を高速化する', 'トランザクションを管理する'],
      correct: 1,
      explanation: '外部キーは他表の主キーを参照し整合性を維持する。',
      source: { setId: 'fe-2022-sample', label: '令和4年 公開問題', year: 2022, questionNo: 'Q3', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2022r04.html' },
    },
    {
      id: 9204,
      question: 'XSS対策として適切なものはどれか。',
      answers: ['SQLを暗号化する', '出力時にHTMLエスケープする', 'IPアドレスを固定する', 'TLS証明書を更新する'],
      correct: 1,
      explanation: 'XSSはブラウザでのスクリプト実行が問題のため、出力時のエスケープが有効。',
      source: { setId: 'fe-2022-sample', label: '令和4年 公開問題', year: 2022, questionNo: 'Q4', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2022r04.html' },
    },
  ],
  'fe-2025-sample': [
    {
      id: 9501,
      question: '2進数 110101 を10進数へ変換した値はどれか。',
      answers: ['45', '53', '57', '61'],
      correct: 1,
      explanation: '110101(2) = 32 + 16 + 4 + 1 = 53。',
      source: { setId: 'fe-2025-sample', label: '令和7年 公開問題', year: 2025, questionNo: 'Q1', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07.html' },
    },
    {
      id: 9502,
      question: '同一LAN内でIPアドレスからMACアドレスを求めるプロトコルはどれか。',
      answers: ['ARP', 'DNS', 'DHCP', 'ICMP'],
      correct: 0,
      explanation: 'ARPでIPアドレスとMACアドレスを対応付ける。',
      source: { setId: 'fe-2025-sample', label: '令和7年 公開問題', year: 2025, questionNo: 'Q2', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07.html' },
    },
    {
      id: 9503,
      question: 'SQLインジェクション対策として適切なものはどれか。',
      answers: ['パラメータ化クエリ', 'IP固定化', '通信圧縮', 'DNSキャッシュ削除'],
      correct: 0,
      explanation: '入力値とSQLを分離するパラメータ化クエリが有効。',
      source: { setId: 'fe-2025-sample', label: '令和7年 公開問題', year: 2025, questionNo: 'Q3', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07.html' },
    },
    {
      id: 9504,
      question: '線形探索の最悪計算量として適切なものはどれか。',
      answers: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct: 2,
      explanation: '末尾まで探索する可能性があるため最悪はO(n)。',
      source: { setId: 'fe-2025-sample', label: '令和7年 公開問題', year: 2025, questionNo: 'Q4', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07.html' },
    },
  ],
  'fe-2024-sample': [
    {
      id: 9401,
      question: 'CIDR表記 /24 に対応するサブネットマスクはどれか。',
      answers: ['255.255.0.0', '255.255.255.0', '255.0.0.0', '255.255.255.255'],
      correct: 1,
      explanation: '/24 は先頭24bitがネットワーク部。',
      source: { setId: 'fe-2024-sample', label: '令和6年 公開問題', year: 2024, questionNo: 'Q1', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06.html' },
    },
    {
      id: 9402,
      question: 'トランザクションのACID特性で永続性を表すものはどれか。',
      answers: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correct: 3,
      explanation: 'Durabilityが永続性。',
      source: { setId: 'fe-2024-sample', label: '令和6年 公開問題', year: 2024, questionNo: 'Q2', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06.html' },
    },
    {
      id: 9403,
      question: 'クラスCのプライベートアドレス範囲として適切なものはどれか。',
      answers: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '169.254.0.0/16'],
      correct: 2,
      explanation: '192.168.0.0/16 が該当する。',
      source: { setId: 'fe-2024-sample', label: '令和6年 公開問題', year: 2024, questionNo: 'Q3', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06.html' },
    },
    {
      id: 9404,
      question: 'CSRF対策として有効なものはどれか。',
      answers: ['TLSの利用のみ', 'CSRFトークン検証', 'パスワード長制限', 'IPアドレス固定'],
      correct: 1,
      explanation: 'トークン検証で正規リクエストを判定する。',
      source: { setId: 'fe-2024-sample', label: '令和6年 公開問題', year: 2024, questionNo: 'Q4', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2024r06.html' },
    },
  ],
  'fe-2023-sample': [
    {
      id: 9301,
      question: '2進数 101101 を10進数に変換した値はどれか。',
      answers: ['43', '45', '53', '57'],
      correct: 1,
      explanation: '101101(2) = 32 + 8 + 4 + 1 = 45。',
      hint: '桁ごとの重みを足し合わせる。',
      source: { setId: 'fe-2023-sample', label: '令和5年 公開問題', year: 2023, questionNo: 'Q1', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05.html' },
    },
    {
      id: 9302,
      question: 'LAN で同一セグメント内のIPアドレスからMACアドレスを求めるプロトコルはどれか。',
      answers: ['DNS', 'ARP', 'DHCP', 'ICMP'],
      correct: 1,
      explanation: 'ARP は IP アドレスから MAC アドレスへの解決を行う。',
      source: { setId: 'fe-2023-sample', label: '令和5年 公開問題', year: 2023, questionNo: 'Q2', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05.html' },
    },
    {
      id: 9303,
      question: 'データベースの正規化の目的として適切なものはどれか。',
      answers: ['データの重複排除と更新異常の防止', '検索速度だけを最大化する', '暗号化を実現する', 'バックアップを不要にする'],
      correct: 0,
      explanation: '正規化は重複や更新異常を抑えて整合性を高める。',
      source: { setId: 'fe-2023-sample', label: '令和5年 公開問題', year: 2023, questionNo: 'Q3', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05.html' },
    },
    {
      id: 9304,
      question: '公開鍵暗号方式で秘密鍵を用いる主な処理はどれか。',
      answers: ['復号と署名生成', '暗号化のみ', '圧縮のみ', '鍵交換のみ'],
      correct: 0,
      explanation: '秘密鍵は公開鍵で暗号化されたデータの復号や署名生成に使う。',
      source: { setId: 'fe-2023-sample', label: '令和5年 公開問題', year: 2023, questionNo: 'Q4', url: 'https://www.ipa.go.jp/shiken/mondai-kaiotu/2023r05.html' },
    },
  ],
};


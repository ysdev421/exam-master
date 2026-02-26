import React from 'react';
import { Lightbulb } from 'lucide-react';

interface Props {
  diagramType: string;
}

export default function DiagramViewer({ diagramType }: Props) {
  const diagrams: Record<string, React.ReactNode> = {
    'merge-sort': (
      <div className="space-y-3 text-sm">
        <div className="flex gap-2 flex-wrap justify-center">
          {[3,1,4,1,5,9,2,6].map((num, i) => (
            <div key={i} className="w-10 h-10 bg-blue-400 rounded flex items-center justify-center font-bold">{num}</div>
          ))}
        </div>
        <div className="text-center text-gray-300">↓ 分割・統治</div>
        <div className="flex gap-2 flex-wrap justify-center">
          {[1,1,2,3,4,5,6,9].map((num, i) => (
            <div key={i} className="w-10 h-10 bg-emerald-400 rounded flex items-center justify-center font-bold">{num}</div>
          ))}
        </div>
      </div>
    ),
    'stack': (
      <div className="space-y-2 flex flex-col items-center">
        <div className="text-sm font-bold text-gray-300">スタック（LIFO）</div>
        <div className="space-y-1">
          <div className="w-24 h-8 bg-red-400 rounded flex items-center justify-center font-bold">3 ← top</div>
          <div className="w-24 h-8 bg-orange-400 rounded flex items-center justify-center font-bold">2</div>
          <div className="w-24 h-8 bg-yellow-400 rounded flex items-center justify-center font-bold">1</div>
        </div>
        <div className="text-xs text-gray-400">Push: 1,2,3 → Pop: 3,2,1</div>
      </div>
    ),
    'queue': (
      <div className="space-y-2 flex flex-col items-center">
        <div className="text-sm font-bold text-gray-300">キュー（FIFO）</div>
        <div className="flex gap-1">
          <div className="w-12 h-12 bg-yellow-400 rounded flex items-center justify-center font-bold text-sm">1</div>
          <div className="w-12 h-12 bg-orange-400 rounded flex items-center justify-center font-bold text-sm">2</div>
          <div className="w-12 h-12 bg-red-400 rounded flex items-center justify-center font-bold text-sm">3</div>
        </div>
        <div className="text-xs text-gray-400">← Dequeue | Enqueue →</div>
      </div>
    ),
    'osi-model': (
      <div className="space-y-1 text-xs font-mono w-full">
        {['7. アプリケーション', '6. プレゼンテーション', '5. セッション', '4. トランスポート', '3. ネットワーク(IP)', '2. データリンク', '1. 物理'].map((layer, i) => (
          <div key={i} className={`px-3 py-1 rounded text-center ${i < 3 ? 'bg-blue-600' : i < 4 ? 'bg-green-600' : 'bg-purple-600'}`}>
            {layer}
          </div>
        ))}
      </div>
    ),
    'subnet-mask': (
      <div className="space-y-2 text-sm text-center">
        <div className="text-gray-300">IP: <span className="text-cyan-300 font-mono">192.168.1.100</span></div>
        <div className="text-gray-300">Mask: <span className="text-yellow-300 font-mono">255.255.255.0</span></div>
        <div className="text-emerald-300 font-bold">Network: 192.168.1.0/24</div>
        <div className="text-gray-400 text-xs">利用可能ホスト: 254台</div>
      </div>
    ),
    'public-key': (
      <div className="space-y-3 text-xs">
        <div className="flex gap-2 justify-between items-center">
          <div className="bg-blue-700 rounded p-2 flex-1 text-center">公開鍵で暗号化</div>
          <div className="text-gray-400">→</div>
          <div className="bg-red-700 rounded p-2 flex-1 text-center">秘密鍵で復号</div>
        </div>
        <div className="flex gap-2 justify-between items-center">
          <div className="bg-red-700 rounded p-2 flex-1 text-center">秘密鍵で署名</div>
          <div className="text-gray-400">→</div>
          <div className="bg-blue-700 rounded p-2 flex-1 text-center">公開鍵で検証</div>
        </div>
      </div>
    ),
    'cpu-cache': (
      <div className="space-y-2 text-xs w-full">
        {[
          { label: 'L1 キャッシュ（最速・最小）', color: 'bg-yellow-500' },
          { label: 'L2 キャッシュ', color: 'bg-orange-500' },
          { label: 'L3 キャッシュ', color: 'bg-red-500' },
          { label: 'メインメモリ（最低速・最大）', color: 'bg-blue-500' },
        ].map((item, i) => (
          <div key={i} className={`px-3 py-2 rounded text-center font-bold ${item.color}`} style={{ width: `${60 + i * 10}%`, margin: '0 auto' }}>
            {item.label}
          </div>
        ))}
      </div>
    ),
    'default': (
      <div className="text-center text-gray-400 flex flex-col items-center gap-2">
        <Lightbulb className="opacity-50" size={32} />
        <p className="text-sm">図解は準備中です</p>
      </div>
    ),
  };

  return <>{diagrams[diagramType] ?? diagrams['default']}</>;
}

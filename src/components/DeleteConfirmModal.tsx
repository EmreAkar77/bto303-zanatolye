'use client';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  hasRegistrations?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  itemName,
  hasRegistrations = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-100">
        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-4 border border-red-100">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          <span className="font-semibold text-slate-900">{itemName}</span> kaydını kalıcı olarak silmek istediğinizden emin misiniz?
        </p>

        {hasRegistrations && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-900 flex items-start gap-2">
            <span className="font-bold">⚠️ Bütünlük Uyarısı:</span>
            <span>
              Bu kayda bağlı aktif ilişkili kayıtlar bulunmaktadır. Prisma kısıtı (<code className="font-mono text-2xs bg-amber-100 px-1 py-0.5 rounded">onDelete: Restrict</code>) gereğince ilişkili kayıt varken silinemez.
            </span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-2xs"
          >
            Evet, Sil
          </button>
        </div>
      </div>
    </div>
  );
}

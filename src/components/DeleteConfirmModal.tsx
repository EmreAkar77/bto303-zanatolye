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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 transform transition-all animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>
        
        <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
          <strong className="text-neutral-900 font-semibold">{itemName}</strong> kaydını silmek üzeresiniz.
        </p>

        {hasRegistrations && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800 flex items-start gap-2">
            <span className="font-bold">⚠️ Uyarı:</span>
            <span>
              Bu atölyede aktif katılımcı kayıtları bulunmaktadır. İlişkisel kısıt (<code className="font-mono">onDelete: Restrict</code>) gereğince geçmiş kaydı olan atölyeler silinemez.
            </span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs"
          >
            Evet, Sil
          </button>
        </div>
      </div>
    </div>
  );
}

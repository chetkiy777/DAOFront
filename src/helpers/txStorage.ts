export const TX_STORAGE_KEY = "pending_transactions";

type StoredTx = {
    hash: string;
    chainId: number;
    contract?: string;
    tag?: string; // e.g. "createProposal"
    timestamp: number;
};

// Зберігає нову транзакцію, якщо її ще немає в списку
export function savePendingTx(tx: StoredTx) {
    const list = getTxs();
    const exists = list.find(t => t.hash === tx.hash);
    if (!exists) {
        list.push(tx);
        localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(list));
    }
}

// Отримує список збережених транзакцій
export function getTxs(): StoredTx[] {
    try {
        return JSON.parse(localStorage.getItem(TX_STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
}

// Видаляє транзакцію за її хешем
export function removePendingTx(hash: string) {
    const list = getTxs().filter(t => t.hash !== hash);
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(list));
}

// Очищає старі транзакції, які старші за maxAgeMinutes
export function clearOldTxs(maxAgeMinutes = 60) {
    const cutoff = Date.now() - maxAgeMinutes * 60_000;
    const fresh = getTxs().filter(t => t.timestamp > cutoff);
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(fresh));
}
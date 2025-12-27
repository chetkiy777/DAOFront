// typescript
import {useEffect, useRef, useState} from "react";
import {useCreateProposals} from "../../hooks/useCreateProposals.ts";

interface CreateProposalFormProps {
    open: boolean;
    onClose: () => void;
}

const errorMessages = {
    tx: 'Transaction error',
    validation: 'No description provided',
}

export function CreateProposalForm({open, onClose}: CreateProposalFormProps) {
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);

    const {
        handleCreateProposal,
        isSigning,
        error: txError,
        txHash,
    } = useCreateProposals();

    const prevIsSigning = useRef<boolean>(false);

    useEffect(() => {
        if (txHash) {
            console.log(txHash);
        }
    }, [txHash]);

    useEffect(() => {
        // Закрыть модалку только при переходе isSigning false -> true
        if (isSigning && !prevIsSigning.current) {
            onClose();
        }
        prevIsSigning.current = isSigning;
    }, [isSigning, onClose]);

    // Вычисляемое сообщение об ошибке: локальная валидация имеет приоритет
    const txErrorMessage =
        txError && typeof txError === 'object' && 'message' in txError
            ? String((txError as any).message)
            : txError ? errorMessages.tx : null;

    const displayError = error ?? txErrorMessage;

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!description.trim()) {
            setError(errorMessages.validation);
            return;
        }

        await handleCreateProposal([description]);
    }




    return (
        <div className="proposal-modal-overlay">
            <div className="proposal-modal-window">
                <form onSubmit={handleSubmit}>
                    <h2>Description: </h2>
                    <button type="button" onClick={onClose}>&times;</button>
                    {displayError && <p className="error-message">{displayError}</p>}
                    <input
                        id="proposal-description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        autoFocus
                        disabled={isSigning}
                    />
                    <button type="submit" disabled={isSigning}>
                        {isSigning ? 'Signing...' : 'Create Proposal'}
                    </button>
                </form>
            </div>
        </div>
    )
}

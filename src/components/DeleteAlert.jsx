import {useState} from "react";
import {LoaderCircle} from "lucide-react";
import {useTranslation} from "react-i18next";

const DeleteAlert = ({content, onDelete}) => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete();
        } finally {
            setLoading(false);
        }
    }

    return(
        <div>
            <p className="text-sm">{content}</p>
            <button
                type="button"
                className="inline-flex items-center gap-3 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleDelete}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <LoaderCircle className="animate-spin w-4 h-4" />
                        {t("deleteAlert.deleting")}
                    </>
                ) : (
                    <>
                        {t("deleteAlert.delete")}
                    </>
                )}
            </button>
        </div>
    )
}

export default DeleteAlert;
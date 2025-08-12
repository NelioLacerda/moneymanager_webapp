import {useState} from "react";
import {LoaderCircle} from "lucide-react";

const DeleteAlert = ({content, onDelete}) => {
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
            <button type="button" className="flex justify-end add-btn-fill" onClick={handleDelete}>
                {loading ? (
                    <>
                        <LoaderCircle className="animate-spin w-4 h-4" />
                        Deleting...
                    </>
                ) : (
                    <>
                        Delete
                    </>
                )}
            </button>
        </div>
    )
}

export default DeleteAlert;
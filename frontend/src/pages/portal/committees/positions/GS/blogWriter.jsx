import Modal from '@/components/modal';

export const BlogWriterModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (!isOpen) {
            setTitle("");
            setContent("");
            setImage(null);
        }

        const 
    }, [isOpen]);


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Write a Blog Post">
            <h1>hello there</h1>
        </Modal>
    )
};
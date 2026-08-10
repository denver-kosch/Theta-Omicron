import { useEffect, useState } from "react";
import Modal from "@/components/modal";
import type { BlogWriterProps } from "@/types";

export const BlogWriterModal = ({isOpen, onClose, onSubmit}: BlogWriterProps) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [tags, setTags] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setTitle("");
            setContent("");
            setImage(null);
            setTags("");
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Write a Blog Post">
            <form onSubmit={event => {
                event.preventDefault();
                onSubmit({title, content, image, tags: tags.split(",").map(tag => tag.trim()).filter(Boolean)});
            }}>
                <label htmlFor="blog-title">Title</label>
                <input id="blog-title" value={title} onChange={event => setTitle(event.target.value)} required/>
                <label htmlFor="blog-content">Content</label>
                <textarea id="blog-content" value={content} onChange={event => setContent(event.target.value)} required/>
                <label htmlFor="blog-image">Image</label>
                <input id="blog-image" type="file" accept="image/*" onChange={event => setImage(event.target.files?.[0] ?? null)}/>
                <label htmlFor="blog-tags">Tags</label>
                <input id="blog-tags" value={tags} onChange={event => setTags(event.target.value)} placeholder="news, alumni"/>
                <button type="submit">Save Post</button>
            </form>
        </Modal>
    );
};

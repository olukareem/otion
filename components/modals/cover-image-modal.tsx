"use client"

import {
Dialog, DialogContent, DialogHeader
} from "@/components/ui/dialog";

import { useCoverImage } from "@/hook/use-cover-image";

import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { update } from '../../convex/documents';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImageModal = () => {
    const params = useParams();
    const update = useMutation(api.documents.update);
    const coverImage = useCoverImage();
    const {edgestore} = useEdgeStore();
    const [file, setFile] = useState<File>();
    const [isSubmitting, setIsSubmitting] =  useState(false);

    const onClose = () => {
        setFile(undefined);
        setIsSubmitting(false);
        coverImage.onClose();
    }

    const onChange = async (file?: File) => {
        if (file) {
            setIsSubmitting(true);
            setFile(file);

            const res = await edgestore.publicFiles.upload({
                file
            });

        await update({
            id: params.documentId as Id<"documents">,
            coverImage: res.url
        });

        onClose();
    
        }
    }

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
<DialogContent><DialogHeader>
    <h2 className="text-center text-lg font-semibold">
        Cover Image
    </h2>
    
    </DialogHeader>
<SingleImageDropzone className="w-full outline-none" disabled={isSubmitting} value={file} onChange={onChange}>
    
    </SingleImageDropzone>    </DialogContent>
        </Dialog>
    );
};
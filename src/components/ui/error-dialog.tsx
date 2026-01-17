"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

interface ErrorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
}

export function ErrorDialog({
    open,
    onOpenChange,
    title = "Đã có lỗi xảy ra",
    description = "Vui lòng thử lại sau."
}: ErrorDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="mx-auto bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold text-slate-800">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-500 pt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

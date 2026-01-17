"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteChildAction } from "@/actions/parent"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

export function ChildCardActions({ childId }: { childId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this profile?")) return

        setLoading(true)
        const res = await deleteChildAction(childId)
        setLoading(false)

        if (res.error) {
            alert(res.error)
        } else {
            router.refresh()
        }
    }

    return (
        <div className="flex gap-2 mt-4 justify-end">
            <Link href={`/parent/child/${childId}/edit`}>
                <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-sky-100 border-sky-200 text-sky-600">
                    <Pencil className="w-4 h-4" />
                </Button>
            </Link>
            <Button
                variant="outline"
                size="icon"
                onClick={handleDelete}
                disabled={loading}
                className="rounded-full shadow-sm hover:bg-red-100 border-red-200 text-red-600"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    )
}

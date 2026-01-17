'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { addChildAction } from "@/actions/parent"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"

// Schema
const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z.string().refine((val) => {
        const num = parseInt(val, 10)
        return !isNaN(num) && num >= 3 && num <= 17
    }, "Age must be between 3 and 17")
})

type FormValues = z.infer<typeof schema>

export function AddChildForm() {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState("")

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormValues) => {
        setError("")

        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("age", data.age)

        // Default mascot
        formData.append("mascotId", "cat_explorer")

        const result = await addChildAction(formData)

        if (result && 'error' in result) {
            // Force string or fallback
            setError(result.error || "Unknown error")
        } else {
            setOpen(false)
            reset()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-full shadow-clay bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Child
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-4 border-slate-100 shadow-clay">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl text-primary">Add a New Explorer</DialogTitle>
                    <DialogDescription>
                        Create a profile for your child to start their learning adventure.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="Alice"
                            className="col-span-3"
                            {...register("name")}
                        />
                        {errors.name && (
                            <span className="text-destructive text-sm font-bold">{errors.name.message}</span>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="age" className="text-right">
                            Age
                        </Label>
                        <Input
                            id="age"
                            type="number"
                            placeholder="7"
                            className="col-span-3"
                            {...register("age")}
                        />
                        {errors.age && (
                            <span className="text-destructive text-sm font-bold">{errors.age.message}</span>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-bold text-center border-2 border-destructive/20">
                            {error}
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Creating..." : "Create Profile"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

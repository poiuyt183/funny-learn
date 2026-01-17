"use client"

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
import { PlusCircle, Crown, Lock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { SubscriptionPlan } from "@prisma/client"

interface AddChildGateProps {
    childrenCount: number
    plan: SubscriptionPlan | "FREE" | "PREMIUM" | "FAMILY"
}

export function AddChildGate({ childrenCount, plan }: AddChildGateProps) {
    const [open, setOpen] = useState(false)

    // Define limits (Source of Truth should ideally be shared or passed in)
    const LIMIT = plan === "FREE" ? 1 : 3
    const isBlocked = childrenCount >= LIMIT

    if (!isBlocked) {
        return (
            <Link href="/parent/add-child">
                <Button className="rounded-full shadow-clay bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Child
                </Button>
            </Link>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-full shadow-clay bg-slate-300 hover:bg-slate-400 text-slate-600 font-heading">
                    <Lock className="mr-2 h-5 w-5" />
                    Add Child
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="mx-auto bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Crown className="w-8 h-8 text-amber-500" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold font-heading text-slate-800">
                        Adventure Limit Reached!
                    </DialogTitle>
                    <DialogDescription className="text-center text-lg text-slate-500 pt-2">
                        You&apos;ve reached the maximum number of explorers for the <strong>{plan}</strong> plan.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-slate-50 p-4 rounded-xl text-center space-y-2 my-2">
                    <p className="text-sm text-slate-600">Upgrade to <strong>Premium</strong> to add more children and unlock unlimited AI adventures!</p>
                </div>

                <DialogFooter className="flex flex-col gap-2 sm:flex-col">
                    <Button className="w-full text-lg h-12 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 border-none shadow-lg text-white">
                        Upgrade Plan Now 🚀
                    </Button>
                    <Button variant="ghost" onClick={() => setOpen(false)} className="w-full text-slate-400">
                        Maybe Later
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

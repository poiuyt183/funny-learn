"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getMascots, completeOnboarding } from "@/actions/onboarding"
import { updateChildAction } from "@/actions/parent"
import { useRouter } from "next/navigation"
import { ArrowRight, Check } from "lucide-react"
import type { Mascot } from "@prisma/client"

type FormData = {
    name: string
    age: number
    personality: string[]
    interests: string[]
    mascotId: string
}

const PERSONALITY_TRAITS = [
    { id: "curious", label: "Curious 🔍", color: "bg-blue-100 border-blue-200 text-blue-700" },
    { id: "active", label: "Active ⚡️", color: "bg-yellow-100 border-yellow-200 text-yellow-700" },
    { id: "creative", label: "Creative 🎨", color: "bg-purple-100 border-purple-200 text-purple-700" },
    { id: "shy", label: "Quiet 🌙", color: "bg-indigo-100 border-indigo-200 text-indigo-700" },
    { id: "friendly", label: "Friendly 🤝", color: "bg-green-100 border-green-200 text-green-700" },
    { id: "logical", label: "Logical 🧩", color: "bg-slate-100 border-slate-200 text-slate-700" },
]

const INTERESTS = [
    { id: "space", label: "Space 🚀" },
    { id: "animals", label: "Animals 🐼" },
    { id: "robots", label: "Robots 🤖" },
    { id: "drawing", label: "Art 🖍️" },
    { id: "music", label: "Music 🎵" },
    { id: "stories", label: "Stories 📚" },
    { id: "nature", label: "Nature 🌿" },
]

interface OnboardingWizardProps {
    initialData?: FormData;
    isEditMode?: boolean;
    childId?: string;
}

export function OnboardingWizard({ initialData, isEditMode = false, childId }: OnboardingWizardProps) {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [mascots, setMascots] = useState<Mascot[]>([])
    const [formData, setFormData] = useState<FormData>(initialData || {
        name: "",
        age: 6,
        personality: [],
        interests: [],
        mascotId: "",
    })

    useEffect(() => {
        getMascots().then(setMascots).catch(console.error)
    }, [])

    const handleNext = () => setStep((s) => s + 1)
    const handleBack = () => setStep((s) => s - 1)

    const handleSubmit = async () => {
        setLoading(true)
        let res;

        if (isEditMode && childId) {
            const data = new FormData()
            data.append("name", formData.name)
            data.append("age", formData.age.toString())
            data.append("mascotId", formData.mascotId)
            data.append("personality", JSON.stringify(formData.personality))
            data.append("interests", JSON.stringify(formData.interests))

            res = await updateChildAction(childId, data)
        } else {
            res = await completeOnboarding(formData)
        }

        if (res.success) {
            router.push("/parent/dashboard")
            router.refresh()
        } else {
            alert("Something went wrong! Please try again.")
            setLoading(false)
        }
    }

    const toggleSelection = (field: 'personality' | 'interests', value: string) => {
        setFormData(prev => {
            const distinct = new Set(prev[field])
            if (distinct.has(value)) distinct.delete(value)
            else distinct.add(value)
            return { ...prev, [field]: Array.from(distinct) }
        })
    }

    const variants = {
        enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
    }

    return (
        <div className="mx-auto w-full max-w-3xl overflow-hidden px-4 py-8">
            {/* Progress Bar */}
            <div className="mb-12 flex justify-between px-2 relative">
                <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-100 -z-10 rounded-full" />
                <div className="absolute top-1/2 left-0 h-2 bg-primary -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />

                {[1, 2, 3].map((s) => (
                    <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors border-4 ${step >= s ? "bg-primary text-white border-primary" : "bg-white text-slate-300 border-slate-200"}`}>
                        {s}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait" custom={step}>
                <motion.div
                    key={step}
                    custom={step}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px]"
                >
                    {step === 1 && (
                        <div className="space-y-6 text-center">
                            <h1 className="text-4xl font-heading font-bold text-slate-800">
                                {isEditMode ? "Update Profile ✏️" : "Who is this profile for? 🌟"}
                            </h1>
                            <p className="text-xl text-slate-500">
                                {isEditMode ? "Change details for your explorer" : "Let's start with the basics."}
                            </p>

                            <div className="mx-auto max-w-sm space-y-4 text-left">
                                <div>
                                    <Label className="text-lg">Child&apos;s Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Liam"
                                        className="text-center font-heading text-xl h-16"
                                    />
                                </div>
                                <div>
                                    <Label className="text-lg">Age</Label>
                                    <div className="flex items-center gap-4 justify-center bg-white rounded-2xl p-2 border-2 border-slate-100">
                                        <Button variant="outline" size="icon" onClick={() => setFormData(p => ({ ...p, age: Math.max(3, p.age - 1) }))}>-</Button>
                                        <span className="text-3xl font-bold w-12 text-center">{formData.age}</span>
                                        <Button variant="outline" size="icon" onClick={() => setFormData(p => ({ ...p, age: Math.min(17, p.age + 1) }))}>+</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8">
                                <Button disabled={!formData.name} onClick={handleNext} size="lg" className="w-full max-w-sm text-xl h-16">
                                    Next Step <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 text-center">
                            <h1 className="text-4xl font-heading font-bold text-slate-800">What are they like? 🎨</h1>
                            <p className="text-xl text-slate-500">Select tags that describe your child.</p>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-slate-400 uppercase tracking-widest">Personality</h3>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {PERSONALITY_TRAITS.map(trait => (
                                            <button
                                                key={trait.id}
                                                onClick={() => toggleSelection('personality', trait.id)}
                                                className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${formData.personality.includes(trait.id) ? `scale-105 shadow-md ring-4 ring-offset-2 ring-primary ${trait.color}` : 'bg-white border-2 border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                            >
                                                {trait.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-slate-400 uppercase tracking-widest">Everything they love</h3>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {INTERESTS.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => toggleSelection('interests', item.id)}
                                                className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${formData.interests.includes(item.id) ? 'bg-sky-500 text-white shadow-lg scale-105 ring-4 ring-offset-2 ring-sky-300' : 'bg-white border-2 border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-center gap-4">
                                <Button variant="ghost" onClick={handleBack} className="text-xl text-slate-400">Back</Button>
                                <Button onClick={handleNext} disabled={formData.personality.length === 0} size="lg" className="w-64 text-xl h-16">
                                    Choose Mascot <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 text-center">
                            <h1 className="text-4xl font-heading font-bold text-slate-800">Choose a Companion 🐶</h1>
                            <p className="text-xl text-slate-500">Who will join {formData.name} on their journey?</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                {mascots.map(mascot => (
                                    <div
                                        key={mascot.id}
                                        onClick={() => setFormData({ ...formData, mascotId: mascot.id })}
                                        className={`relative cursor-pointer rounded-3xl p-6 border-4 transition-all ${formData.mascotId === mascot.id ? 'bg-white border-primary shadow-xl scale-105' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                                    >
                                        {formData.mascotId === mascot.id && (
                                            <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full">
                                                <Check className="w-5 h-5" />
                                            </div>
                                        )}
                                        <div className="text-6xl mb-4 text-center block">{'🐻'}</div> {/* Placeholder for Image */}
                                        <h3 className="text-2xl font-bold font-heading mb-2">{mascot.name}</h3>
                                        <p className="text-slate-500">{mascot.description}</p>
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                            {mascot.traits.map(t => (
                                                <span key={t} className="text-xs font-bold bg-slate-100 px-2 py-1 rounded-lg text-slate-500">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 flex justify-center gap-4">
                                <Button variant="ghost" onClick={handleBack} className="text-xl text-slate-400">Back</Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!formData.mascotId || loading}
                                    size="lg"
                                    className="w-64 text-xl h-16 bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 shadow-lg text-white border-none"
                                >
                                    {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Save Changes" : "Start Adventure! 🚀")}
                                </Button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

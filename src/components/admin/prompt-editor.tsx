"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aiPromptSchema, type AiPromptInput } from "@/lib/validations/ai-content";
import { createAiPrompt, updateAiPrompt, togglePromptActive, deleteAiPrompt } from "@/actions/ai-content";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Power, PowerOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface AiPrompt {
    id: string;
    name: string;
    description: string | null;
    content: string;
    safetyRules: string[];
    isActive: boolean;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

interface PromptEditorProps {
    prompts: AiPrompt[];
}

export function PromptEditor({ prompts: initialPrompts }: PromptEditorProps) {
    const router = useRouter();
    const [editingPrompt, setEditingPrompt] = useState<AiPrompt | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<AiPromptInput>({
        resolver: zodResolver(aiPromptSchema),
        defaultValues: {
            name: "",
            description: "",
            content: "",
            safetyRules: [],
            isActive: false,
        },
    });

    function openEditDialog(prompt: AiPrompt) {
        setEditingPrompt(prompt);
        form.reset({
            name: prompt.name,
            description: prompt.description || "",
            content: prompt.content,
            safetyRules: prompt.safetyRules || [],
            isActive: prompt.isActive,
        });
        setDialogOpen(true);
    }

    function openCreateDialog() {
        setEditingPrompt(null);
        form.reset({
            name: "",
            description: "",
            content: "",
            safetyRules: [],
            isActive: false,
        });
        setDialogOpen(true);
    }

    async function onSubmit(data: AiPromptInput) {
        const result = editingPrompt
            ? await updateAiPrompt(editingPrompt.id, data)
            : await createAiPrompt(data);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(editingPrompt ? "Prompt updated!" : "Prompt created!");
            setDialogOpen(false);
            router.refresh();
        }
    }

    async function handleToggleActive(id: string, isActive: boolean) {
        const result = await togglePromptActive(id, isActive);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(isActive ? "Prompt activated" : "Prompt deactivated");
            router.refresh();
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this prompt?")) return;

        const result = await deleteAiPrompt(id);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Prompt deleted");
            router.refresh();
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-slate-800">System Prompts</h2>
                    <p className="text-slate-600">Manage AI conversation prompts</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Prompt
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingPrompt ? "Edit Prompt" : "Create Prompt"}</DialogTitle>
                            <DialogDescription>
                                Use variables: {"{{child_name}}"}, {"{{mascot_name}}"}, {"{{topic}}"}
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Socratic Teacher" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Purpose of this prompt" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prompt Content</FormLabel>
                                            <FormControl>
                                                <Textarea rows={10} placeholder="You are a friendly AI tutor..." {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                System prompt with dynamic variables
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                            <div>
                                                <FormLabel>Active Prompt</FormLabel>
                                                <FormDescription>
                                                    Set as the active prompt for conversations
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="submit">
                                        {editingPrompt ? "Update" : "Create"} Prompt
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {initialPrompts.map((prompt) => (
                    <Card key={prompt.id} className="shadow-clay">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle>{prompt.name}</CardTitle>
                                        {prompt.isActive && (
                                            <Badge className="bg-green-500">Active</Badge>
                                        )}
                                        <Badge variant="outline">v{prompt.version}</Badge>
                                    </div>
                                    {prompt.description && (
                                        <CardDescription>{prompt.description}</CardDescription>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant={prompt.isActive ? "destructive" : "default"}
                                        onClick={() => handleToggleActive(prompt.id, !prompt.isActive)}
                                    >
                                        {prompt.isActive ? (
                                            <PowerOff className="w-4 h-4" />
                                        ) : (
                                            <Power className="w-4 h-4" />
                                        )}
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => openEditDialog(prompt)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleDelete(prompt.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
                                {prompt.content.substring(0, 200)}...
                            </div>
                            {prompt.safetyRules.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-semibold text-slate-700 mb-2">Safety Rules:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {prompt.safetyRules.map((rule: string, i: number) => (
                                            <Badge key={i} variant="destructive">{rule}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

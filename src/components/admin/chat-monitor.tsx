"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toggleFlagStatus } from "@/actions/ai-content";
import { toast } from "sonner";
import { Flag, Eye, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface ConversationLog {
    id: string;
    child: {
        id: string;
        name: string;
        mascotId: string | null;
    };
    sessionId: string;
    userQuery: string;
    aiResponse: string;
    promptUsed: string | null;
    isFlagged: boolean;
    flagReason: string | null;
    createdAt: Date;
}

type LogWithChild = ConversationLog;

interface ChatMonitorProps {
    logs: LogWithChild[];
    total: number;
}

export function ChatMonitor({ logs: initialLogs, total }: ChatMonitorProps) {
    const router = useRouter();
    const [selectedLog, setSelectedLog] = useState<LogWithChild | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [flagReason, setFlagReason] = useState("");
    const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);

    function openLogDetails(log: LogWithChild) {
        setSelectedLog(log);
        setFlagReason(log.flagReason || "");
        setDialogOpen(true);
    }

    async function handleToggleFlag(logId: string, isFlagged: boolean) {
        const result = await toggleFlagStatus({
            logId,
            isFlagged,
            flagReason: isFlagged ? flagReason : undefined,
        });

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(isFlagged ? "Conversation flagged" : "Flag removed");
            setDialogOpen(false);
            router.refresh();
        }
    }

    const displayLogs = showFlaggedOnly
        ? initialLogs.filter((log) => log.isFlagged)
        : initialLogs;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-slate-800">Conversation Monitoring</h2>
                    <p className="text-slate-600">{total} total conversations</p>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="flagged-only"
                        checked={showFlaggedOnly}
                        onCheckedChange={(checked: boolean) => setShowFlaggedOnly(!!checked)}
                    />
                    <label htmlFor="flagged-only" className="text-sm font-medium cursor-pointer">
                        Show flagged only
                    </label>
                </div>
            </div>

            <div className="grid gap-4">
                {displayLogs.map((log) => (
                    <Card key={log.id} className={`shadow-clay ${log.isFlagged ? "border-red-300 bg-red-50/30" : ""}`}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-lg">{log.child.name}</CardTitle>
                                        {log.isFlagged && (
                                            <Badge variant="destructive" className="gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                Flagged
                                            </Badge>
                                        )}
                                        <Badge variant="outline">
                                            {format(new Date(log.createdAt), "MMM d, HH:mm")}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-semibold text-slate-700">Question:</span>
                                            <p className="text-slate-600 mt-1">
                                                {log.userQuery.substring(0, 150)}
                                                {log.userQuery.length > 150 && "..."}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-700">Response:</span>
                                            <p className="text-slate-600 mt-1">
                                                {log.aiResponse.substring(0, 150)}
                                                {log.aiResponse.length > 150 && "..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => openLogDetails(log)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Details
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* Detail Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    {selectedLog && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Conversation Details</DialogTitle>
                                <DialogDescription>
                                    {selectedLog.child.name} • {format(new Date(selectedLog.createdAt), "PPpp")}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <p className="text-xs font-bold text-blue-700 uppercase mb-2">User Query</p>
                                    <p className="text-slate-700">{selectedLog.userQuery}</p>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4">
                                    <p className="text-xs font-bold text-green-700 uppercase mb-2">AI Response</p>
                                    <p className="text-slate-700">{selectedLog.aiResponse}</p>
                                </div>

                                {selectedLog.promptUsed && (
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <p className="text-xs font-bold text-slate-700 uppercase mb-2">Prompt Used</p>
                                        <p className="text-slate-600 text-sm">{selectedLog.promptUsed}</p>
                                    </div>
                                )}

                                <div className="border-t pt-4">
                                    <p className="text-sm font-semibold text-slate-700 mb-2">Flag Reason</p>
                                    <Textarea
                                        value={flagReason}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFlagReason(e.target.value)}
                                        placeholder="Reason for flagging this conversation"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    {selectedLog.isFlagged ? (
                                        <Button
                                            onClick={() => handleToggleFlag(selectedLog.id, false)}
                                            variant="outline"
                                        >
                                            Remove Flag
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleToggleFlag(selectedLog.id, true)}
                                            variant="destructive"
                                        >
                                            <Flag className="w-4 h-4 mr-2" />
                                            Flag Conversation
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

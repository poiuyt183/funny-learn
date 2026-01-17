import { getAiPrompts, getChatLogs, getAiContentStats } from "@/actions/ai-content";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptEditor } from "@/components/admin/prompt-editor";
import { ChatMonitor } from "@/components/admin/chat-monitor";
import { MessageSquare, FileText, Flag, Zap } from "lucide-react";

export default async function AiContentPage() {
    const [promptsResult, logsResult, stats] = await Promise.all([
        getAiPrompts(1, 20),
        getChatLogs({ limit: 20, offset: 0 }),
        getAiContentStats(),
    ]);

    const prompts = ("prompts" in promptsResult ? promptsResult.prompts : []) || [];
    const logs = ("logs" in logsResult ? logsResult.logs : []) || [];
    const total = ("total" in logsResult ? logsResult.total : 0) || 0;

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-heading font-bold text-slate-800">
                    AI Content Management
                </h1>
                <p className="text-slate-500 text-lg">
                    Manage system prompts and monitor conversations
                </p>
            </div>

            {/* Stats Cards */}
            {"totalPrompts" in stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="shadow-clay">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-700">
                                Total Prompts
                            </CardTitle>
                            <FileText className="h-5 w-5 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">{stats.totalPrompts}</div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-clay">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-700">
                                Active Prompts
                            </CardTitle>
                            <Zap className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">{stats.activePrompts}</div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-clay">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-700">
                                Conversations
                            </CardTitle>
                            <MessageSquare className="h-5 w-5 text-secondary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-secondary">{stats.totalConversations}</div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-clay border-red-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-700">
                                Flagged
                            </CardTitle>
                            <Flag className="h-5 w-5 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">{stats.flaggedConversations}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="prompts" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="prompts">
                        <FileText className="w-4 h-4 mr-2" />
                        Prompt Editor
                    </TabsTrigger>
                    <TabsTrigger value="chat">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat Monitoring
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="prompts">
                    <PromptEditor prompts={prompts} />
                </TabsContent>

                <TabsContent value="chat">
                    <ChatMonitor logs={logs} total={total} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

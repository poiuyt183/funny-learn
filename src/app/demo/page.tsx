import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-sky-50 p-8 flex flex-col items-center gap-12">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-heading text-primary font-bold drop-shadow-sm">
                    Welcome to AI-Land! 🚀
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl">
                    A playful, safe, and encouraging space for kids to learn. This demo showcases the
                    <span className="font-bold text-accent"> Primary School UI Theme</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                {/* Card Example */}
                <Card className="shadow-clay">
                    <CardHeader>
                        <CardTitle>Super Math Adventure</CardTitle>
                        <CardDescription>Master multiplication with space cats!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-6 bg-sky-100 rounded-3xl border-2 border-sky-200 mb-6 flex items-center justify-center">
                            <span className="text-6xl">🐱✖️🔢</span>
                        </div>
                        <p className="text-slate-600 mb-4">
                            Join Captain Whisker on a journey through the galaxy designed to help you verify your math skills.
                        </p>
                    </CardContent>
                    <CardFooter className="flex gap-4">
                        <Button variant="cta" size="lg" className="w-full">
                            Start playing! 🎮
                        </Button>
                    </CardFooter>
                </Card>

                {/* Input & Form Example */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-secondary">Create Your Profile</CardTitle>
                        <CardDescription>Let&apos;s get you set up for fun.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-lg font-heading text-slate-700">What&apos;s your name?</Label>
                            <Input placeholder="Super Kid..." />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-lg font-heading text-slate-700">Secret Code (Password)</Label>
                            <Input type="password" placeholder="••••••••" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="default" size="lg" className="w-full bg-secondary hover:bg-secondary/90 shadow-[0_4px_0_oklch(0.6_0.16_160)]">
                            Join the Squad! 🌟
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Buttons Showcase */}
            <div className="flex flex-wrap gap-6 items-center justify-center p-8 bg-white rounded-[3rem] border-4 border-slate-100 w-full max-w-5xl">
                <div className="w-full text-center text-slate-400 font-bold mb-2">BUTTON VARIANTS</div>
                <Button variant="default" size="lg">Default Button</Button>
                <Button variant="cta" size="lg">CTA Action 🚀</Button>
                <Button variant="secondary" size="lg">Secondary</Button>
                <Button variant="destructive" size="lg">Danger Zone</Button>
                <Button variant="outline" size="lg">Outline</Button>
                <Button variant="ghost" size="lg">Ghost</Button>
            </div>
        </div>
    );
}

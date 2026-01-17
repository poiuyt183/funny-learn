import { getMascots } from "@/actions/mascot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MascotTable } from "@/components/admin/mascot-table";
import { MascotFormDialog } from "@/components/admin/mascot-form-dialog";

export default async function MascotsPage() {
    const mascots = await getMascots();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 font-heading">
                        Quản Lý Linh Thú
                    </h1>
                    <p className="text-slate-500 text-lg mt-2">
                        Thêm, chỉnh sửa hoặc xóa linh thú đồng hành cho học sinh
                    </p>
                </div>
                <MascotFormDialog />
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-clay border-sky-100">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-700">
                            Tổng Số Linh Thú
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">{mascots.length}</div>
                    </CardContent>
                </Card>

                <Card className="shadow-clay border-green-100">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-700">
                            Đang Được Sử Dụng
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {mascots.filter((m) => m._count.children > 0).length}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-clay border-orange-100">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-700">
                            Chưa Được Chọn
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">
                            {mascots.filter((m) => m._count.children === 0).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Mascots Table */}
            <Card className="shadow-lg border-slate-200">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">
                        Danh Sách Linh Thú
                    </CardTitle>
                    <CardDescription>
                        Quản lý tất cả linh thú trong hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MascotTable mascots={mascots} />
                </CardContent>
            </Card>
        </div>
    );
}

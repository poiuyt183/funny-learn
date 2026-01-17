"use client"

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { MascotFormDialog } from "./mascot-form-dialog";
import { deleteMascot } from "@/actions/mascot";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Mascot = {
    id: string;
    name: string;
    type: string;
    description: string;
    imageUrl: string;
    basePersonality: string;
    baseGreeting: string;
    traits: string[];
    _count: {
        children: number;
    };
};

interface MascotTableProps {
    mascots: Mascot[];
}

export function MascotTable({ mascots }: MascotTableProps) {
    const router = useRouter();
    const [selectedMascot, setSelectedMascot] = useState<Mascot | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const handleDelete = async (mascot: Mascot) => {
        if (!confirm(`Bạn có chắc muốn xóa linh thú "${mascot.name}"?`)) return;

        const result = await deleteMascot(mascot.id);

        if (result.success) {
            toast.success("Xóa linh thú thành công");
            router.refresh();
        } else {
            toast.error(result.error || "Không thể xóa linh thú");
        }
    };

    const handleEdit = (mascot: Mascot) => {
        setSelectedMascot(mascot);
        setEditDialogOpen(true);
    };

    return (
        <>
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Hình Ảnh</TableHead>
                            <TableHead>Tên</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Tính Cách</TableHead>
                            <TableHead>Đặc Điểm</TableHead>
                            <TableHead>Đang Dùng</TableHead>
                            <TableHead>Hành Động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mascots.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Chưa có linh thú nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            mascots.map((mascot) => (
                                <TableRow key={mascot.id}>
                                    <TableCell>
                                        <img
                                            src={mascot.imageUrl}
                                            alt={mascot.name}
                                            className="h-12 w-12 rounded-full object-cover border-2 border-sky-200"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://via.placeholder.com/48";
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-slate-800">{mascot.name}</div>
                                        <div className="text-xs text-slate-500 truncate max-w-[200px]">
                                            {mascot.description}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{mascot.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-slate-600">{mascot.basePersonality}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {mascot.traits.slice(0, 2).map((trait) => (
                                                <Badge key={trait} variant="secondary" className="text-xs">
                                                    {trait}
                                                </Badge>
                                            ))}
                                            {mascot.traits.length > 2 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{mascot.traits.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={mascot._count.children > 0 ? "default" : "outline"}>
                                            {mascot._count.children} học sinh
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleEdit(mascot)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Chỉnh Sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(mascot)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            {selectedMascot && (
                <MascotFormDialog
                    mascot={selectedMascot}
                    trigger={<div style={{ display: editDialogOpen ? "block" : "none" }} />}
                />
            )}
        </>
    );
}

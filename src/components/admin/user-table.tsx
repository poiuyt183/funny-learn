"use client"

import { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
} from "@tanstack/react-table";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Trash2, Edit } from "lucide-react";
import { updateUserRole, deleteUser } from "@/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type User = {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
    subscription: {
        plan: string;
    } | null;
    children: unknown[];
};

interface UserTableProps {
    initialData: User[];
}

export function UserTable({ initialData }: UserTableProps) {
    const router = useRouter();
    const [data, setData] = useState<User[]>(initialData);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const handleRoleChange = async (userId: string, newRole: "PARENT" | "STUDENT" | "ADMIN") => {
        const result = await updateUserRole(userId, newRole);
        if (result.success) {
            toast.success("Role updated successfully");
            router.refresh();
        } else {
            toast.error(result.error || "Failed to update role");
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const result = await deleteUser(userId);
        if (result.success) {
            toast.success("User deleted successfully");
            setData(prev => prev.filter(u => u.id !== userId));
        } else {
            toast.error(result.error || "Failed to delete user");
        }
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                return (
                    <div className="font-medium text-slate-800">
                        {row.getValue("name") || "No Name"}
                    </div>
                );
            },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="text-slate-600">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.getValue("role") as string;
                const colors: Record<string, string> = {
                    ADMIN: "bg-red-100 text-red-700",
                    PARENT: "bg-blue-100 text-blue-700",
                    STUDENT: "bg-green-100 text-green-700",
                };
                return (
                    <Badge className={colors[role] || "bg-gray-100 text-gray-700"}>
                        {role}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "subscription",
            header: "Plan",
            cell: ({ row }) => {
                const sub = row.original.subscription;
                return (
                    <Badge variant={sub?.plan === "FREE" ? "outline" : "default"}>
                        {sub?.plan || "N/A"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "children",
            header: "Children",
            cell: ({ row }) => {
                const count = row.original.children.length;
                return <div className="text-center">{count}</div>;
            },
        },
        {
            accessorKey: "createdAt",
            header: "Joined",
            cell: ({ row }) => {
                return new Date(row.getValue("createdAt")).toLocaleDateString("vi-VN");
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "PARENT")}>
                                <Edit className="mr-2 h-4 w-4" />
                                Set as Parent
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "STUDENT")}>
                                <Edit className="mr-2 h-4 w-4" />
                                Set as Student
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "ADMIN")}>
                                <Edit className="mr-2 h-4 w-4" />
                                Set as Admin
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleDelete(user.id)}
                                className="text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
    });

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search by name or email..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-10 rounded-full"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

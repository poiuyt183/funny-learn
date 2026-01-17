import { getAllUsers } from "@/actions/admin";
import { UserTable } from "@/components/admin/user-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UserManagementPage() {
    const users = await getAllUsers();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-slate-800 font-heading">User Management</h1>
                <p className="text-slate-500 text-lg mt-2">
                    Manage all user accounts, roles, and subscriptions
                </p>
            </div>

            {/* User Table */}
            <Card className="shadow-lg border-slate-200">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">All Users</CardTitle>
                    <CardDescription>
                        Total: {users.length} users registered
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserTable initialData={users} />
                </CardContent>
            </Card>
        </div>
    );
}

'use server'

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Prisma, SubscriptionPlan, SubscriptionStatus, PaymentProvider } from "@prisma/client";

/**
 * Verify if user is ADMIN (throws error if not)
 */
async function verifyAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }

    return session;
}

/**
 * Get all subscriptions with filtering
 */
export async function getSubscriptions(filters?: {
    status?: SubscriptionStatus;
    plan?: SubscriptionPlan;
    limit?: number;
}) {
    await verifyAdmin();

    const where: Prisma.SubscriptionWhereInput = {};

    if (filters?.status) {
        where.status = filters.status;
    }

    if (filters?.plan) {
        where.plan = filters.plan;
    }

    const subscriptions = await prisma.subscription.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            payments: {
                orderBy: { createdAt: "desc" },
                take: 5,
            },
        },
        orderBy: { createdAt: "desc" },
        take: filters?.limit || 100,
    });

    return subscriptions;
}

/**
 * Manual upgrade subscription (Admin only)
 */
export async function manualUpgrade(data: {
    userId: string;
    plan: SubscriptionPlan;
    durationMonths: number;
    reason?: string;
}) {
    await verifyAdmin();

    try {
        // Calculate end date
        const now = new Date();
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + data.durationMonths);

        // Update or create subscription
        const subscription = await prisma.subscription.upsert({
            where: { userId: data.userId },
            update: {
                plan: data.plan,
                status: SubscriptionStatus.ACTIVE,
                provider: PaymentProvider.MANUAL,
                startDate: now,
                endDate: endDate,
                isActive: true,
            },
            create: {
                userId: data.userId,
                plan: data.plan,
                status: SubscriptionStatus.ACTIVE,
                provider: PaymentProvider.MANUAL,
                startDate: now,
                endDate: endDate,
                isActive: true,
            },
        });

        // Record payment history
        const PRICING = { FREE: 0, PREMIUM: 10, FAMILY: 15 };
        await prisma.paymentHistory.create({
            data: {
                subscriptionId: subscription.id,
                amount: PRICING[data.plan] * data.durationMonths,
                currency: "USD",
                status: "SUCCESS",
                provider: PaymentProvider.MANUAL,
                description: data.reason || `Manual upgrade by admin - ${data.durationMonths}mo ${data.plan}`,
            },
        });

        revalidatePath("/admin/subscriptions");
        return { success: true };
    } catch (error) {
        console.error("Manual upgrade error:", error);
        return { error: "Failed to upgrade subscription" };
    }
}

/**
 * Update subscription details
 */
export async function updateSubscription(subscriptionId: string, data: {
    plan?: SubscriptionPlan;
    status?: SubscriptionStatus;
    endDate?: Date;
}) {
    await verifyAdmin();

    try {
        await prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                ...data,
                isActive: data.status === SubscriptionStatus.ACTIVE,
            },
        });

        revalidatePath("/admin/subscriptions");
        return { success: true };
    } catch {
        return { error: "Failed to update subscription" };
    }
}

/**
 * Get subscription analytics
 */
export async function getSubscriptionAnalytics() {
    await verifyAdmin();

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
        activeSubscriptions,
        newSubscriptions,
        canceledSubscriptions,
        allPayments,
    ] = await Promise.all([
        prisma.subscription.count({
            where: { status: SubscriptionStatus.ACTIVE },
        }),
        prisma.subscription.count({
            where: {
                createdAt: { gte: thirtyDaysAgo },
                status: SubscriptionStatus.ACTIVE,
            },
        }),
        prisma.subscription.count({
            where: {
                status: SubscriptionStatus.CANCELED,
                updatedAt: { gte: thirtyDaysAgo },
            },
        }),
        prisma.paymentHistory.findMany({
            where: {
                status: "SUCCESS",
                createdAt: {
                    gte: new Date(now.getFullYear(), now.getMonth(), 1), // Start of current month
                },
            },
            select: { amount: true },
        }),
    ]);

    // Calculate MRR (Monthly Recurring Revenue)
    const mrr = allPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Calculate Churn Rate
    const totalSubscriptions = activeSubscriptions + canceledSubscriptions;
    const churnRate = totalSubscriptions > 0
        ? ((canceledSubscriptions / totalSubscriptions) * 100).toFixed(1)
        : "0";

    // Get plan distribution
    const planDistribution = await prisma.subscription.groupBy({
        by: ['plan'],
        where: { status: SubscriptionStatus.ACTIVE },
        _count: { plan: true },
    });

    return {
        mrr,
        activeSubscriptions,
        newSubscriptions,
        churnRate: parseFloat(churnRate),
        planDistribution: planDistribution.map(p => ({
            plan: p.plan,
            count: p._count.plan,
        })),
    };
}

/**
 * Get recent payments
 */
export async function getRecentPayments(limit = 10) {
    await verifyAdmin();

    const payments = await prisma.paymentHistory.findMany({
        include: {
            subscription: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
    });

    return payments;
}

/**
 * Get user's current subscription (Parent-facing)
 */
export async function getCurrentSubscription() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
        include: {
            payments: {
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
    });

    return subscription;
}

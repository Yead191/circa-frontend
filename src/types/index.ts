export interface User {
    _id: string;
    name: string;
    email: string;
    image: string;
}

export interface Post {
    _id: string;
    user: User;
    title: string;
    description: string;
    images: string[];
    video: string;
    who_can_see: "Everyone" | "Friends" | "Only me";
    post_visibility: ("Everyone" | "Friends" | "Only me")[];
    like_count: number;
    comment_count: number;
    is_18_plus: boolean;
    status: "draft" | "published" | "archived";
    schedule_post: boolean;
    scdule_date: string; // ISO 8601 date string
    schedule_time: string; // e.g. "05:22 AM"
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
    __v: number;
    timeAgo: string;
    isLike?: boolean
}

export interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    status: "active" | "inactive";
    product_style: "Physical" | "Digital";
    author: string;
    total_sold: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Comment {
    _id: string;
    user: User | User[];
    post: string;
    for: "post" | "reel" | "story";
    comment_text: string;
    like_count: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    reply: Comment[];
    isLike?: boolean
}

export interface Analytics {
    totalSale: number;
    totalEarning: number;
    totalMembers: number;
}

export interface Statistics {
    _id: string;
    credit: number;
    balance: number;
    analatys: Analytics;
}

export interface UserInfo {
    _id: string;
    name: string;
    email: string;
    image: string;
}

export type TransactionStatus = "Success" | "Pending" | "Failed";
export type TransactionType = "Debit" | "Credit";
export type TransactionCategory = "Gift" | "Purchase" | "Refund" | "Transfer";

export interface Transaction {
    _id: string;
    user: UserInfo;
    creator: UserInfo;
    total_price: number;
    payment_received: number;
    credit_received: number;
    discount_percentage: number;
    discount_amount: number;
    platform_fee: number;
    status: TransactionStatus;
    type: TransactionType;
    category: TransactionCategory;
    createdAt: string;
    updatedAt: string;
    transaction_id: string;
    prev_transaction_id: string;
    __v: number;
}
export interface Pagination {
    total: number;
    limit: number;
    page: number;
    totalPage: number;
}

export type PlanStatus = "active" | "inactive";
export type PlanCategory = "Monthly" | "Weekly" | "Yearly";

export interface PlanFeature {
    _id: string;
    name: string;
    status: boolean;
    discount: number;
}

export interface Plan {
    _id: string;
    name: string;
    subtitle: string;
    price: number;
    features: PlanFeature[];
    status: PlanStatus;
    category: PlanCategory;
    duration: number;
    emoji: string;
    user: string;
    fromAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
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
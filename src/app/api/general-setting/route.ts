import {NextResponse} from "next/server";

export async function POST() {
    try {
        const data = {
            site_name: "Nextjs",
            site_title: "Nextjs",
            site_description: "Nextjs",
            site_keywords: "Nextjs",
            site_author: "Nextjs",
            site_email: "Nextjs",
            site_phone: "Nextjs",
            site_address: "Nextjs",
            site_logo: "Nextjs",
            site_favicon: "Nextjs",
            site_logo_bg: "Nextjs",
            site_favicon_bg: "Nextjs",
            location_version: "Nextjs",
            fee_version: "Nextjs",
        }
        return NextResponse.json({data: data});
    } catch (error) {
        return NextResponse.json({error: "api backend error"});
    }
}
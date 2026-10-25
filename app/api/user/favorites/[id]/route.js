import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req, { params }) {
    const { id } = await params;
    const data = await req.json();

    try {
        await dbConnect();
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 404 });
        }
        if (data.action === "add") {
            if (!user.favorites.includes(data.favoriteID)) {
                user.favorites.push(data.favoriteID);
            }
        } else if (data.action === "remove") {
            user.favorites = user.favorites.filter(fav => fav !== data.favoriteID);
        }
        await user.save();
        return NextResponse.json({ message: 'Favorites updated', id: user._id, email: user.email, name: user.name, favorites: user.favorites }, { status: 201 });
    } catch (err) {
        console.error('favorites POST error', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function GET(req, { params }) {
    const { id } = await params;

    try {
        await dbConnect();
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 404 });
        }
        const favorites = user.favorites;

        return NextResponse.json({ message: 'Favorites fetched', id: user._id, email: user.email, name: user.name, favorites: favorites }, { status: 200 });
    } catch (err) {
        console.error('favorites GET error', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
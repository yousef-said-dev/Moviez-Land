import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req,{ params }) {
    const {id} = await params;
    const data = await req.json()
    console.log(  data)
    try{
        await dbConnect();
        const user = await User.findById(id);
        if(user.length === 0){
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
        }
        if(data.action === "add"){
            user.favorites.push(data.favoriteID);
        }
        else if(data.action === "remove"){
            user.favorites = user.favorites.filter(fav => fav !== data.favoriteID);
        }
        await user.save();
        return NextResponse.json({ message: 'Favorites updated', id: user._id, email: user.email, name:user.name, favorites:user.favorites }, { status: 201 });
    }catch(err){
        console.error('auth signup error', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function GET(req,{ params }) {
    const {id} = await params;
    console.log(id)
    console.log( 'Fetching favorites for user:', id);
    try{
        await dbConnect();
        const user = await User.findById(id);
        if(user.length === 0){
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
        }
        const favorites = user.favorites;
        console.log(favorites);
        return NextResponse.json({ message: 'Favorites fetched', id: user._id, email: user.email, name:user.name, favorites:favorites }, { status: 201 });
    }catch(err){
        console.error('auth signup error', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
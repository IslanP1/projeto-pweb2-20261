import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar/>

            <main className="mx-auto max-w-7xl px-6 pt-24">

                <Outlet/>

            </main>

        </div>

    );

}
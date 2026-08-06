import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import type { AppDispatch } from "../../app/store";
import { fetchCategories } from "../../features/transaction/transactionThunk";
import { selectCategoriesStatus } from "../../features/transaction/transactionSelectors";

export default function MainLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const categoriesStatus = useSelector(selectCategoriesStatus);

    useEffect(() => {
        if (categoriesStatus === 'idle') {
            dispatch(fetchCategories());
        }
    }, [dispatch, categoriesStatus]);

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar/>

            <main className="mx-auto max-w-7xl px-6 pt-24">

                <Outlet/>

            </main>

        </div>

    );

}
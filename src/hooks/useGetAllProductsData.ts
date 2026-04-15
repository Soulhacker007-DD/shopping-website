import { setAllProductsData } from "@/redux/vendorSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllProductsData = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("/api/product/all-products-data");
                dispatch(setAllProductsData(response.data));
            } catch (error: any) {
                if (error?.response?.status !== 401 && error?.response?.status !== 400 && error?.response?.status !== 403 && error?.response?.status !== 404) {
                    console.error("Error fetching products:", error);
                }
            }
        };

        fetchProducts();
    }, [dispatch]);
};

export default useGetAllProductsData;

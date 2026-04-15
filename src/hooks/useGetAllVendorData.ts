import { setAllVendorData } from "@/redux/vendorSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllVendorData = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await axios.get("/api/vendor/all-vendor");
                dispatch(setAllVendorData(response.data));
            } catch (error: any) {
                if (error?.response?.status !== 401 && error?.response?.status !== 400 && error?.response?.status !== 403 && error?.response?.status !== 404) {
                    console.error("Error fetching vendors:", error);
                }
            }
        };

        fetchVendors();
    }, [dispatch]);
};

export default useGetAllVendorData;

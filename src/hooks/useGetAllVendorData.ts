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
            } catch (error) {
                console.error("Error fetching vendors:", error);
            }
        };

        fetchVendors();
    }, [dispatch]);
};

export default useGetAllVendorData;

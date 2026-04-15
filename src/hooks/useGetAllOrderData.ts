import { setAllOrderData } from "@/redux/orderSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllOrderData = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("/api/order/allOrder");
                dispatch(setAllOrderData(response.data.orders));
            } catch (error: any) {
                if (error?.response?.status !== 401 && error?.response?.status !== 400 && error?.response?.status !== 404) {
                    console.error("Error fetching orders:", error);
                }
            }
        };

        fetchOrders();
    }, [dispatch]);
};

export default useGetAllOrderData;

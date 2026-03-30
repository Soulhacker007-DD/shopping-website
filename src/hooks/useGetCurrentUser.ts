import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetCurrentUser = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/api/currentUser");
                dispatch(setUserData(response.data));
            } catch (error: any) {
                if (error?.response?.status !== 401 && error?.response?.status !== 400 && error?.response?.status !== 404) {
                    console.error("Error fetching current user:", error);
                }
            }
        };

        fetchUser();
    }, [dispatch]);
};

export default useGetCurrentUser;
